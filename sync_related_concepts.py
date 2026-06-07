
from __future__ import annotations

import argparse
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple

RELATED_HEADING = "## :material-graph-outline: Related Concepts"

LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+\.md(?:#[^)]+)?)\)")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*\S)\s*$")
RELATED_NAME_RE = re.compile(r"\bRelated Concepts\b", re.IGNORECASE)
PREREQ_NAME_RE = re.compile(r"\bPrerequisites?\b", re.IGNORECASE)
SOURCES_NAME_RE = re.compile(r"\bSources?\b", re.IGNORECASE)


@dataclass
class Section:
    heading_idx: int
    content_start: int
    end_idx: int
    level: int
    heading_text: str


@dataclass
class FileInfo:
    path: Path
    title: str
    newline: str
    lines: List[str]
    related_section: Optional[Section]
    outgoing: Dict[Path, str]


def detect_newline(text: str) -> str:
    if "\r\n" in text:
        return "\r\n"
    if "\r" in text:
        return "\r"
    return "\n"


def split_lines_keep_style(text: str) -> List[str]:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text.split("\n")


def frontmatter_end(lines: List[str]) -> int:
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                return i + 1
    return 0


def find_first_h1(lines: List[str]) -> str:
    start = frontmatter_end(lines)
    for i in range(start, len(lines)):
        m = HEADING_RE.match(lines[i].strip())
        if m and len(m.group(1)) == 1:
            return m.group(2).strip()
    return ""


def is_heading(line: str) -> Optional[Tuple[int, str]]:
    m = HEADING_RE.match(line.strip())
    if not m:
        return None
    return len(m.group(1)), m.group(2).strip()


def find_named_section(lines: List[str], name_re: re.Pattern[str]) -> Optional[Section]:
    for idx, line in enumerate(lines):
        h = is_heading(line)
        if not h:
            continue
        level, text = h
        if not name_re.search(text):
            continue

        start = idx + 1
        j = start
        while j < len(lines):
            raw = lines[j]
            stripped = raw.strip()
            if not stripped:
                j += 1
                continue
            next_h = is_heading(raw)
            if next_h and next_h[0] <= level:
                break
            if stripped == "---":
                break
            j += 1
        return Section(
            heading_idx=idx,
            content_start=start,
            end_idx=j,
            level=level,
            heading_text=line,
        )
    return None


def resolve_md_target(src_file: Path, href: str) -> Path:
    clean = href.split("#", 1)[0].strip()
    return (src_file.parent / clean).resolve()


def rel_md_path(src_file: Path, dst_file: Path) -> str:
    rel = os.path.relpath(dst_file, src_file.parent)
    return rel.replace(os.sep, "/")


def parse_outgoing_related(lines: List[str], src_file: Path, section: Optional[Section]) -> Dict[Path, str]:
    out: Dict[Path, str] = {}
    if section is None:
        return out

    for line in lines[section.content_start:section.end_idx]:
        for label, href in LINK_RE.findall(line):
            out[resolve_md_target(src_file, href)] = label.strip()
    return out


def read_file_info(path: Path) -> FileInfo:
    text = path.read_text(encoding="utf-8")
    newline = detect_newline(text)
    lines = split_lines_keep_style(text)
    title = find_first_h1(lines) or path.stem
    related_section = find_named_section(lines, RELATED_NAME_RE)
    outgoing = parse_outgoing_related(lines, path.resolve(), related_section)
    return FileInfo(
        path=path.resolve(),
        title=title,
        newline=newline,
        lines=lines,
        related_section=related_section,
        outgoing=outgoing,
    )


def find_insert_index(lines: List[str]) -> int:
    sources = find_named_section(lines, SOURCES_NAME_RE)
    if sources is not None:
        idx = sources.heading_idx
        k = idx - 1
        while k >= 0 and not lines[k].strip():
            k -= 1
        if k >= 0 and lines[k].strip() == "---":
            return k
        return idx

    prereq = find_named_section(lines, PREREQ_NAME_RE)
    if prereq is not None:
        return prereq.end_idx

    return len(lines)


def ensure_single_blank_block(lines: List[str]) -> List[str]:
    out: List[str] = []
    blank_run = 0
    for line in lines:
        if line.strip():
            blank_run = 0
            out.append(line)
        else:
            blank_run += 1
            if blank_run <= 2:
                out.append("")
    return out


def inject_new_related_section(lines: List[str], bullet_lines: List[str]) -> List[str]:
    insert_at = find_insert_index(lines)
    before = lines[:insert_at]
    after = lines[insert_at:]

    chunk: List[str] = []
    if before and before[-1].strip():
        chunk.append("")
    chunk.extend([RELATED_HEADING, ""])
    chunk.extend(bullet_lines)
    chunk.append("")

    new_lines = before + chunk + after
    return ensure_single_blank_block(new_lines)


def update_existing_related_section(lines: List[str], section: Section, bullet_lines: List[str]) -> List[str]:
    current = lines[section.content_start:section.end_idx]
    while current and not current[-1].strip():
        current.pop()

    if current and current[-1].strip():
        current.extend(bullet_lines)
    else:
        current = bullet_lines[:]

    if not current or current[-1].strip():
        current.append("")

    new_lines = lines[:section.content_start] + current + lines[section.end_idx:]
    return ensure_single_blank_block(new_lines)


def write_lines(path: Path, lines: List[str], newline: str) -> None:
    text = newline.join(lines)
    if lines and not text.endswith(newline):
        text += newline
    path.write_text(text, encoding="utf-8", newline="")


def build_infos(root: Path) -> Dict[Path, FileInfo]:
    infos: Dict[Path, FileInfo] = {}
    for path in sorted(root.rglob("*.md")):
        if path.is_file():
            info = read_file_info(path)
            infos[info.path] = info
    return infos


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Make Related Concepts links symmetric across Markdown files."
    )
    parser.add_argument(
        "root",
        nargs="?",
        default=".",
        help="Root folder that contains the markdown files. Defaults to current folder.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing files.",
    )
    parser.add_argument(
        "--backup",
        action="store_true",
        help="Create a .bak copy before overwriting each changed file.",
    )
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    if not root.exists() or not root.is_dir():
        print(f"[ERROR] Folder not found: {root}", file=sys.stderr)
        return 1

    infos = build_infos(root)
    if not infos:
        print("[INFO] No .md files found.")
        return 0

    missing_for_target: Dict[Path, List[Path]] = {p: [] for p in infos}
    dangling: List[Tuple[Path, Path]] = []

    directed_count = 0
    for src, info in infos.items():
        for dst in info.outgoing:
            directed_count += 1
            if dst not in infos:
                dangling.append((src, dst))
                continue
            if src not in infos[dst].outgoing:
                missing_for_target[dst].append(src)

    changed_files = 0
    added_links = 0

    for target_path, backlink_sources in missing_for_target.items():
        if not backlink_sources:
            continue

        info = infos[target_path]
        existing_targets = set(info.outgoing)
        ordered_unique: List[Path] = []
        seen: set[Path] = set()

        for src in sorted(backlink_sources, key=lambda p: (str(infos[p].title).casefold(), p.name.casefold(), str(p))):
            if src in existing_targets or src in seen:
                continue
            seen.add(src)
            ordered_unique.append(src)

        if not ordered_unique:
            continue

        bullet_lines = [
            f"- [{infos[src].title}]({rel_md_path(target_path, src)})"
            for src in ordered_unique
        ]

        new_lines = (
            update_existing_related_section(info.lines, info.related_section, bullet_lines)
            if info.related_section is not None
            else inject_new_related_section(info.lines, bullet_lines)
        )

        if new_lines == info.lines:
            continue

        if args.dry_run:
            print(f"[DRY-RUN] Would update: {target_path}")
        else:
            if args.backup:
                backup = target_path.with_suffix(target_path.suffix + ".bak")
                backup.write_text(
                    info.newline.join(info.lines) + (info.newline if info.lines else ""),
                    encoding="utf-8",
                    newline="",
                )
            write_lines(target_path, new_lines, info.newline)
            print(f"[UPDATED] {target_path}")

        changed_files += 1
        added_links += len(ordered_unique)

    print()
    print(f"Scanned files        : {len(infos)}")
    print(f"Directed links found : {directed_count}")
    print(f"Missing backlinks    : {added_links}")
    print(f"Files changed        : {changed_files}")
    if dangling:
        print(f"Dangling md links    : {len(dangling)}")
        for src, dst in dangling[:10]:
            print(f"  - {src.name} -> {dst}")
        if len(dangling) > 10:
            print(f"  ... and {len(dangling) - 10} more")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
