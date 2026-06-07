#!/usr/bin/env python3
from __future__ import annotations

import argparse
import datetime as _dt
import json
import os
import re
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

HEADING_RE = re.compile(r'^(?P<indent>\s{0,3})(?P<hashes>#{1,6})\s+(?P<title>.+?)\s*$')
LINK_RE = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')
PREREQ_TITLE_RE = re.compile(r'\bprerequisites?\b', re.IGNORECASE)
IGNORE_DIRS = {
    '.git', '.hg', '.svn', '.obsidian', '.idea', '.vscode',
    'site', 'dist', 'build', '__pycache__', 'node_modules',
    '_prereq_cleanup_backup', '_prereq_cleanup_report',
}


@dataclass
class BulletItem:
    raw_lines: list[str]
    target: str | None
    text: str


@dataclass
class SectionInfo:
    start_idx: int
    end_idx: int
    heading_level: int
    heading_line: str
    items: list[BulletItem]


@dataclass
class FileInfo:
    path: Path
    rel: str
    lines: list[str]
    section: SectionInfo | None
    direct_targets: list[str]


def norm_posix(p: Path | str) -> str:
    return Path(p).as_posix().lstrip('./')


def should_skip_dir(path: Path) -> bool:
    return path.name in IGNORE_DIRS


def iter_md_files(root: Path) -> Iterable[Path]:
    for dirpath, dirnames, filenames in os.walk(root):
        current = Path(dirpath)
        dirnames[:] = [d for d in dirnames if not should_skip_dir(current / d)]
        for name in filenames:
            if name.lower().endswith('.md'):
                yield current / name


def resolve_link_target(src_file: Path, href: str, root: Path) -> str | None:
    href = (href or '').strip()
    if not href:
        return None
    href = href.split('#', 1)[0].split('?', 1)[0].strip()
    if not href:
        return None
    if re.match(r'^[a-z]+://', href, re.IGNORECASE):
        return None

    target = (src_file.parent / href).resolve()
    try:
        rel = target.relative_to(root.resolve())
    except Exception:
        return None

    rel_path = Path(rel)
    if rel_path.suffix.lower() != '.md':
        return None
    return norm_posix(rel_path)


def parse_bullet_items(section_lines: list[str], src_file: Path, root: Path) -> list[BulletItem]:
    items: list[BulletItem] = []
    current: list[str] = []

    def flush() -> None:
        nonlocal current
        if not current:
            return
        text = ''.join(current)
        m = LINK_RE.search(text)
        target = resolve_link_target(src_file, m.group(2), root) if m else None
        items.append(BulletItem(raw_lines=current[:], target=target, text=text))
        current = []

    for line in section_lines:
        if re.match(r'^\s*[-*+]\s+', line):
            flush()
            current = [line]
        elif current and (line.strip() == '' or re.match(r'^\s{2,}|^\t', line)):
            current.append(line)
        elif current:
            flush()
            # Non-bullet line inside the section; keep as standalone item with no target.
            current = [line]
        else:
            current = [line]
            flush()

    flush()
    return items


def find_prereq_section(lines: list[str], src_file: Path, root: Path) -> SectionInfo | None:
    matches: list[tuple[int, int, str]] = []
    for i, line in enumerate(lines):
        m = HEADING_RE.match(line)
        if not m:
            continue
        title = m.group('title').strip()
        if PREREQ_TITLE_RE.search(title):
            matches.append((i, len(m.group('hashes')), line))

    if not matches:
        return None

    # Use the first prerequisites heading.
    start_idx, level, heading_line = matches[0]
    end_idx = len(lines)
    for j in range(start_idx + 1, len(lines)):
        m = HEADING_RE.match(lines[j])
        if m and len(m.group('hashes')) <= level:
            end_idx = j
            break

    section_lines = lines[start_idx + 1:end_idx]
    items = parse_bullet_items(section_lines, src_file, root)
    return SectionInfo(
        start_idx=start_idx,
        end_idx=end_idx,
        heading_level=level,
        heading_line=heading_line,
        items=items,
    )


def load_file_info(path: Path, root: Path) -> FileInfo:
    text = path.read_text(encoding='utf-8')
    lines = text.splitlines(keepends=True)
    section = find_prereq_section(lines, path, root)
    direct_targets: list[str] = []
    if section:
        seen: set[str] = set()
        for item in section.items:
            if item.target and item.target not in seen:
                direct_targets.append(item.target)
                seen.add(item.target)
    return FileInfo(path=path, rel=norm_posix(path.relative_to(root)), lines=lines, section=section, direct_targets=direct_targets)


def reachable_from(start: str, graph: dict[str, list[str]]) -> set[str]:
    visited: set[str] = set()
    stack = list(graph.get(start, []))
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        stack.extend(graph.get(node, []))
    return visited


def dedupe_items(items: list[BulletItem]) -> tuple[list[BulletItem], set[str]]:
    kept: list[BulletItem] = []
    seen_targets: set[str] = set()
    removed_targets: set[str] = set()
    for item in items:
        if item.target is None:
            kept.append(item)
            continue
        if item.target in seen_targets:
            removed_targets.add(item.target)
            continue
        seen_targets.add(item.target)
        kept.append(item)
    return kept, removed_targets


def build_new_section_lines(info: FileInfo, graph: dict[str, list[str]]) -> tuple[list[str], dict]:
    assert info.section is not None
    items, dedup_removed = dedupe_items(info.section.items)

    parsed_targets_in_order = [it.target for it in items if it.target]
    reach_cache = {t: reachable_from(t, graph) for t in parsed_targets_in_order}

    redundant: set[str] = set(dedup_removed)
    for i, target in enumerate(parsed_targets_in_order):
        for j, other in enumerate(parsed_targets_in_order):
            if i == j or not other:
                continue
            if target in reach_cache.get(other, set()):
                redundant.add(target)
                break

    kept_lines: list[str] = []
    before_count = 0
    after_count = 0
    removed_map: dict[str, str] = {}

    for item in items:
        if item.target is None:
            kept_lines.extend(item.raw_lines)
            continue
        before_count += 1
        if item.target in redundant:
            removed_map[item.target] = item.text.strip().replace('\n', ' ')
            continue
        after_count += 1
        kept_lines.extend(item.raw_lines)

    # Ensure a clean single blank line at the end of the section body.
    if kept_lines and kept_lines[-1].strip() != '':
        kept_lines.append('\n')

    stats = {
        'before': before_count,
        'after': after_count,
        'removed': sorted(redundant),
        'removed_text': removed_map,
    }
    return kept_lines, stats


def write_updated_file(info: FileInfo, new_section_lines: list[str], dry_run: bool) -> None:
    assert info.section is not None
    new_lines = info.lines[:info.section.start_idx + 1] + new_section_lines + info.lines[info.section.end_idx:]
    if not dry_run:
        info.path.write_text(''.join(new_lines), encoding='utf-8', newline='')


def make_backup(root: Path, files: list[Path], dry_run: bool) -> Path | None:
    if dry_run or not files:
        return None
    stamp = _dt.datetime.now().strftime('%Y%m%d-%H%M%S')
    backup_root = root / '_prereq_cleanup_backup' / stamp
    for src in files:
        rel = src.relative_to(root)
        dst = backup_root / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
    return backup_root


def main() -> int:
    parser = argparse.ArgumentParser(description='Remove redundant prerequisite links from Markdown files.')
    parser.add_argument('root', nargs='?', default='.', help='Root folder to scan.')
    parser.add_argument('--dry-run', action='store_true', help='Analyse only, do not modify files.')
    parser.add_argument('--no-backup', action='store_true', help='Do not create a backup before writing.')
    parser.add_argument('--report-json', default='', help='Optional path to write a JSON report.')
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists() or not root.is_dir():
        print(f'[ERROR] Folder not found: {root}', file=sys.stderr)
        return 2

    md_files = sorted(iter_md_files(root))
    if not md_files:
        print('[INFO] No Markdown files found.')
        return 0

    infos = [load_file_info(path, root) for path in md_files]
    existing = {info.rel for info in infos}
    graph: dict[str, list[str]] = {}
    for info in infos:
        graph[info.rel] = [t for t in info.direct_targets if t in existing]

    changes: list[dict] = []
    files_to_backup: list[Path] = []

    for info in infos:
        if not info.section:
            continue
        new_section_lines, stats = build_new_section_lines(info, graph)
        if stats['before'] != stats['after'] or stats['removed']:
            changes.append({
                'file': info.rel,
                **stats,
            })
            files_to_backup.append(info.path)
            write_updated_file(info, new_section_lines, dry_run=args.dry_run)

    backup_root = None
    if not args.no_backup:
        backup_root = make_backup(root, files_to_backup, dry_run=args.dry_run)

    summary = {
        'root': norm_posix(root),
        'total_markdown_files': len(md_files),
        'files_with_changes': len(changes),
        'total_removed_prerequisites': sum(len(x['removed']) for x in changes),
        'dry_run': bool(args.dry_run),
        'backup_root': norm_posix(backup_root) if backup_root else '',
        'changes': changes,
    }

    if args.report_json:
        report_path = Path(args.report_json)
        if not report_path.is_absolute():
            report_path = root / report_path
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')

    print('=== Prerequisite cleanup summary ===')
    print(f"Root: {root}")
    print(f"Markdown files scanned: {len(md_files)}")
    print(f"Files changed: {len(changes)}")
    print(f"Removed prerequisite links: {summary['total_removed_prerequisites']}")
    if backup_root:
        print(f"Backup: {backup_root}")
    if not changes:
        print('No redundant prerequisites found.')
    else:
        print('Changed files:')
        for item in changes:
            print(f"  - {item['file']}: removed {len(item['removed'])}, kept {item['after']}/{item['before']}")
            for removed in item['removed']:
                print(f"      * {removed}")

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
