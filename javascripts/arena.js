// Friendly competition. Identity, deadlines, answers and scores belong to the server.
(function () {
  "use strict";
  if (window.MkArena || window.__mkExamMode) return;
  const base = String(window.MkHotTrack?.apiBase || window.MKDOCS_HOT_API_BASE || "https://hot.eor-wiki.workers.dev").replace(/\/+$/, "");
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const key = value => String(value || "").replace(/^user:/i, "").trim().toLowerCase();
  const enabled = () => !window.__mkExamMode && window.MkStartupPrefs?.isEnabled?.("account") !== false && document.documentElement.getAttribute("data-mk-startup-account") !== "off" && !document.documentElement.classList.contains("mk-startup-account-off");
  const context = () => ({ account: key(window.MkLocalActivity?.getProfile?.()?.accountKey), visitor: String(window.MkEC?.getVisitorId?.() || ""), owner: String(window.MkAccountWorkspaces?.activeOwner?.() || "") });
  const same = ctx => { const now = context(); return enabled() && !window.__mkAccountWorkspaceSwitching && ctx.account === now.account && ctx.visitor === now.visitor && ctx.owner === now.owner; };
  const uuid = () => window.crypto?.randomUUID?.() || "ar-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
  const number = value => Math.max(0, Number(value) || 0).toLocaleString();
  const seconds = ms => (Math.max(0, Number(ms) || 0) / 1000).toFixed(1) + " s";
  const date = (value, zone) => Number(value) ? new Date(Number(value)).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", hourCycle: "h23", ...(zone ? { timeZone: zone } : {}) }) : "Now · when both players are ready";
  const timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const math = host => window.MkEC?.typesetActivityMath?.(host);
  function conceptTitle(value) {
    const text = String(value ?? "");
    // The prerequisite graph also contains plain titles such as “R^n”. Give
    // these an explicit math boundary; never reinterpret existing TeX or HTML.
    const rendered = /\$|\\\(|\\\[/.test(text) ? text : text.replace(/\bR\^(?:\{([a-zA-Z0-9]+)\}|([a-zA-Z0-9]+)\b)/g, (_, braced, simple) => "\\(\\mathbb{R}^{" + (braced || simple) + "}\\)");
    return '<span class="ar-concept-title">' + esc(rendered) + '</span>';
  }
  const conceptLabel = value => esc(window.MkEC?.plainMathTitleText?.(value) || value);
  const button = (action, text, extra = "") => `<button type="button" class="ar-button" data-ar="${action}" ${extra}>${text}</button>`;
  const emblem = () => '<span class="ar-emblem" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="m32 4 23 13v29L32 60 9 46V17Z"/><path d="M22 16h20v11c0 13-20 13-20 0Zm0 5h-8v5c0 6 5 10 10 10m18-15h8v5c0 6-5 10-10 10M32 38v10m-9 0h18"/></svg></span>';
  let current = null, serial = 0, reminderTimer = 0, reminderRequest = null, reminderNode = null;
  const mounts = new Set();
  let background = null, backgroundTimer = 0, pendingTimer = 0, incomingNode = null;
  const pendingInvitations = new Map(), invitationSeen = new Set();
  const rewardRefreshes = new Map();

  function refreshReward(ui, receipt, resultId) {
    if (!live(ui) || receipt?.checkAccount !== true || receipt.pending !== false || !['arena_puzzle', 'arena_duel'].includes(receipt.metric) || typeof window.MkAccountData?.syncNow !== 'function') return;
    const actor = ui.actor, id = [actor.account, actor.owner, receipt.metric, resultId].join(':');
    if (rewardRefreshes.has(id)) return;
    const task = Promise.resolve().then(() => same(actor) ? window.MkAccountData.syncNow({ reason: 'arena-reward', force: false }) : { ok: false });
    rewardRefreshes.set(id, task);
    task.then(result => {
      if (!same(actor) || result?.ok !== true) rewardRefreshes.delete(id);
      else rewardRefreshes.set(id, true);
    }, () => rewardRefreshes.delete(id));
  }

  const wagerRefreshes = new Set();
  function refreshWager(ui, state) {
    const wager = state?.wager;
    if (!live(ui) || !wager || typeof window.MkAccountData?.syncNow !== "function") return;
    const actor = ui.actor, id = [actor.account, actor.owner, state.id || state.matchId, wager.agreedRevision, wager.status].join(":");
    if (wagerRefreshes.has(id)) return;
    wagerRefreshes.add(id);
    Promise.resolve().then(() => same(actor) ? window.MkAccountData.syncNow({ reason: "arena-wager", force: false }) : null)
      .then(result => { if (!same(actor) || result?.ok !== true) wagerRefreshes.delete(id); }, () => wagerRefreshes.delete(id));
  }
  function wagerText(state, you) {
    const stake = Number(state?.stake || state?.wager?.stake || 0), wager = state?.wager;
    if (!stake) return "No EORbits stake.";
    const amount = number(stake), pot = number(stake * 2);
    if (!wager) return amount + " EORbits each · " + pot + " in the pot. Nothing is charged until the other player accepts this exact proposal.";
    if (wager.status !== "settled") return amount + " EORbits from each player are held." + (["finished", "void", "cancelled", "expired", "abandoned"].includes(state.status) ? " Settlement is pending; it will finish automatically." : " Winner receives " + pot + "; a draw or no-result cancellation returns each stake.");
    if (wager.outcome === "refunded") return "Your " + amount + " EORbits stake was returned. Net change: 0 EORbits.";
    return wager.winner === you ? "You received " + pot + " EORbits, including your stake. Net gain: " + amount + " EORbits." : "Your " + amount + " EORbits stake went to the winner.";
  }
  const wagerHTML = (state, you, ui) => '<section class="ar-wager" aria-label="EORbits stake"><p>' + esc(wagerText(state, you)) + '</p>' + walletPanel(ui) + '</section>';
  const wagerRules = '<p>Optional stakes are whole EORbits, from 0 to 10,000 each. Both players can suggest a new stake before acceptance; each edit needs the other player’s agreement. Acceptance holds the same amount from both accounts. If either balance is too low, suggest a smaller amount and agree again. The winner receives both stakes; a draw, cancellation, expiry or no-result ending returns each stake. Leaving follows the score rules above. Stakes and returns earn no XP or shop-spending honours.</p>';
  function walletText(ui) {
    const wallet = ui.wallet || ui.me?.currency;
    return wallet?.available ? "Your available balance: " + number(wallet.balance) + " EORbits. Both players must afford the agreed amount." : wallet ? "Your cloud balance is not ready. Sync your account, then refresh the balance. A positive stake cannot be accepted yet." : "Checking your cloud balance…";
  }
  const walletPanel = ui => '<div class="ar-wallet"><p class="ar-note" data-wager-wallet>' + esc(walletText(ui)) + '</p>' + button("wager-balance-refresh", "Refresh balance") + '</div>';
  function wireWallet(ui, stake = 0) {
    ui.wagerStake = Number(stake) || 0;
    const paint = () => {
      if (!live(ui)) return;
      const wallet = ui.wallet || ui.me?.currency, insufficient = !!wallet?.available && ui.wagerStake > Number(wallet.balance);
      ui.content.querySelectorAll('[data-wager-wallet]').forEach(node => { node.textContent = walletText(ui) + (insufficient ? " Suggest a smaller stake before accepting." : ""); });
      for (const action of ['accept','ghost-accept']) {
        const node = ui.content.querySelector('[data-ar="' + action + '"]');
        if (node) { node.disabled = ui.wagerStake > 0 && (!wallet?.available || insufficient); node.setAttribute('aria-disabled', String(node.disabled)); }
      }
    };
    const refresh = async force => {
      if (ui.walletReading || (!force && ui.walletAt && Date.now()-ui.walletAt < 15000)) { paint(); return; }
      ui.walletReading = true;
      try {
        const data = await request('/arena/wallet', {actor:ui.actor,signal:ui.controller.signal});
        if (!live(ui)) return;
        ui.wallet = data.currency && typeof data.currency.available === 'boolean' ? data.currency : {available:false,balance:null}; ui.walletAt=Date.now();
      } catch { if (live(ui)) ui.wallet={available:false,balance:null}; }
      finally { ui.walletReading=false; paint(); }
    };
    ui.content.querySelector('[data-ar="wager-balance-refresh"]')?.addEventListener('click',()=>refresh(true));
    paint(); refresh(false);
  }
  function stakeField(ui, value = 0) {
    return `<label>EORbits stake per player<input name="stake" type="number" min="0" max="${Number(ui.config?.maxStake || 10000)}" step="1" value="${Number(value) || 0}" inputmode="numeric" required></label>${walletPanel(ui)}<p class="ar-note">Use 0 to play without a stake. Every change needs the other player’s agreement.</p>`;
  }
  function chosenStake(form) {
    const input = form.querySelector('[name="stake"]'), value = Number(input.value);
    if (!Number.isSafeInteger(value) || value < 0 || value > 10000) throw Error("Choose a whole EORbits stake from 0 to 10,000.");
    return value;
  }

  async function request(path, options = {}) {
    const controller = new AbortController(), abort = () => controller.abort();
    options.signal?.addEventListener("abort", abort, { once: true });
    if (options.signal?.aborted) abort();
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; abort(); }, 20000);
    try {
      let url = base + path;
      const init = { cache: "no-store", signal: controller.signal, method: options.body ? "POST" : "GET" };
      if (options.body) { init.headers = { "Content-Type": "application/json" }; init.body = JSON.stringify({ ...options.body, ...(options.actor ? { visitorId: options.actor.visitor } : {}) }); }
      else if (options.actor?.account) url += (url.includes("?") ? "&" : "?") + "visitorId=" + encodeURIComponent(options.actor.visitor);
      const response = await fetch(url, init);
      if (options.calendar) {
        if (!response.ok || !/text\/calendar/i.test(response.headers.get("content-type") || "")) throw Error("Calendar export is unavailable. Try again.");
        return await response.text();
      }
      let data; try { data = await response.json(); } catch (_) { throw Error("The server returned an unreadable response. Try again."); }
      if (!response.ok || !data || data.ok !== true) {
        if (data?.code === "origin_not_allowed" || data?.error === "This origin is not allowed.") throw Error("Arena could not connect from this page. Please try again shortly.");
        throw Object.assign(Error(data?.error || "Arena is temporarily unavailable. Try again."), { code: data?.code || "" });
      }
      return data;
    } catch (error) {
      if (timedOut) throw Error("Arena took too long to respond. Please try again.");
      if (error?.name === "TypeError") throw Error("Arena could not connect. Check your connection and try again.");
      throw error;
    } finally { clearTimeout(timeout); options.signal?.removeEventListener("abort", abort); }
  }
  const live = ui => !!ui && current === ui && ui.dialog.isConnected && same(ui.actor) && !ui.controller.signal.aborted;
  function feedback(ui, message, error = false) {
    if (!live(ui)) return;
    ui.status.textContent = String(message || ""); ui.status.classList.toggle("is-error", !!error);
  }
  function loadFailure(ui, epoch, title, error, retry, selector) {
    if (!live(ui) || ui.epoch !== epoch) return;
    const host = selector ? ui.content.querySelector(selector) : ui.content;
    if (!host) return;
    host.innerHTML = `<section class="ar-empty"><h3>${esc(title)} could not load</h3><p>Please try again. You can also open another Arena section.</p>${button("retry-load", "Try again")}</section>`;
    host.querySelector('[data-ar="retry-load"]').onclick = retry;
    feedback(ui, error.message || "Arena is temporarily unavailable. Please try again.", true);
  }
  function disposeSocket(ui, channel) {
    const item = ui[channel]; if (!item) return;
    item.stopped = true; clearTimeout(item.retry); clearInterval(item.ping);
    try { item.socket?.close(); } catch (_) {} ui[channel] = null;
  }
  function close() {
    const ui = current; if (!ui) return;
    current = null; ui.controller.abort(); clearInterval(ui.clock); disposeSocket(ui, "inbox"); disposeSocket(ui, "match"); disposeSocket(ui, "watch");
    try { ui.dialog.close(); } catch (_) {} ui.dialog.remove();
    if (ui.opener?.isConnected) ui.opener.focus({ preventScroll: true });
  }
  function ask(ui, title, explanation, label, action) {
    if (!live(ui)) return;
    ui.confirm.innerHTML = `<h2>${esc(title)}</h2><p>${esc(explanation)}</p><div class="ar-actions">${button("confirm", esc(label), 'data-variant="danger"')}${button("cancel-confirm", "Go back")}</div>`;
    ui.confirm.hidden = false; const opener = document.activeElement;
    ui.confirm.querySelector('[data-ar="cancel-confirm"]').onclick = () => { ui.confirm.hidden = true; if (opener?.isConnected) opener.focus(); };
    ui.confirm.querySelector('[data-ar="confirm"]').onclick = () => { ui.confirm.hidden = true; action(); };
    ui.confirm.querySelector('[data-ar="cancel-confirm"]').focus();
  }
  const ghostQuestionOpen = ui => (ui.view === "ghost" && !!ui.ghost?.current && !ui.ghost.current.decided)
    || (ui.view === "puzzle" && !!ui.puzzle?.sprint && !ui.puzzle.practice && Number(ui.puzzle.progress?.servedAt) > 0 && !ui.puzzle.progress?.finished);
  function requestClose(ui) {
    if (ghostQuestionOpen(ui)) ask(ui, "Step away from this question?", "Its clock keeps running while you are away, because your time counts from when the question appeared. Your run is saved: reopen it from Arena to continue.", "Close for now", close);
    else if (ui.state?.status === "playing") ask(ui, "Leave the live table?", "Closing disconnects you. Rejoin from Arena within 90 seconds to keep playing; otherwise the server treats it as leaving the match, judged on the score at that moment. Use Leave match to end it now.", "Close for now", close);
    else close();
  }
  function create() {
    if (!enabled()) return null;
    close();
    const dialog = document.createElement("dialog"); dialog.className = "ar-dialog";
    dialog.setAttribute("role", "dialog"); dialog.setAttribute("aria-modal", "true"); dialog.setAttribute("aria-labelledby", "ar-title-" + (++serial));
    dialog.innerHTML = `<div class="ar-shell"><header class="ar-header"><div><span class="ar-eyebrow">A little friendly competition</span><h1 id="ar-title-${serial}">Arena & events</h1></div><button type="button" class="ar-close" data-close aria-label="Close Arena">×</button></header><div class="ar-nav" role="group" aria-label="Arena sections">${button("duels", "Duels")}${button("events", "Weekend events")}${button("record", "Your record")}</div><div class="ar-scroll"><p class="ar-status" role="status" aria-live="polite"></p><section class="ar-confirm" aria-label="Confirm action" hidden></section><div class="ar-content"></div></div><footer class="ar-footer"><span class="ar-connection" role="status"></span><span>Play for discovery. Keep the learning.</span></footer></div>`;
    const ui = { dialog, actor: context(), controller: new AbortController(), opener: document.activeElement, view: "", epoch: 0, busy: new Set(), state: null, me: null, config: null, serverOffset: 0, pendingAnswer: null };
    current = ui; ui.content = dialog.querySelector(".ar-content"); ui.status = dialog.querySelector(".ar-status"); ui.confirm = dialog.querySelector(".ar-confirm");
    document.body.appendChild(dialog); dialog.showModal();
    dialog.querySelector("[data-close]").onclick = () => requestClose(ui);
    dialog.addEventListener("cancel", event => { event.preventDefault(); if (!ui.confirm.hidden) { ui.confirm.querySelector('[data-ar="cancel-confirm"]').click(); } else requestClose(ui); });
    dialog.querySelector('[data-ar="duels"]').onclick = () => navigateAway(ui, () => hub(ui));
    dialog.querySelector('[data-ar="events"]').onclick = () => navigateAway(ui, () => events(ui));
    dialog.querySelector('[data-ar="record"]').onclick = () => navigateAway(ui, () => records(ui));
    ui.clock = setInterval(() => tick(ui), 250);
    return ui;
  }
  function navigateAway(ui, action) {
    if (ghostQuestionOpen(ui)) { ask(ui, "Step away from this question?", "Its clock keeps running while you are away. Your run is saved, so you can reopen it from Duels.", "Step away", action); return; }
    if (ui.state?.status === "playing" && ui.view === "match") {
      ask(ui, "Keep your live match open?", "The other player is waiting. You can review the event hub after the match, or forfeit from the table.", "Return to match", () => {}); return;
    }
    action();
  }
  function view(ui, name, html) {
    if (!live(ui)) return 0;
    if (name !== "watch") { disposeSocket(ui, "watch"); ui.watchState = null; ui.watchId = null; }
    ui.view = name; ui.epoch++; ui.confirm.hidden = true; ui.content.innerHTML = html; feedback(ui, "");
    const section = ["events", "event", "puzzle"].includes(name) ? "events" : name === "record" ? "record" : "duels";
    ui.dialog.querySelectorAll(".ar-nav [data-ar]").forEach(node => node.setAttribute("aria-pressed", String(node.dataset.ar === section)));
    math(ui.content); return ui.epoch;
  }
  function accountPrompt(ui) {
    ui.content.innerHTML = `<section class="ar-empty">${emblem()}<h2>Bring your account to the table</h2><p>Connect your wiki account to challenge a player, keep a competition record or join an official weekend event.</p>${button("account", "Open Account")}</section>`;
    ui.content.querySelector('[data-ar="account"]').onclick = () => { close(); window.MkLocalActivity?.open?.("info"); };
  }
  async function loadMe(ui) {
    if (!ui.actor.account || !ui.actor.visitor) return null;
    const data = await request("/arena/me", { actor: ui.actor, signal: ui.controller.signal });
    if (!live(ui)) return null;
    if (key(data.me?.accountKey) !== ui.actor.account || !Array.isArray(data.challenges) || !data.record || typeof data.settings !== "object") throw Error("Your connected account could not be confirmed. Reconnect in My → Account.");
    ui.me = data; if (data.currency) { ui.wallet=data.currency; ui.walletAt=Date.now(); } return data;
  }
  async function perform(ui, id, action) {
    if (!live(ui) || ui.busy.has(id)) return;
    ui.busy.add(id); const control = ui.dialog.querySelector('[data-ar="' + id + '"]'); control?.setAttribute("aria-busy", "true"); control?.setAttribute("aria-disabled", "true");
    try { await action(); } catch (error) { if (live(ui)) feedback(ui, error.message || "This action could not be completed. Try again.", true); }
    finally { ui.busy.delete(id); if (control?.isConnected) { control.removeAttribute("aria-busy"); control.removeAttribute("aria-disabled"); } }
  }
  function challengeValid(value, ui) {
    return !!value && typeof value.id === "string" && Number.isInteger(value.revision) && Array.isArray(value.participants) && value.participants.length === 2 && value.participants.some(p => key(p.accountKey) === ui.actor.account);
  }
  function terms(challenge) { return `${esc(challenge.courseTitle || challenge.courseId)} · ${number(challenge.questionCount)} questions<br><span>${esc(date(challenge.startAt))}${challenge.startAt ? " · " + esc(timezone()) : ""}</span>`; }
  async function hub(ui) {
    const epoch = view(ui, "duels", `<section class="ar-hero">${emblem()}<div><span class="ar-eyebrow">Same questions. Shared discoveries.</span><h2>Meet at the learning table.</h2><p>Choose a course, agree on the time, and take on the same quiz together. The first correct answer wins each round.</p></div></section><div data-rating></div><div data-live></div><div class="ar-section-head"><h2>Your challenges</h2>${button("refresh", "Refresh")}</div><div data-challenges><p>Loading challenges…</p></div><div class="ar-section-head"><h2>Ghost races</h2></div><div data-ghosts></div>${rules()}${ghostRules()}`);
    if (!epoch) return;
    ui.content.querySelector('[data-ar="refresh"]').onclick = () => hub(ui);
    if (!ui.actor.account) { accountPrompt(ui); return; }
    try {
      const data = await loadMe(ui); if (!live(ui) || ui.epoch !== epoch || !data) return;
      ui.content.querySelector("[data-rating]").innerHTML = ratingHTML(data.rating, true) + coverageHTML(data.coverage);
      const host = ui.content.querySelector("[data-challenges]");
      host.innerHTML = data.challenges.length ? data.challenges.map(c => `<button type="button" class="ar-invite" data-challenge="${esc(c.id)}"><span class="ar-chip">${esc(statusLabel(c))}</span><strong>${esc(c.participants?.find(p => key(p.accountKey) !== ui.actor.account)?.name || "Another learner")}</strong><span>${terms(c)}</span><span class="ar-arrow" aria-hidden="true">↗</span></button>`).join("") : '<div class="ar-empty"><h3>Your next opponent is one profile away.</h3><p>Open another learner’s public profile and choose Challenge. Invitations and replies appear here.</p></div>';
      host.querySelectorAll("[data-challenge]").forEach(node => { node.onclick = () => showChallenge(ui, node.dataset.challenge); });
      const ghostHost = ui.content.querySelector("[data-ghosts]"), ghosts = (Array.isArray(data.ghosts) ? data.ghosts : []).filter(g => ghostValid(g, ui));
      ghostHost.innerHTML = ghosts.length ? ghosts.map(ghostCard).join("") : '<p class="ar-note">Choose Ghost race when you challenge someone: once they accept, each of you plays the same questions whenever suits you within a week.</p>';
      ghostHost.querySelectorAll("[data-ghost]").forEach(node => { node.onclick = () => showGhost(ui, node.dataset.ghost); });
      connect(ui, "inbox"); math(host); math(ghostHost);
      liveMatches(ui, epoch);
    } catch (error) { loadFailure(ui, epoch, "Your challenges", error, () => hub(ui), "[data-challenges]"); }
  }
  function rules() { return '<details class="ar-rules"><summary>How a duel works</summary><p>Agree on 10–50 questions and start now or schedule up to four weeks ahead. Both players must be online and Ready. There is one three-second countdown before the first question. If both players are not ready within ten minutes of the agreed time (or of acceptance for an immediate match), the match never starts: nobody wins or loses.</p><p>Each question starts with zero mistakes for each player. Your first wrong answer pauses you for 5 seconds, your second for 10 seconds, and your third gives that question’s point to your opponent. Wrong options are crossed out for both players; an already eliminated choice has no extra penalty. The first correct answer earns one point.</p><p>Review the explanation, then both choose Next question. After the final question, the higher total wins; equal totals are a draw. The server decides answer order and scores. There is no per-question time limit.</p><p>Leaving a started match is judged on the score at that moment. Leaving includes choosing Leave match, not reconnecting within 90 seconds, and not choosing Next within two minutes after your opponent has. A player who leaves while behind loses. A player who leaves with a lead the opponent could not even tie by answering every remaining question keeps the win. Any other moment — level scores, or a lead that could still be caught — ends the match with no result. Both players disconnecting, or ten minutes without any answer or Next, also ends with no result. Cancelling before play is not a loss.</p><p>Every rated result changes your EOR Rating, an Elo-style score: beating a stronger player earns more, losing to a weaker one costs more. The same two players are rated at most three times a week, and matches with no result change nothing. AI quizzes and weekend quizzes count too; Rankings → EOR Rating explains how.</p><p>Friendly learning play, using the wiki’s public question bank. Complete a full duel with your own answers to earn up to 8 XP and 8 EORbits, for up to five duels per UTC day, within shared daily limits. Matches ended by someone leaving, and matches with no result, do not earn these rewards.</p>' + wagerRules + '</details>'; }
  const signed = value => { const n = Math.round(Number(value) || 0); return (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(n); };
  function ratingHTML(rating, own) {
    if (!rating || !Number.isFinite(Number(rating.value))) return "";
    const progress = rating.provisional ? `${number(rating.ratedCount)} rated ${Number(rating.ratedCount) === 1 ? "result" : "results"} so far · an Elo number settles after about ten.` : `${number(rating.ratedCount)} rated results · peak ${number(rating.peak)}`;
    const sources = own
      ? "Earned on your own and against others: AI quiz answers, friendly duels and weekend quizzes all move it."
      : "Earned on their own and against others: AI quiz answers, friendly duels and weekend quizzes all move it.";
    return `<section class="ar-rating"><span class="ar-eyebrow">EOR Rating</span><strong>${number(rating.value)}</strong>${rating.change7d != null ? `<span>${esc(signed(rating.change7d))} this week</span>` : ""}<p class="ar-note">${esc(sources)}</p><p class="ar-note">${esc(progress)}</p></section>`;
  }
  // Says how much synced practice the rating has actually read. A learner whose
  // history looks missing can see whether it was never synced, not yet read, or
  // simply past the daily cap, instead of guessing.
  function coverageHTML(coverage) {
    if (!coverage || !Number(coverage.quizSessions)) return "";
    const sessions = Number(coverage.quizSessions), rated = Number(coverage.answersRated || 0);
    const capped = Number(coverage.answersOverDailyLimit || 0), limit = Number(coverage.dailyLimit || 0);
    const pending = Math.max(0, sessions - Number(coverage.quizSessionsRated || 0));
    const parts = [`${number(rated)} rated ${rated === 1 ? "answer" : "answers"} from ${number(sessions)} synced quiz ${sessions === 1 ? "session" : "sessions"}`];
    if (capped) parts.push(`${number(capped)} more were past the ${number(limit)}-a-day limit`);
    if (pending) parts.push(`${number(pending)} ${pending === 1 ? "session is" : "sessions are"} still being read`);
    return `<p class="ar-note">${esc(parts.join(" · "))}.</p>`;
  }
  function ratingResult(rating) {
    if (!rating) return '<p class="ar-note">Your EOR Rating updates within a few minutes.</p>';
    if (rating.rated) return `<p class="ar-rating-change">EOR Rating ${esc(signed(rating.change))} · now ${number(rating.value)}</p>`;
    return `<p class="ar-note">${esc({ pair_limit: "This duel is not rated: you already had three rated duels with this player this week.", left_undecided: "This result is not rated under the leaving rule." }[rating.note] || "This duel is not rated.")}</p>`;
  }
  // What this pair has actually played. Matches with no result are left out of
  // the tally entirely: they changed nothing for either player.
  function headToHeadHTML(h2h, name) {
    if (!h2h || !Number(h2h.played)) return `<p class="ar-note">First meeting with ${esc(name || "this player")}.</p>`;
    const decided = Number(h2h.wins) + Number(h2h.draws) + Number(h2h.losses);
    const last = Array.isArray(h2h.recent) && h2h.recent[0];
    return `<div class="ar-h2h-tally">${[["Won", h2h.wins], ["Drawn", h2h.draws], ["Lost", h2h.losses]].map(([label, value]) => `<div><strong>${number(value)}</strong><span>${label}</span></div>`).join("")}</div><p class="ar-note">${number(decided)} ${decided === 1 ? "match" : "matches"} against ${esc(name || "this player")}${last ? ` · last ${esc(last.outcome)} ${number(last.scores?.[0])}–${number(last.scores?.[1])} on ${esc(date(last.finishedAt))}` : ""}.</p>`;
  }
  // ---- Watching a live duel ---------------------------------------------------
  function watchNote(state) {
    const mine = !!state.spectators?.[state.you], theirs = !!state.spectators?.[1 - state.you], watchers = Number(state.watchers) || 0;
    if (mine && theirs) return "Study connections of either player can watch" + (watchers ? " · " + number(watchers) + " watching now" : "") + ". Watchers see the score, and each question only after its point is decided.";
    if (mine) return "You allow watching. It opens once your opponent allows it too.";
    if (theirs) return "Your opponent would like study connections to be able to watch. It opens only if you allow it too.";
    return "Nobody can watch this match. If both players allow it, study connections can follow the score, and each question once its point is decided.";
  }
  function liveMatches(ui, epoch) {
    const host = ui.content.querySelector("[data-live]"); if (!host || !ui.actor.account) return;
    request("/arena/live", { actor: ui.actor, signal: ui.controller.signal }).then(data => {
      if (!live(ui) || ui.epoch !== epoch || !host.isConnected) return;
      const matches = (Array.isArray(data.matches) ? data.matches : []).filter(m => typeof m.id === "string" && Array.isArray(m.participants) && m.participants.length === 2);
      host.innerHTML = matches.length ? `<div class="ar-section-head"><h2>Connections playing now</h2></div>${matches.map(m => `<button type="button" class="ar-invite" data-watch="${esc(m.id)}"><span class="ar-chip">${m.status === "playing" ? "live" : "about to start"}</span><strong>${esc(m.participants[0]?.name)} vs ${esc(m.participants[1]?.name)}</strong><span>${esc(m.courseTitle || "Friendly duel")} · ${number(m.questionCount)} questions<br><span>${m.status === "playing" ? "Question " + number(Number(m.roundIndex) + 1) + " · " + number(m.scores?.[0]) + "–" + number(m.scores?.[1]) : "Waiting for both players to be ready"}</span></span><span class="ar-arrow" aria-hidden="true">↗</span></button>`).join("")}` : "";
      host.querySelectorAll("[data-watch]").forEach(node => { node.onclick = () => watch(ui, node.dataset.watch); });
    }).catch(() => { if (host.isConnected) host.innerHTML = ""; });
  }
  function watch(ui, matchId) {
    if (!live(ui) || !ui.actor.account) return;
    ui.state = null; ui.ghost = null; disposeSocket(ui, "match");
    view(ui, "watch", '<p role="status">Joining as a watcher…</p>');
    ui.watchId = matchId; ui.watchState = null;
    connect(ui, "watch", matchId);
  }
  function watchClosed(ui, message) {
    if (!live(ui) || ui.view !== "watch") return;
    disposeSocket(ui, "watch");
    ui.content.innerHTML = `<section class="ar-empty"><h2>Watching has closed</h2><p>${esc(message)}</p>${button("back", "Back to challenges")}</section>`;
    ui.content.querySelector('[data-ar="back"]').onclick = () => hub(ui);
  }
  function acceptWatch(ui, state) {
    if (!live(ui) || ui.view !== "watch") return;
    if (!state || state.matchId !== ui.watchId || state.watching !== true || !Array.isArray(state.participants) || state.participants.length !== 2 || !Array.isArray(state.scores)) { feedback(ui, "The watched match could not be verified. Reopen it from Duels.", true); return; }
    if (ui.watchState && Number(state.revision) < Number(ui.watchState.revision)) return;
    ui.watchState = state; renderWatch(ui);
  }
  function watchedQuestionHTML(question, names, previous) {
    const point = question.winner == null ? "" : esc(names[question.winner]) + "’s point";
    return `<div class="ar-explanation">${previous ? `<span class="ar-eyebrow">Previous question${point ? " · " + point : ""}</span>` : ""}<p class="ar-question">${esc(question.question)}</p><ol class="ar-watch-options">${(Array.isArray(question.options) ? question.options : []).map((option, i) => `<li class="${question.correctIndex === i ? "is-correct" : ""}">${esc(option)}${question.correctIndex === i ? " · correct" : ""}</li>`).join("")}</ol>${question.explanation ? `<p>${esc(question.explanation)}</p>` : ""}</div>`;
  }
  function renderWatch(ui) {
    const w = ui.watchState; if (!live(ui) || !w) return;
    const names = w.participants.map(person => person?.name || "A learner"), round = w.round, n = Number(w.questionCount) || 0;
    const board = `<div class="ar-scoreboard">${[0, 1].map(p => `<div class="ar-player"><span class="ar-eyebrow">${w.online?.[p] ? "online" : "offline"}</span><strong>${esc(names[p])}</strong><b>${number(w.scores?.[p])}</b></div>`).join('<span class="ar-versus" aria-hidden="true">vs</span>')}</div>`;
    let body = "";
    if (w.result) body = `<section class="ar-result"><span class="ar-eyebrow">Match complete</span><h2>${esc(w.result.winner == null ? "A well-matched draw." : names[w.result.winner] + " won.")}</h2><p class="ar-final-score">${number(w.result.scores?.[0])} <span>:</span> ${number(w.result.scores?.[1])}</p></section>`;
    else if (["void", "abandoned", "cancelled", "expired"].includes(w.status)) body = '<section class="ar-empty"><h2>No result</h2><p>This match ended before a result was decided.</p></section>';
    else if (w.status === "accepted") body = '<section class="ar-ready"><h2>The table is set.</h2><p>Waiting for both players to be ready.</p></section>';
    else if (round) body = `<section class="ar-round"><div class="ar-section-head"><h2>Question ${number(Number(w.roundIndex) + 1)} of ${number(n)}</h2><span class="ar-chip">${round.resolved ? (round.winner == null ? "decided" : esc(names[round.winner]) + "’s point") : "in play"}</span></div>${round.resolved ? watchedQuestionHTML(round, names, false) : `<p class="ar-note">Mistakes so far: ${esc(names[0])} ${number(round.wrong?.[0])}/3 · ${esc(names[1])} ${number(round.wrong?.[1])}/3. You will see this question once its point is decided.</p>${w.previous ? watchedQuestionHTML(w.previous, names, true) : ""}`}</section>`;
    ui.view = "watch";
    ui.content.innerHTML = `<div class="ar-section-head"><div><span class="ar-eyebrow">Watching · ${esc(w.courseTitle || "Friendly duel")}</span><h2>${esc(names[0])} vs ${esc(names[1])}</h2></div><span class="ar-chip">read-only</span></div>${board}${body}<div class="ar-actions">${button("stop-watching", "Stop watching")}</div>`;
    ui.content.querySelector('[data-ar="stop-watching"]').onclick = () => hub(ui);
    math(ui.content);
  }
  function statusLabel(challenge) { return { void: "no result", expired: challenge.accepted ? "not started" : "expired" }[challenge.status] || challenge.status; }
  // Mirrors WikiArenaRoom.quit: every resolved question awarded one point.
  function leaveOutcome(state) {
    const mine = Number(state.scores?.[state.you]) || 0, theirs = Number(state.scores?.[1 - state.you]) || 0, remaining = Math.max(0, Number(state.questionCount) - mine - theirs);
    if (mine > theirs + remaining) return "Your opponent can no longer catch up, so leaving now keeps your win.";
    if (mine < theirs) return "You are behind, so leaving now gives the win to your opponent. This cannot be undone.";
    return "The result is still open, so leaving now ends the match with no result: no win, loss or rating change for either player.";
  }
  function leftText(reason, who) { return who + " " + ({ disconnect: "did not reconnect in time", stalled: "did not continue to the next question" }[reason] || "left the match"); }
  function resultReason(result, you) {
    if (result.reason === "score") return "All rounds completed.";
    if (![0, 1].includes(result.quitter)) return { forfeit: "The match ended with a forfeit.", disconnect: "The connection grace period ended." }[result.reason] || "The server has confirmed the result.";
    const left = leftText(result.reason, result.quitter === you ? "You" : "Your opponent");
    return result.winner === result.quitter ? left + " when the lead could no longer be caught, so that win stands." : left + " while behind, so the match went to " + (result.quitter === you ? "your opponent." : "you.");
  }
  function voidReason(voided, you) {
    const scores = voided?.scores || [0, 0], by = voided?.by === you ? "You" : "Your opponent";
    return `${leftText(voided?.reason, by)} at ${number(scores[you])}–${number(scores[1 - you])} with ${number(voided?.remaining)} ${Number(voided?.remaining) === 1 ? "question" : "questions"} still open, before the result was decided.`;
  }
  async function challenge(target, options = {}) {
    if (!enabled()) return { ok: false, error: "Enable Account to use Arena." };
    const opponent = { accountKey: key(target?.accountKey), name: String(target?.name || "Another learner") };
    if (!opponent.accountKey) return { ok: false, error: "This player is unavailable." };
    const ui = create(); if (!ui) return { ok: false, error: "Arena is unavailable." };
    if (!ui.actor.account) { accountPrompt(ui); return { ok: false, error: "Connect your account first." }; }
    if (opponent.accountKey === ui.actor.account) { feedback(ui, "Choose another learner to challenge.", true); return { ok: false, error: "You cannot challenge yourself." }; }
    const epoch = view(ui, "offer", '<p>Preparing the challenge…</p>');
    try {
      const [config, me] = await Promise.all([request("/arena/config", { signal: ui.controller.signal }), loadMe(ui)]);
      if (!live(ui) || ui.epoch !== epoch || !me) return { ok: false, error: "The account changed." };
      if (config.available !== true || !Array.isArray(config.courses)) throw Error("Challenges are temporarily unavailable.");
      ui.config = config; offer(ui, opponent, null, options.format === "ghost" ? "ghost" : "live"); return { ok: true };
    } catch (error) { loadFailure(ui, epoch, "The challenge", error, () => challenge(opponent, options)); return { ok: false, error: error.message }; }
  }
  function localDateInput(timestamp) { const d = new Date(timestamp); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; }
  function scheduledLocalTime(value) {
    const raw = String(value || ""), at = new Date(raw).getTime();
    if (!Number.isFinite(at) || localDateInput(at) !== raw) throw Error("Choose a valid local time. That time may not exist because the clocks change.");
    // During a fall-back transition the same wall time occurs twice. Avoid
    // silently choosing one occurrence on behalf of the person scheduling.
    if ([-3600000, 3600000, -1800000, 1800000].some(shift => localDateInput(at + shift) === raw)) throw Error("That local time occurs twice when the clocks change. Choose an unambiguous time before or after the repeated hour.");
    return at;
  }
  const LIVE_NOTE = "Your opponent can accept, decline or suggest different terms. Nothing starts until both players are ready.";
  const GHOST_NOTE = "They accept first; nothing is played before that. Then each of you answers the same questions whenever suits you within a week, and the server times every question from the moment it appears. Nobody needs to be online at the same time.";
  function offer(ui, opponent, previous = null, format = "live") {
    const courses = (ui.config?.courses || []).filter(c => Number(c.questionCount) >= 10);
    const ghostCounts = (Array.isArray(ui.config?.ghost?.questionCounts) ? ui.config.ghost.questionCounts : [10, 15, 20]).filter(n => Number.isInteger(n) && n >= 10 && n <= 50);
    const ghost = !previous && format === "ghost";
    view(ui, "offer", `<div class="ar-section-head"><div><span class="ar-eyebrow">${previous ? "Make a counteroffer" : "Invite a fellow learner"}</span><h2>${esc(opponent.name)}</h2></div>${button("back", "Back")}</div><form class="ar-form">${previous ? "" : `<label>Format<select name="format"><option value="live" ${ghost ? "" : "selected"}>Live duel · both online at the same time</option><option value="ghost" ${ghost ? "selected" : ""}>Ghost race · you play now, they race your run later</option></select></label>`}<label>Course<select name="course" required>${courses.map(c => `<option value="${esc(c.id)}" ${previous?.courseId === c.id ? "selected" : ""}>${esc(c.title)} · ${number(c.questionCount)} questions available</option>`).join("")}</select></label><label data-live-field ${ghost ? "hidden" : ""}>Number of questions<input name="count" type="number" min="10" max="50" step="1" value="${previous?.questionCount || 10}" required></label><label data-ghost-field ${ghost ? "" : "hidden"}>Number of questions<select name="ghostCount">${ghostCounts.map(n => `<option value="${n}">${number(n)} questions</option>`).join("")}</select></label><label data-live-field ${ghost ? "hidden" : ""}>When<select name="when"><option value="now">Now, when we are both ready</option><option value="later" ${previous?.startAt ? "selected" : ""}>Schedule a time</option></select></label><label data-schedule ${previous?.startAt && !ghost ? "" : "hidden"}>Your local start time · ${esc(timezone())}<input name="start" type="datetime-local" value="${previous?.startAt ? localDateInput(previous.startAt) : ""}"></label>${stakeField(ui, previous?.stake || 0)}<p class="ar-note" data-offer-note>${ghost ? GHOST_NOTE : LIVE_NOTE}</p><div class="ar-actions">${button("send-offer", ghost ? "Send ghost race invitation" : previous ? "Send counteroffer" : "Send invitation", courses.length ? "" : 'aria-disabled="true"')}</div></form>${rules()}${ghostRules()}`);
    const form = ui.content.querySelector("form"), field = name => form.querySelector('[name="' + name + '"]');
    // The chosen format is read from the select, falling back to the one it opened with.
    const isGhost = () => { const value = field("format")?.value; return !previous && (value === "ghost" || value === "live" ? value : ghost ? "ghost" : "live") === "ghost"; };
    const syncFormat = () => {
      const chosen = isGhost();
      form.querySelectorAll("[data-live-field]").forEach(node => { node.hidden = chosen; });
      form.querySelector("[data-ghost-field]").hidden = !chosen;
      form.querySelector("[data-schedule]").hidden = chosen || field("when").value !== "later";
      form.querySelector("[data-offer-note]").textContent = chosen ? GHOST_NOTE : LIVE_NOTE;
      ui.content.querySelector('[data-ar="send-offer"]').textContent = chosen ? "Send ghost race invitation" : previous ? "Send counteroffer" : "Send invitation";
    };
    form.onsubmit = event => { event.preventDefault(); ui.content.querySelector('[data-ar="send-offer"]').click(); };
    field("when").onchange = syncFormat;
    if (field("format")) field("format").onchange = syncFormat;
    ui.content.querySelector('[data-ar="back"]').onclick = () => previous ? showChallenge(ui, previous.id) : hub(ui);
    ui.content.querySelector('[data-ar="send-offer"]').onclick = () => perform(ui, "send-offer", async () => {
      const stake = chosenStake(form);
      if (isGhost()) {
        const course = courses.find(c => c.id === field("course").value), count = Number(field("ghostCount").value);
        if (!course || !ghostCounts.includes(count) || count > Number(course.questionCount)) throw Error("Choose a course and " + ghostCounts.join(", ") + " questions.");
        const epoch = ui.epoch;
        const data = await request("/arena/ghosts", { actor: ui.actor, signal: ui.controller.signal, body: { opponent: opponent.accountKey, courseId: course.id, questionCount: count, stake } });
        if (!live(ui) || ui.epoch !== epoch) return;
        if (!ghostValid(data.ghost, ui) || !Array.isArray(data.ghost.rounds)) throw Error("The ghost race was not confirmed. Refresh your challenges before retrying.");
        renderGhost(ui, data.ghost); feedback(ui, "Invitation sent. Nothing is played until " + opponent.name + " accepts.");
        return;
      }
      const course = courses.find(c => c.id === field("course").value), count = Number(field("count").value), later = field("when").value === "later", startAt = later ? scheduledLocalTime(field("start").value) : null;
      if (!course || !Number.isInteger(count) || count < 10 || count > Math.min(50, Number(course.questionCount))) throw Error("Choose a course and 10–50 available questions.");
      if (later && (!Number.isFinite(startAt) || startAt <= Date.now() || startAt > Date.now() + 28 * 86400000)) throw Error("Choose a future time within four weeks.");
      const epoch = ui.epoch;
      const data = await request(previous ? "/arena/challenges/" + encodeURIComponent(previous.id) + "/respond" : "/arena/challenges", { actor: ui.actor, signal: ui.controller.signal, body: { opponent: opponent.accountKey, courseId: course.id, questionCount: count, stake, startAt, timeZone: timezone(), ...(previous ? { revision: previous.revision, action: "counter" } : {}) } });
      if (!live(ui) || ui.epoch !== epoch) return;
      if (!challengeValid(data.challenge, ui)) throw Error("The invitation was not confirmed. Refresh your challenges before retrying.");
      renderChallenge(ui, data.challenge); feedback(ui, previous ? "Counteroffer sent. Waiting for the other player." : "Invitation sent. Waiting for the other player."); connect(ui, "inbox");
    });
    wireWallet(ui, previous?.stake || 0);
    if (!courses.length) feedback(ui, "No course currently has ten eligible questions. Try again later.", true);
  }
  // ---- Ghost races: the same duel, played at different times ---------------------
  function ghostRules() { return '<details class="ar-rules"><summary>How a ghost race works</summary><p>A ghost race is a duel played at different times. You invite someone to 10, 15 or 20 questions from one course; nothing is played until they accept, within three days. Then each of you has a week to play your run of the same questions, in either order and whenever suits you.</p><p>The server starts each question’s clock when it appears and times every answer. A wrong answer pauses you for 5 seconds, then 10, and a third wrong answer ends that question. Each point goes where a shared table would have sent it: the earlier correct answer wins it, and using up three attempts first hands it to the other player. Crossed-out options are not shared between the two runs.</p><p>Whoever plays second races the first player’s recorded run, their ghost: after finishing each question you see how the ghost did on it. When both runs are complete, the higher total wins; equal totals are a draw.</p><p>Nobody wins because the other player did not turn up. An invitation that is not accepted, or a week that runs out before both runs are played, ends with no result, and so does backing out before starting your run. A run that was started and then left, with Leave race or by not answering for a day, is judged like leaving a live duel: a lead the other player could no longer catch keeps the win, trailing loses, and anything else ends with no result.</p><p>A finished ghost race counts like a live duel: it moves both EOR Ratings, counts toward your duel record and honours, and earns the same XP and EORbits within the same daily limits.</p>' + wagerRules + '</details>'; }
  function ghostValid(value, ui) {
    return !!value && typeof value.id === "string" && [0, 1].includes(value.you) && Array.isArray(value.participants) && value.participants.length === 2 && key(value.participants[value.you]?.accountKey) === ui.actor.account && Array.isArray(value.scores) && value.scores.length === 2 && (value.rounds === undefined || Array.isArray(value.rounds));
  }
  const ghostOtherName = g => g.participants[1 - g.you]?.name || "Another learner";
  // A deadline the server has not set yet is left out rather than read as "now".
  const ghostDate = (prefix, value) => Number(value) > 0 ? prefix + date(value) : "";
  const ghostMine = (g, field) => !!(Array.isArray(g[field]) && g[field][g.you]);
  const ghostTheirs = (g, field) => !!(Array.isArray(g[field]) && g[field][1 - g.you]);
  function ghostLabel(g) {
    if (g.status === "pending") return g.you === (g.proposer ?? 0) ? "invited" : "invitation";
    if (g.status === "open") return ghostMine(g, "finished") ? "waiting" : ghostMine(g, "started") ? "in progress" : "your turn";
    return { finished: "finished", void: "no result" }[g.status] || g.status;
  }
  function ghostDetail(g) {
    const other = ghostOtherName(g), mine = Number(g.scores?.[g.you]) || 0, theirs = Number(g.scores?.[1 - g.you]) || 0;
    if (g.status === "pending") return g.you === (g.proposer ?? 0) ? "Waiting for " + other + ghostDate(" to accept by ", g.inviteEndsAt) : "Invitation" + ghostDate(" · accept by ", g.inviteEndsAt);
    if (g.status === "open") {
      if (ghostMine(g, "finished")) return "Your run is recorded" + ghostDate(" · " + other + " can play until ", g.playEndsAt);
      if (ghostMine(g, "started")) return number(g.progress?.[g.you]) + " of " + number(g.questionCount) + " answered";
      return (ghostTheirs(g, "finished") ? "Their ghost is waiting" : "Ready to play") + ghostDate(" · play by ", g.playEndsAt);
    }
    if (g.status === "finished" && g.result) return (g.result.winner == null ? "Draw" : g.result.winner === g.you ? "Won" : "Lost") + " · " + number(g.result.scores?.[g.you]) + "–" + number(g.result.scores?.[1 - g.you]);
    return date(g.finishedAt || g.createdAt);
  }
  function ghostCard(g) {
    return `<button type="button" class="ar-invite" data-ghost="${esc(g.id)}"><span class="ar-chip">${esc(ghostLabel(g))}</span><strong>${esc(ghostOtherName(g))}</strong><span>${esc(g.courseTitle || g.courseId)} · ${number(g.questionCount)} questions<br><span>${esc(ghostDetail(g))}</span></span><span class="ar-arrow" aria-hidden="true">↗</span></button>`;
  }
  const ghostOutcome = o => !o ? "" : o.correct ? "correct in " + seconds(o.at) + (o.wrong ? " after " + number(o.wrong) + " " + (o.wrong === 1 ? "mistake" : "mistakes") : "") : "out of attempts at " + seconds(o.at);
  function ghostPointText(g, point) { return point == null ? "" : point === g.you ? "Your point" : ghostOtherName(g) + "’s point"; }
  function ghostRoundHTML(g, round) {
    const point = ghostPointText(g, round.point);
    return `<li><strong>Question ${number(round.index + 1)}</strong><span>You: ${esc(ghostOutcome(round.you))}</span><span>${esc(ghostOtherName(g))}: ${esc(round.them ? ghostOutcome(round.them) : "not played yet")}</span>${point ? `<b>${esc(point)}</b>` : ""}</li>`;
  }
  function ghostLeftText(g, seat, reason) { return (seat === g.you ? "You" : ghostOtherName(g)) + (reason === "stalled" ? " did not continue the run within a day" : " left the race"); }
  function ghostResultReason(g) {
    const r = g.result;
    if (r.reason === "score") return "Both runs are complete.";
    const left = ghostLeftText(g, r.quitter, r.reason);
    return r.winner === r.quitter ? left + " when the lead could no longer be caught, so that win stands." : left + " while behind, so the race went to " + (r.quitter === g.you ? ghostOtherName(g) : "you") + ".";
  }
  function ghostClosedText(g) {
    const other = ghostOtherName(g), by = g.closedBy === g.you ? "You" : other;
    if (g.status === "expired") {
      if (!g.acceptedAt) return g.you === (g.proposer ?? 0) ? other + " did not accept the invitation within three days." : "The invitation was not accepted within three days.";
      const missing = Array.isArray(g.noShow) ? g.noShow : [];
      return (missing.length === 2 ? "Neither of you played a run" : missing.includes(g.you) ? "You did not play your run" : other + " did not play their run") + " within the week.";
    }
    if (g.status === "declined") return by + " declined the invitation.";
    if (g.cancelReason) return g.cancelReason;
    return g.acceptedAt ? by + " backed out before playing a run." : by + " cancelled the invitation.";
  }
  async function showGhost(ui, id) {
    const epoch = view(ui, "ghost", "<p>Opening the ghost race…</p>");
    if (!epoch) return;
    if (!ui.actor.account) { accountPrompt(ui); return; }
    try {
      const data = await request("/arena/ghosts/" + encodeURIComponent(id), { actor: ui.actor, signal: ui.controller.signal });
      if (!live(ui) || ui.epoch !== epoch) return;
      if (!ghostValid(data.ghost, ui) || data.ghost.id !== id || !Array.isArray(data.ghost.rounds)) throw Error("This ghost race is unavailable to the connected account.");
      renderGhost(ui, data.ghost);
    } catch (error) { loadFailure(ui, epoch, "This ghost race", error, () => showGhost(ui, id)); }
  }
  // A quiet reload, used when the race moved on elsewhere: no loading flash.
  async function reloadGhost(ui, id, message) {
    try {
      const data = await request("/arena/ghosts/" + encodeURIComponent(id), { actor: ui.actor, signal: ui.controller.signal });
      if (!live(ui) || ui.ghost?.id !== id || !ghostValid(data.ghost, ui) || !Array.isArray(data.ghost.rounds)) return;
      renderGhost(ui, data.ghost); if (message) feedback(ui, message, true);
    } catch (_) { /* the visible race stays as it was */ }
  }
  function ghostAction(ui, action, route, body = {}) {
    const g = ui.ghost; if (!g) return Promise.resolve();
    return perform(ui, action, async () => {
      const epoch = ui.epoch;
      let data;
      try { data = await request("/arena/ghosts/" + encodeURIComponent(g.id) + "/" + route, { actor: ui.actor, signal: ui.controller.signal, body: { revision: g.revision, ...body } }); }
      catch (error) {
        // The race moved on (another tab, a deadline): show where it is now.
        if (["stale_question", "question_decided", "ghost_closed", "ghost_recorded", "stale_revision"].includes(error.code) && live(ui)) { ui.ghostAttempt = null; await reloadGhost(ui, g.id, error.message); return; }
        throw error;
      }
      if (!live(ui) || ui.epoch !== epoch || ui.ghost?.id !== g.id) return;
      if (!ghostValid(data.ghost, ui) || data.ghost.id !== g.id || !Array.isArray(data.ghost.rounds)) throw Error("The race was not confirmed. Refresh it before continuing.");
      ui.ghostAttempt = null; renderGhost(ui, data.ghost);
    });
  }
  function ghostAnswer(ui, node) {
    const g = ui.ghost, current = g?.current; tick(ui);
    if (!current || current.decided || node.getAttribute("aria-disabled") === "true" || ui.busy.has("ghost-answer")) return;
    const choice = Number(node.dataset.choice);
    // A retry after a lost reply reuses the attempt id, so it is recorded once.
    const same = ui.ghostAttempt && ui.ghostAttempt.ghost === g.id && ui.ghostAttempt.index === current.index && ui.ghostAttempt.choice === choice;
    if (!same) ui.ghostAttempt = { ghost: g.id, index: current.index, choice, id: uuid() };
    feedback(ui, "Answer sent. Waiting for the server…");
    ghostAction(ui, "ghost-answer", "answer", { questionIndex: current.index, choice, attemptId: ui.ghostAttempt.id }).then(() => tick(ui));
  }
  function ghostCounter(ui, g) {
    view(ui, "ghost-counter", `<div class="ar-section-head"><h2>Suggest a different stake</h2>${button("back", "Back")}</div><p>${esc(g.courseTitle)} · ${number(g.questionCount)} questions. Proposal ${number(g.revision)}.</p><form class="ar-form">${stakeField(ui, g.stake)}${button("ghost-send-counter", "Send new proposal")}</form>`);
    const form = ui.content.querySelector("form");
    form.onsubmit = event => { event.preventDefault(); ui.content.querySelector('[data-ar="ghost-send-counter"]').click(); };
    ui.content.querySelector('[data-ar="back"]').onclick = () => showGhost(ui, g.id);
    ui.content.querySelector('[data-ar="ghost-send-counter"]').onclick = () => perform(ui, "ghost-send-counter", async () => {
      const epoch = ui.epoch, data = await request("/arena/ghosts/" + encodeURIComponent(g.id) + "/counter", { actor: ui.actor, signal: ui.controller.signal, body: { revision: g.revision, stake: chosenStake(form) } });
      if (!live(ui) || ui.epoch !== epoch) return;
      if (!ghostValid(data.ghost, ui)) throw Error("The new proposal was not confirmed. Reopen the race.");
      renderGhost(ui, data.ghost); feedback(ui, "New stake proposed. Waiting for the other player to accept.");
    });
    wireWallet(ui, g.stake);
    form.querySelector('[name="stake"]').focus();
  }
  function renderGhost(ui, g) {
    if (!live(ui)) return;
    const focused = document.activeElement, focusInside = ui.content.contains(focused), focusedAction = focused?.dataset?.ar, focusedChoice = focused?.dataset?.choice;
    ui.ghost = g; ui.state = null; ui.challenge = null; disposeSocket(ui, "match");
    ui.serverOffset = Number(g.serverNow || Date.now()) - Date.now();
    const you = g.you, other = g.participants[1 - you] || {}, otherName = ghostOtherName(g), n = Number(g.questionCount), current = g.current;
    const round = current?.decided ? g.rounds.find(r => r.index === current.index) : null;
    const played = g.status !== "pending" && (ghostMine(g, "started") || ghostTheirs(g, "started"));
    const scores = played || ["finished", "void"].includes(g.status)
      ? `<div class="ar-scoreboard">${[you, 1 - you].map((p, i) => `<div class="ar-player ${i ? "" : "is-you"}"><span class="ar-eyebrow">${i ? esc(otherName) : "You"}</span><strong>${esc(g.participants[p]?.name)}</strong><b>${number(g.scores[p])}</b><span>${g.finished?.[p] ? "run complete" : number(g.progress?.[p]) + " of " + number(n) + " played"}</span></div>`).join('<span class="ar-versus" aria-hidden="true">vs</span>')}</div>` : "";
    let body;
    if (current) {
      const out = new Set(current.eliminated || []);
      body = `<section class="ar-round ar-ghost-round" data-ghost-round="${number(current.index)}"><div class="ar-section-head"><h2 tabindex="-1">Question ${number(current.index + 1)} of ${number(n)}</h2><span class="ar-chip" data-clock></span></div><p class="ar-question">${esc(current.question)}</p><div class="ar-options">${current.options.map((option, i) => `<button type="button" class="ar-option ${out.has(i) ? "is-eliminated" : ""} ${round && round.correctIndex === i ? "is-correct" : ""}" data-choice="${i}"><span>${String.fromCharCode(65 + i)}</span><span>${esc(option)}</span>${out.has(i) ? "<small>You chose this · incorrect</small>" : ""}</button>`).join("")}</div>${round ? `<div class="ar-explanation"><h3>${esc(ghostPointText(g, round.point) || (round.you?.correct ? "Correct" : "Out of attempts"))}</h3><p>You: ${esc(ghostOutcome(round.you))} · ${esc(otherName)}: ${esc(round.them ? ghostOutcome(round.them) : "not played yet")}.</p><p>${esc(round.explanation || "The server has checked this question.")}</p></div>${button("ghost-next", "Next question")}` : `<p class="ar-note">Mistakes this question: ${number(current.wrong)}/3. Your time counts from the moment the question appeared.${ghostTheirs(g, "started") ? " " + esc(otherName) + "’s time for this question appears once you finish it." : ""}</p>`}</section>`;
    } else if (g.status === "pending" && you === (g.proposer ?? 0)) {
      body = `<section class="ar-ready"><h2>Invitation sent.</h2><p>Nothing is played until ${esc(otherName)} accepts. They can accept until ${esc(date(g.inviteEndsAt))}.</p><p>Then each of you has a week to play the same ${number(n)} ${esc(g.courseTitle)} questions, whenever suits you.</p></section>`;
    } else if (g.status === "pending") {
      body = `<section class="ar-ready"><h2>${esc(otherName)} invited you to a ghost race.</h2><p>${number(n)} questions from ${esc(g.courseTitle)}. Nobody needs to be online at the same time: once you accept, each of you plays the same questions whenever suits you within a week, and each point goes to whoever would have got there first at a shared table.</p><p>Accept by ${esc(date(g.inviteEndsAt))}.</p><div class="ar-actions">${button("ghost-accept", "Accept")}${button("ghost-decline", "Decline")}</div></section>`;
    } else if (g.status === "open" && !ghostMine(g, "finished")) {
      const theirs = ghostTheirs(g, "finished") ? `${esc(otherName)} has played their run, so you will race their ghost: after each question you see how they did.` : ghostTheirs(g, "started") ? `${esc(otherName)} is playing their run.` : `${esc(otherName)} has not played yet. Whoever plays second races the other’s recorded run.`;
      body = `<section class="ar-ready"><h2>${ghostMine(g, "started") ? "Continue your run." : "Ready when you are."}</h2><p>${number(n)} questions from ${esc(g.courseTitle)}. Each question’s clock starts when it appears, so start when you have a few quiet minutes. Play by ${esc(date(g.playEndsAt))}.</p><p>${theirs}</p><div class="ar-actions">${button("ghost-start", ghostMine(g, "started") ? "Continue my run" : "Start my run")}${ghostMine(g, "started") ? "" : button("ghost-backout", "Back out")}</div></section>`;
    } else if (g.status === "open") {
      body = `<section class="ar-ready"><h2>Your run is recorded.</h2><p>${ghostTheirs(g, "started") ? esc(otherName) + " is playing their run." : esc(otherName) + " has not played yet."} They can play until ${esc(date(g.playEndsAt))}. You will get a notification with the result.</p></section>`;
    } else if (g.status === "finished" && g.result) {
      const r = g.result, title = r.winner == null ? "A well-matched draw." : r.winner === you ? "A round of applause. You won!" : "A good race. A new discovery.";
      body = `<section class="ar-result">${emblem()}<span class="ar-eyebrow">Ghost race complete</span><h2>${esc(title)}</h2><p class="ar-final-score">${number(r.scores?.[you])} <span>:</span> ${number(r.scores?.[1 - you])}</p><p>${esc(ghostResultReason(g))}</p>${ratingResult(r.rating)}<div class="ar-h2h" data-h2h></div>${key(other.accountKey) ? button("ghost-again", "Race again") : ""}</section>`;
    } else if (g.status === "void") {
      const v = g.voided || {};
      const why = v.by == null ? "Both runs were left unfinished" : ghostLeftText(g, v.by, v.reason) + " at " + number(v.scores?.[you]) + "–" + number(v.scores?.[1 - you]);
      body = `<section class="ar-empty ar-void"><h2>No result</h2><p>${esc(why)}, before the race was decided.</p><p>No win, loss or rating change has been recorded for either player.</p></section>`;
    } else {
      body = `<section class="ar-empty"><h2>${esc({ expired: "Race expired", declined: "Invitation declined", cancelled: "Race cancelled" }[g.status] || "Race closed")}</h2><p>${esc(ghostClosedText(g))}</p><p>No win, loss or rating change has been recorded.</p></section>`;
    }
    const rounds = !current && g.rounds.length ? `<h3>Question by question</h3><ol class="ar-ghost-rounds">${g.rounds.map(r => ghostRoundHTML(g, r)).join("")}</ol>` : "";
    const actions = (g.status === "pending" ? button("ghost-counter", "Suggest a different stake") + (you === (g.proposer ?? 0) ? button("ghost-cancel", "Cancel invitation") : "") : "") + (g.status === "open" && ghostMine(g, "started") && !ghostMine(g, "finished") ? button("ghost-leave", "Leave race") : "") + button("back", "Back to challenges");
    view(ui, "ghost", `<div class="ar-section-head"><div><span class="ar-eyebrow">Ghost race · ${esc(g.courseTitle || g.courseId)}</span><h2>${esc(otherName)}</h2></div><span class="ar-chip">${esc(ghostLabel(g))}</span></div>${scores}${wagerHTML(g, you, ui)}${body}${rounds}<div class="ar-actions">${actions}</div>${ghostRules()}`);
    const on = (action, fn) => ui.content.querySelector('[data-ar="' + action + '"]')?.addEventListener("click", fn);
    on("ghost-counter", () => ghostCounter(ui, g));
    on("ghost-start", () => ghostAction(ui, "ghost-start", "next"));
    on("ghost-next", () => ghostAction(ui, "ghost-next", "next"));
    on("ghost-accept", () => ghostAction(ui, "ghost-accept", "accept"));
    on("ghost-decline", () => ask(ui, "Decline this ghost race?", otherName + " will see that you declined. Nothing is recorded for either of you.", "Decline", () => ghostAction(ui, "ghost-decline", "decline")));
    on("ghost-cancel", () => ask(ui, "Cancel this invitation?", "The race closes before anything is played. Nothing is recorded for either of you.", "Cancel invitation", () => ghostAction(ui, "ghost-cancel", "cancel")));
    on("ghost-backout", () => ask(ui, "Back out of this race?", "You have not started your run, so the race simply ends with no result for either of you.", "Back out", () => ghostAction(ui, "ghost-backout", "leave")));
    on("ghost-leave", () => ask(ui, "Leave this race?", leaveOutcome(g) + (g.stake ? " The stake follows that result; a no-result ending refunds each player." : ""), "Leave race", () => ghostAction(ui, "ghost-leave", "leave")));
    on("ghost-again", () => challenge({ accountKey: other.accountKey, name: other.name }, { format: "ghost" }));
    on("back", () => { ui.ghost = null; hub(ui); });
    ui.content.querySelectorAll("[data-choice]").forEach(node => { node.onclick = () => ghostAnswer(ui, node); });
    if (g.status === "finished") paintHeadToHead(ui, other);
    wireWallet(ui, g.stake);
    refreshWager(ui, g);
    tick(ui); math(ui.content);
    if (focusInside) (focusedChoice != null ? ui.content.querySelector('[data-choice="' + focusedChoice + '"]') : ui.content.querySelector('[data-ar="' + (focusedAction || "") + '"]'))?.focus({ preventScroll: true });
    if (current && !current.decided && !focusInside) ui.content.querySelector(".ar-ghost-round h2")?.focus({ preventScroll: true });
  }
  async function showChallenge(ui, id) {
    const epoch = view(ui, "challenge", '<p>Loading the agreed terms…</p>');
    try {
      const data = await request("/arena/challenges/" + encodeURIComponent(id), { actor: ui.actor, signal: ui.controller.signal });
      if (!live(ui) || ui.epoch !== epoch) return;
      if (!challengeValid(data.challenge, ui)) throw Error("This challenge is unavailable to the connected account.");
      renderChallenge(ui, data.challenge, data.state);
    } catch (error) { loadFailure(ui, epoch, "This challenge", error, () => showChallenge(ui, id)); }
  }
  function renderChallenge(ui, value, state) {
    if (!live(ui)) return;
    ui.challenge = value; const you = value.participants.findIndex(p => key(p.accountKey) === ui.actor.account);
    if (["accepted", "playing", "finished", "void"].includes(value.status)) { view(ui, "match", "<p>Connecting to the shared table…</p>"); if (state) acceptState(ui, state); connect(ui, "match", value.id); return; }
    ui.state = null; disposeSocket(ui, "match");
    view(ui, "challenge", `<div class="ar-section-head"><h2>${esc(value.participants[1 - you].name)}</h2><span class="ar-chip">${esc(statusLabel(value))}</span></div><section class="ar-terms"><h3>Agreed course & time</h3><p>${terms(value)}</p>${value.cancelReason ? `<p>${esc(value.cancelReason)}</p>` : ""}${value.status === "expired" && value.accepted ? "<p>Both players were not ready in time, so this match never started. No win, loss or rating change was recorded.</p>" : ""}<p>Proposal ${number(value.revision)} · expires ${esc(date(value.expiresAt))}</p></section>${wagerHTML(value, you, ui)}<div class="ar-actions">${value.status === "pending" ? value.recipient === you ? button("accept", "Accept invitation") + button("counter", "Suggest different terms") + button("decline", "Decline") : button("counter", "Suggest different terms") + button("cancel", "Cancel invitation") : ""}${button("back", "All challenges")}</div>${rules()}`);
    ui.content.querySelector('[data-ar="back"]').onclick = () => hub(ui);
    for (const action of ["accept", "decline", "cancel"]) {
      const node = ui.content.querySelector('[data-ar="' + action + '"]'); if (!node) continue;
      node.onclick = () => perform(ui, action, async () => {
        const epoch = ui.epoch, data = await request("/arena/challenges/" + encodeURIComponent(value.id) + "/respond", { actor: ui.actor, signal: ui.controller.signal, body: { revision: value.revision, action } });
        if (!live(ui) || ui.epoch !== epoch) return;
        if (!challengeValid(data.challenge, ui)) throw Error("The response was not confirmed. Refresh the challenge.");
        renderChallenge(ui, data.challenge, data.state);
      });
    }
    const counter = ui.content.querySelector('[data-ar="counter"]');
    if (counter) counter.onclick = () => perform(ui, "counter", async () => {
      const epoch = ui.epoch, config = await request("/arena/config", { signal: ui.controller.signal });
      if (!live(ui) || ui.epoch !== epoch) return;
      if (!config.available || !Array.isArray(config.courses)) throw Error("Course choices are temporarily unavailable.");
      ui.config = config; offer(ui, value.participants[1 - you], value);
    });
    wireWallet(ui, value.stake);
    if (value.status === "pending" && value.recipient === you) markInvitation(ui.actor, value);
    connect(ui, "inbox");
  }
  function connect(ui, channel, matchId) {
    if (!live(ui) || !ui.actor.account) return;
    if (channel === "inbox") { startBackground(); return; }
    if (ui[channel] && ui[channel].matchId === matchId) return;
    disposeSocket(ui, channel);
    const item = { matchId, attempts: 0, stopped: false, socket: null, retry: 0, ping: 0 }; ui[channel] = item;
    const valid = () => live(ui) && !item.stopped && ui[channel] === item;
    const label = message => { if (valid() && (channel === "match" || !ui.match)) ui.dialog.querySelector(".ar-connection").textContent = message; };
    const retry = () => {
      if (!valid()) return;
      clearInterval(item.ping); item.socket = null; label("Reconnecting… Answers wait for the server connection."); tick(ui);
      clearTimeout(item.retry); item.retry = setTimeout(start, Math.min(30000, 1000 * (2 ** Math.min(item.attempts++, 5))));
    };
    const start = async () => {
      if (!valid()) return;
      label("Connecting securely…");
      try {
        const ticket = await request("/arena/socket-ticket", { actor: ui.actor, signal: ui.controller.signal, body: { channel, ...(matchId ? { matchId } : {}) } });
        if (!valid()) return;
        const url = new URL(ticket.url), expected = new URL(base);
        if (!["ws:", "wss:"].includes(url.protocol) || url.host !== expected.host || Number(ticket.expiresAt) <= Date.now()) throw Error("The live connection ticket is invalid.");
        const socket = new WebSocket(url.href); item.socket = socket;
        socket.onopen = () => { if (!valid()) { socket.close(); return; } item.attempts = 0; item.awaitingResume = true; label("Live connection"); item.ping = setInterval(() => { if (valid() && socket.readyState === 1) socket.send(JSON.stringify({ type: "ping", nonce: uuid() })); }, 20000); tick(ui); };
        socket.onmessage = event => {
          if (!valid() || item.socket !== socket) return;
          let message; try { message = JSON.parse(event.data); } catch (_) { feedback(ui, "An unreadable live update was ignored. Reconnect if play does not resume.", true); return; }
          if (message.type === "state" && channel === "match") {
            const resume = item.awaitingResume && validState(ui, message.state);
            acceptState(ui, message.state);
            if (resume) {
              item.awaitingResume = false;
              // If a click never reached the old socket, the resumed state can
              // legitimately have the same revision. Retry the identical
              // command, so a lost receipt never strands or double-charges it.
              const pending = ui.pendingAnswer;
              if (pending && message.state.status === "playing" && !message.state.round?.resolved && pending.roundId === message.state.round?.id) send(ui, "answer", pending);
            }
          }
          else if (message.type === "watch" && channel === "watch") acceptWatch(ui, message.state);
          else if (message.type === "error") { ui.pendingAnswer = null; feedback(ui, message.error || "The server could not accept that action.", true); tick(ui); }
          else if (message.type === "pong" && Number.isFinite(message.serverNow)) ui.serverOffset = message.serverNow - Date.now();
          else if (message.type === "refresh" && channel === "inbox") {
            if (ui.view === "duels") hub(ui);
            else if (ui.view === "challenge" && ui.challenge?.id === message.matchId) showChallenge(ui, message.matchId);
            else if (message.matchId && ui.view !== "match") feedback(ui, "A challenge has an update. Open Duels to see the latest reply.");
          }
        };
        socket.onerror = () => { label("Connection interrupted. Reconnecting…"); };
        socket.onclose = event => {
          // A closed watch (consent withdrawn, or the session ended) is final.
          if (channel === "watch" && [4001, 4003].includes(event?.code) && valid()) { item.stopped = true; label(""); watchClosed(ui, event.code === 4003 ? "A player stopped allowing watchers, so this match is closed to watching." : "Your session ended. Reconnect your account to watch."); return; }
          retry();
        };
      } catch (error) {
        if (!valid()) return;
        if (channel === "watch" && error.code === "watch_unavailable") { item.stopped = true; label(""); watchClosed(ui, error.message); return; }
        label(error.message || "Connection unavailable."); retry();
      }
    };
    start();
  }
  function validState(ui, state) {
    return !!state && state.matchId === ui.challenge?.id && Number.isInteger(state.revision) && [0, 1].includes(state.you) && Array.isArray(state.participants) && key(state.participants[state.you]?.accountKey) === ui.actor.account && Array.isArray(state.scores) && state.scores.length === 2 && state.scores.every(n => Number.isFinite(n) && n >= 0) && (!state.round || (typeof state.round.id === "string" && Array.isArray(state.round.options) && state.round.options.length >= 2 && state.round.options.length <= 8 && Array.isArray(state.round.wrong) && Array.isArray(state.round.cooldownUntil) && Array.isArray(state.round.eliminated)));
  }
  function acceptState(ui, state) {
    if (!live(ui) || !validState(ui, state)) { if (live(ui)) feedback(ui, "The live match could not be verified. Reopen it from Duels.", true); return; }
    if (ui.state && state.matchId === ui.state.matchId && state.revision < ui.state.revision) return;
    const old = ui.state; ui.state = state; ui.serverOffset = Number(state.serverNow || Date.now()) - Date.now();
    if (ui.pendingAnswer && (!old || state.round?.id !== ui.pendingAnswer.roundId || state.round?.resolved || Number(state.round?.wrong?.[state.you]) !== Number(old.round?.wrong?.[state.you]))) {
      ui.pendingAnswer = null;
      feedback(ui, state.round?.resolved ? "Round confirmed. Review the explanation together." : "Answer checked by the server.");
    }
    renderMatch(ui);
    refreshReward(ui, state.reward, state.matchId);
  }
  function send(ui, type, payload = {}) {
    if (!live(ui) || ui.match?.socket?.readyState !== 1) { feedback(ui, "Reconnecting. Wait for the live connection before playing.", true); return false; }
    try { ui.match.socket.send(JSON.stringify({ type, commandId: uuid(), ...payload })); return true; }
    catch (_) { feedback(ui, "The connection changed. Reconnect before trying that action again.", true); return false; }
  }
  function renderResult(ui, result) {
    const you = ui.state?.you ?? ui.challenge.participants.findIndex(p => key(p.accountKey) === ui.actor.account);
    const title = result.winner == null ? "A well-matched draw." : result.winner === you ? "A round of applause. You won!" : "A good match. A new discovery.";
    const opponent = ui.state?.participants?.[1 - you] || ui.challenge?.participants?.[1 - you] || {};
    return `<section class="ar-result">${emblem()}<span class="ar-eyebrow">Match complete</span><h2>${esc(title)}</h2><p class="ar-final-score">${number(result.scores?.[you])} <span>:</span> ${number(result.scores?.[1 - you])}</p><p>${esc(resultReason(result, you))}</p>${ratingResult(result.rating)}<div class="ar-h2h" data-h2h><p class="ar-note" role="status">Looking up your record against ${esc(opponent.name || "this player")}…</p></div>${key(opponent.accountKey) && key(opponent.accountKey) !== ui.actor.account ? button("rematch", "Play again") : ""}</section>`;
  }
  function renderMatch(ui) {
    const state = ui.state; if (!live(ui) || !state) return;
    const focused = document.activeElement, focusInside = ui.content.contains(focused), focusedAction = focused?.dataset?.ar, focusedChoice = focused?.dataset?.choice;
    const you = state.you, other = 1 - you, round = state.round;
    ui.view = "match";
    refreshWager(ui, state);
    ui.content.innerHTML = `${wagerHTML(state, you, ui)}<div class="ar-scoreboard">${[you, other].map((p, i) => `<div class="ar-player ${i ? "" : "is-you"}"><span class="ar-eyebrow">${i ? "Opponent" : "You"} · ${state.online?.[p] ? "online" : "offline"}</span><strong>${esc(state.participants[p]?.name)}</strong><b>${number(state.scores[p])}</b><span>${state.ready?.[p] ? "Ready" : "Not ready"}</span></div>`).join('<span class="ar-versus" aria-hidden="true">vs</span>')}</div>${state.result ? renderResult(ui, state.result) : ""}${state.status === "void" ? `<section class="ar-empty ar-void"><h2>No result</h2><p>${esc(voidReason(state.voided, you))}</p><p>No win, loss or rating change has been recorded for either player.</p></section>` : ["cancelled", "abandoned", "expired"].includes(state.status) ? `<section class="ar-empty"><h2>${state.status === "abandoned" ? "Match ended with no result" : state.status === "expired" ? "Match not started" : "Match cancelled"}</h2><p>${state.status === "expired" ? "Both players were not ready within ten minutes of the agreed time, so the match never started. " : ""}No win, loss or rating change has been recorded.</p></section>` : state.status === "accepted" ? `<section class="ar-ready"><h2>Your table is waiting.</h2><p>${terms(ui.challenge)}</p><p>Both players must be online and Ready. ${state.ready?.[you] ? "You are ready; waiting for the other player or scheduled time." : "Review the terms, then join when you are ready."}</p>${button("ready", state.ready?.[you] ? "You are ready" : "I’m ready", state.ready?.[you] ? 'aria-disabled="true"' : "")}</section>` : round ? `<section class="ar-round" data-round="${esc(round.id)}"><div class="ar-section-head"><h2 tabindex="-1">Question ${number(state.roundIndex + 1)} of ${number(state.questionCount)}</h2><span class="ar-chip" data-clock></span></div><p class="ar-question">${esc(round.question)}</p><div class="ar-options">${round.options.map((option, i) => `<button type="button" class="ar-option ${round.eliminated.some(e => e.choice === i) ? "is-eliminated" : ""} ${round.resolved && round.correctIndex === i ? "is-correct" : ""}" data-choice="${i}"><span>${String.fromCharCode(65 + i)}</span><span>${esc(option)}</span>${round.eliminated.some(e => e.choice === i) ? `<small>${round.eliminated.find(e => e.choice === i).by === you ? "You chose this" : "Opponent chose this"} · incorrect</small>` : ""}</button>`).join("")}</div><p class="ar-note">Your mistakes this question: ${number(round.wrong[you])}/3 · opponent: ${number(round.wrong[other])}/3. Counters reset at the next question.</p>${round.resolved ? `<div class="ar-explanation"><h3>${round.winner == null ? "Round complete" : round.winner === you ? "Your point" : "Opponent’s point"}</h3><p>${esc(round.explanation || "The server has resolved this round.")}</p></div>${state.status === "finished" ? "" : button("next", round.nextReady?.[you] ? "Waiting for the other player…" : "Next question", round.nextReady?.[you] ? 'aria-disabled="true"' : "")}` : ""}</section>` : '<section class="ar-ready"><h2>Get ready.</h2><p data-clock>Waiting for the server’s first question…</p></section>'}${["accepted", "playing"].includes(state.status) ? `<section class="ar-watch-consent"><p class="ar-note">${esc(watchNote(state))}</p>${button("spectators", state.spectators?.[you] ? "Stop letting connections watch" : "Let study connections watch", `aria-pressed="${state.spectators?.[you] ? "true" : "false"}"`)}</section>` : ""}<div class="ar-actions">${["accepted", "playing"].includes(state.status) ? button("leave", state.status === "playing" ? "Leave match" : "Cancel before play") : button("back", "Back to challenges")}</div>`;
    wireWallet(ui, state.stake);
    ui.content.querySelector('[data-ar="ready"]')?.addEventListener("click", () => { if (!ui.state.ready?.[you]) send(ui, "ready"); });
    ui.content.querySelector('[data-ar="spectators"]')?.addEventListener("click", () => { if (send(ui, "spectators", { allow: !ui.state.spectators?.[you] })) feedback(ui, ui.state.spectators?.[you] ? "Closing the match to watchers…" : "Allowing study connections to watch…"); });
    ui.content.querySelector('[data-ar="next"]')?.addEventListener("click", () => { if (ui.state.round?.resolved && !ui.state.round.nextReady?.[you]) send(ui, "next", { roundId: ui.state.round.id }); });
    ui.content.querySelectorAll("[data-choice]").forEach(node => { node.onclick = () => {
      tick(ui); if (node.getAttribute("aria-disabled") === "true" || ui.pendingAnswer) return;
      const pending = { commandId: uuid(), roundId: ui.state.round.id, choice: Number(node.dataset.choice) };
      if (send(ui, "answer", pending)) { ui.pendingAnswer = pending; feedback(ui, "Answer sent. Waiting for the server…"); tick(ui); }
    }; });
    ui.content.querySelector('[data-ar="leave"]')?.addEventListener("click", () => ask(ui, ui.state.status === "playing" ? "Leave this match?" : "Cancel this table?", (ui.state.status === "playing" ? leaveOutcome(ui.state) : "Cancelling before play will not count as a loss.") + (ui.state.stake ? " The stake follows that result; a no-result ending refunds each player." : ""), ui.state.status === "playing" ? "Leave match" : "Confirm cancellation", () => perform(ui, "leave", async () => {
      const data = await request("/arena/challenges/" + encodeURIComponent(ui.challenge.id) + "/leave", { actor: ui.actor, signal: ui.controller.signal, body: {} });
      if (live(ui)) { if (data.state) acceptState(ui, data.state); else if (challengeValid(data.challenge, ui)) renderChallenge(ui, data.challenge); else throw Error("The result was not confirmed. Reopen the match."); }
    })));
    ui.content.querySelector('[data-ar="back"]')?.addEventListener("click", () => { disposeSocket(ui, "match"); ui.state = null; hub(ui); });
    if (state.result) paintHeadToHead(ui, state.participants?.[other] || ui.challenge?.participants?.[other]);
    tick(ui); math(ui.content);
    if (focusInside) (focusedChoice != null ? ui.content.querySelector('[data-choice="' + focusedChoice + '"]') : ui.content.querySelector('[data-ar="' + (focusedAction || "") + '"]'))?.focus({ preventScroll: true });
  }
  // The record is read after the result is painted: a slow lookup must never
  // delay the score, and a failure leaves the result card intact.
  function paintHeadToHead(ui, opponent) {
    const account = key(opponent?.accountKey), host = ui.content.querySelector("[data-h2h]");
    if (!host) return;
    const rematch = ui.content.querySelector('[data-ar="rematch"]');
    if (rematch) rematch.addEventListener("click", () => challenge({ accountKey: account, name: opponent?.name }));
    if (!account || account === ui.actor.account || !ui.actor.account) { host.innerHTML = ""; return; }
    request("/arena/head-to-head?opponent=" + encodeURIComponent(account), { actor: ui.actor, signal: ui.controller.signal })
      .then(data => { if (live(ui) && host.isConnected) host.innerHTML = headToHeadHTML(data.headToHead, opponent?.name); })
      .catch(() => { if (host.isConnected) host.innerHTML = ""; });
  }
  function tick(ui) {
    if (!live(ui)) { if (current === ui) close(); return; }
    const state = ui.state, now = Date.now() + ui.serverOffset;
    if (ui.view === "match" && state) {
      const round = state.round, remaining = Math.max(0, Number(round?.cooldownUntil?.[state.you] || 0) - now), countdown = Math.max(0, Number(state.startAt || 0) - now), connected = ui.match?.socket?.readyState === 1;
      const clock = ui.content.querySelector("[data-clock]");
      const nextMine = Number(round?.nextDeadline?.[state.you] || 0) - now, nextTheirs = Number(round?.nextDeadline?.[1 - state.you] || 0) - now;
      if (clock) clock.textContent = !connected ? "Reconnecting…" : countdown > 0 ? "Starts in " + Math.ceil(countdown / 1000) : remaining > 0 ? "Try again in " + Math.ceil(remaining / 1000) + "s" : round?.resolved ? (state.status === "playing" && nextMine > 0 ? "Choose Next within " + Math.ceil(nextMine / 1000) + "s" : state.status === "playing" && nextTheirs > 0 ? "Opponent has " + Math.ceil(nextTheirs / 1000) + "s to continue" : "Review together") : "First correct answer wins";
      ui.content.querySelectorAll("[data-choice]").forEach(node => node.setAttribute("aria-disabled", String(!connected || state.status !== "playing" || !!round?.resolved || remaining > 0 || countdown > 0 || !!ui.pendingAnswer || !!round?.eliminated.some(e => e.choice === Number(node.dataset.choice)))));
    }
    if (ui.view === "ghost" && ui.ghost?.current) {
      const c = ui.ghost.current, pause = Math.max(0, Number(c.retryAt || 0) - now), clock = ui.content.querySelector("[data-clock]");
      if (clock) clock.textContent = c.decided ? "Question decided" : pause > 0 ? "Try again in " + Math.ceil(pause / 1000) + "s" : "Time " + seconds(now - Number(c.servedAt));
      ui.content.querySelectorAll("[data-choice]").forEach(node => node.setAttribute("aria-disabled", String(!!c.decided || pause > 0 || ui.busy.has("ghost-answer") || (c.eliminated || []).includes(Number(node.dataset.choice)))));
    }
    if (ui.view === "puzzle" && ui.puzzle) paintPuzzleClock(ui);
  }
  function recordHTML(record, compact = false) {
    if (!record || !Array.isArray(record.honors)) return '<p class="ar-note">Competition record is not shared.</p>';
    const honors = record.honors.filter(h => Number(h.earnedAt || h.awardedAt) > 0);
    return `<span class="ar-eyebrow ar-record-eyebrow">Duel record</span><div class="ar-record-stats">${[["Wins", record.wins], ["Draws", record.draws], ["Losses", record.losses], ["Opponents", record.uniqueOpponents]].map(([label, value]) => `<div><strong>${number(value)}</strong><span>${label}</span></div>`).join("")}</div><div class="ar-honors">${honors.length ? honors.map(h => `<article class="ar-honor">${emblem()}<div><h3>${esc(h.title)}</h3><p>${esc(h.description)}</p><span>${esc(date(h.earnedAt || h.awardedAt))}</span></div></article>`).join("") : '<p class="ar-note">Honours come from playing others: the rating above also grows from quizzes taken alone. Complete friendly duels and weekend events to discover honours.</p>'}</div>${Array.isArray(record.progression) ? `<div class="ar-progression">${record.progression.map(p => `<article><strong>${esc(p.title)}</strong><p>${esc(p.description)}</p><progress max="${Math.max(1, Number(p.target) || 1)}" value="${Math.max(0, Math.min(Number(p.target) || 1, Number(p.progress) || 0))}" aria-label="${esc(p.title)}"></progress><span>${number(p.progress)} / ${number(p.target)}</span></article>`).join("")}</div>` : ""}${!compact && Array.isArray(record.recent) && record.recent.length ? `<h3>Recent matches</h3><div class="ar-history">${record.recent.map(r => `<article><strong>${esc(r.courseTitle)}</strong><span>${esc(r.outcome)} · ${number(r.scores?.[0])}–${number(r.scores?.[1])}${r.mode === "ghost" ? " · ghost race" : ""}${r.leftBy === "you" ? " · you left" : r.leftBy === "opponent" ? " · opponent left" : ""}</span><span>${esc(date(r.finishedAt))}</span></article>`).join("")}</div>` : ""}${!compact && Array.isArray(record.events) && record.events.length ? `<h3>Weekend discoveries</h3><div class="ar-history">${record.events.map(r => `<article><strong>${esc(r.title || r.eventId)}</strong><span>${number(r.score)} / 100</span><span>${esc(r.mode || "")}</span></article>`).join("")}</div>` : ""}`;
  }
  async function records(ui) {
    const epoch = view(ui, "record", '<h2>Your competition story</h2><p>Loading your record…</p>');
    if (!ui.actor.account) { accountPrompt(ui); return; }
    try {
      const data = await loadMe(ui); if (!live(ui) || ui.epoch !== epoch || !data) return;
      ui.content.innerHTML = `<div class="ar-section-head"><h2>Your competition story</h2>${button("refresh", "Refresh")}</div>${ratingHTML(data.rating, true)}${coverageHTML(data.coverage)}${recordHTML(data.record)}<section class="ar-settings"><h3>Your choice of company</h3><label><input type="checkbox" data-setting="invitations" ${data.settings.invitations ? "checked" : ""}> Allow other learners to invite me</label><label><input type="checkbox" data-setting="publicRecord" ${data.settings.publicRecord ? "checked" : ""}> Show my competition record on my public profile</label><p class="ar-note">Invitation preferences and record visibility are independent. While invitations are allowed, learners who can find you in public rankings or on your public profile can invite you. A shared record also needs a public profile and public rankings. Turning invitations off does not silently decline a pending invitation.</p>${button("save-settings", "Save preferences")}</section>`;
      ui.content.querySelector('[data-ar="refresh"]').onclick = () => records(ui);
      ui.content.querySelector('[data-ar="save-settings"]').onclick = () => perform(ui, "save-settings", async () => {
        const values = Object.fromEntries(Array.from(ui.content.querySelectorAll("[data-setting]")).map(input => [input.dataset.setting, input.checked]));
        const result = await request("/arena/settings", { actor: ui.actor, signal: ui.controller.signal, body: values });
        if (!live(ui) || ui.epoch !== epoch) return;
        if (typeof result.settings?.invitations !== "boolean" || typeof result.settings?.publicRecord !== "boolean") throw Error("Preferences were not confirmed. Refresh before retrying.");
        ui.content.querySelectorAll("[data-setting]").forEach(input => { input.checked = result.settings[input.dataset.setting]; }); feedback(ui, "Preferences saved.");
      });
    } catch (error) { loadFailure(ui, epoch, "Your record", error, () => records(ui)); }
  }
  function mountRecord(host, payload, collection) {
    if (!host || !enabled()) return () => {};
    const actor = context(), controller = new AbortController();
    let disposed = false;
    const mount = { actor, dispose: () => { if (disposed) return; disposed = true; controller.abort(); mounts.delete(mount); } }; mounts.add(mount);
    const valid = () => !disposed && host.isConnected && same(actor);
    const target = key(payload?.profile?.accountKey);
    host.innerHTML = '<section class="ar-profile"><div class="ar-section-head"><h3>Rating &amp; honours</h3></div><p role="status">Loading competition record…</p></section>';
    const section = host.querySelector(".ar-profile");
    if (collection && !actor.account) { section.innerHTML = '<h3>Rating &amp; honours</h3><p>Connect an account to build an EOR Rating from your own practice, and to collect honours from friendly duels and weekend events.</p>'; return mount.dispose; }
    if (!collection && !target) { mount.dispose(); host.replaceChildren(); return mount.dispose; }
    const load = () => {
      if (!valid()) return;
      section.innerHTML = '<h3>Rating &amp; honours</h3><p role="status">Loading competition record…</p>';
      request(collection ? "/arena/me" : "/arena/profile?account=" + encodeURIComponent(target), { ...(collection ? { actor } : {}), signal: controller.signal }).then(data => {
      if (!valid()) { mount.dispose(); return; }
      if (collection && key(data.me?.accountKey) !== actor.account) throw Error("Your connected account could not be confirmed.");
      if (data.record !== null && (!data.record || !Array.isArray(data.record.honors))) throw Error("Competition record is temporarily unavailable.");
      const name = payload?.profile?.name || "this player";
      const mine = !collection && actor.account && target !== actor.account;
      section.innerHTML = `<div class="ar-section-head"><h3>Rating &amp; honours</h3>${data.record ? '<span class="ar-chip">Earned through play</span>' : ""}</div>${ratingHTML(data.rating, collection)}${mine ? '<div class="ar-h2h" data-h2h></div>' : ""}${recordHTML(data.record, true)}${mine && data.challengeable ? button("rematch", "Challenge to a duel") : ""}${collection || payload?.self ? button("arena-open", "Open Arena & weekend events") : ""}`;
      section.querySelector('[data-ar="arena-open"]')?.addEventListener("click", open);
      section.querySelector('[data-ar="rematch"]')?.addEventListener("click", () => challenge({ accountKey: target, name }));
      math(section);
      // The viewer's own record against this player is a separate, signed
      // request, so the anonymous profile read above stays anonymous.
      if (mine) request("/arena/head-to-head?opponent=" + encodeURIComponent(target), { actor, signal: controller.signal }).then(h2h => {
        const host = valid() && section.querySelector("[data-h2h]");
        if (!host || !Number(h2h.headToHead?.played)) return;
        host.innerHTML = `<span class="ar-eyebrow">Between you</span>${headToHeadHTML(h2h.headToHead, name)}`;
        const again = section.querySelector('[data-ar="rematch"]');
        if (again) again.textContent = "Play again";
      }).catch(() => {});
      }).catch(error => {
        if (!valid()) return;
        section.innerHTML = `<h3>Rating &amp; honours could not load</h3><p role="status">${esc(error.message || "Competition record is temporarily unavailable.")}</p>${button("retry-record", "Try again")}`;
        section.querySelector('[data-ar="retry-record"]').onclick = load;
      });
    };
    load();
    return mount.dispose;
  }
  function eventAvailable(event) { return event.available !== false && event.curriculum?.available !== false; }
  function curriculumHTML(event) {
    const scope = event.curriculum; if (!scope) return "";
    const status = { "quiz-unavailable": "Quiz not available yet", "no-new-teaching": "No new taught topics this week", "timetable-pending": "Weekly timetable not available yet", "topics-pending": "Weekly topics not confirmed yet" };
    const unitLabel = tag => { const match = /-(lecture|week)(\d+)$/.exec(String(tag)); return match ? (match[1] === "lecture" ? "Lecture " : "Week ") + Number(match[2]) : String(tag); };
    return `<section class="ar-rules" aria-label="This weekend's course scope"><h3>${scope.phase === "revision" ? "Full block revision" : scope.phase === "pending" ? "Course scope pending" : "This week's course topics"}</h3><p class="ar-note">Year 1${scope.blockId ? " · Block " + esc(scope.blockId) : ""} · ${esc(scope.academicYear)}${scope.phase === "teaching" && scope.weekStartsOn ? " · week of " + esc(scope.weekStartsOn) : ""}</p><ul>${(Array.isArray(scope.courses) ? scope.courses : []).map(course => { const units = (Array.isArray(course.unitTags) ? course.unitTags : []).map(unitLabel); const label = course.status === "ready" ? (scope.phase === "revision" ? "All available quiz topics in this block" : units.length ? units.join(", ") : "This week's confirmed topics") + " · " + number(course.questionCount) + " questions in the pool" : status[course.status] || "Not included this weekend"; return `<li><strong>${esc(course.title)}</strong> — ${esc(label)}</li>`; }).join("")}</ul></section>`;
  }
  function eventCard(event) {
    const available = eventAvailable(event);
    return `<article class="ar-event ar-event--${esc(event.mode)}"><span class="ar-chip">${esc(!available ? "No competition scheduled" : event.status === "active" ? "This weekend · open" : event.status)}</span><span class="ar-event-symbol" aria-hidden="true">${event.mode === "relay" ? "↗" : event.mode === "route" ? "⌁" : event.mode === "sprint" ? "⚡" : "⋈"}</span><h3>${esc(event.title)}</h3><p>${esc(event.description)}</p><p class="ar-note">${esc(date(event.startsAt, event.timezone))} – ${esc(date(event.endsAt, event.timezone))}<br>${esc(event.timezone)}${available ? " · " + number(event.puzzleCount) + (event.mode === "sprint" ? " questions" : " puzzles") + " · " + number(event.maxScore) + " points" : ""}</p>${curriculumHTML(event)}${!available ? `<p class="ar-note" role="status">${esc(event.curriculum?.reason || "There are not enough confirmed questions for this weekend yet.")}</p>` : ""}${button("event", !available ? "View course scope" : event.status === "upcoming" ? "Preview the weekend" : "Open event", `data-event="${esc(event.id)}"`)}</article>`;
  }
  async function events(ui) {
    const epoch = view(ui, "events", `<section class="ar-hero ar-hero--events"><div><span class="ar-eyebrow">Keep up with your courses</span><h2>Your week. Ten quiz questions.</h2><p>From 26 September 2026, scheduled weekend quizzes follow the current Year 1 teaching week. After teaching ends, ten questions are drawn from the current block’s full available quiz pool until the next block starts. The 2026–2027 semester 1 programme is scheduled so far. Previous growth and honours stay with you.</p></div><span class="ar-event-symbol" aria-hidden="true">⌁</span></section><div class="ar-section-head"><h2>On the calendar</h2>${button("refresh", "Refresh")}</div><div class="ar-events"><p>Loading weekends…</p></div><details class="ar-rules"><summary>How weekend events work</summary><p>Events run from Saturday 00:00 to Monday 00:00 in Europe/Amsterdam, including daylight saving changes. The next two weekends are previewed here.</p><p>Each scheduled competition uses ten questions from the current block’s available quizzes, worth 100 points in total. During teaching, only the week’s taught topics, matched to the Wiki lecture or week labels, are included. After teaching ends, ten questions are drawn from the full available quiz pool of that block. A new block switches the scope to its own courses.</p><p>The course list shows what is included and which courses have no quiz yet. A course without a scheduled lecture contributes no new topics that week. Topics spanning several lecture weeks enter in their final labelled week. If the combined pool has fewer than ten eligible questions, the card says No competition scheduled and no official run opens.</p><p>For 2026–2027, only Year 1 blocks 1a and 1b are scheduled. Available quizzes currently cover Calculus in 1a, and Linear Algebra and Probability in 1b. Semester 2 awaits its course timetable. Probability uses six lecture weeks; former Week 7 material is excluded. Everyone receives the same ten selected questions that weekend. Full block revision still means ten questions, not the whole question bank.</p><p>Earlier weekends keep their original format, scores, XP, EORbits, rating and honours, with practice still available. In those historical puzzle games, your one official run has five puzzles. Correct on the first, second or third attempt earns 20, 12 or 6 points. Three incorrect attempts or an explicit skip earns zero. A wrong unfinished attempt has a two-second pause. Practise freely after completing your run or after the event closes.</p><p>In a Quiz Sprint, the official run has ten quiz questions, the same for everyone that weekend, opened one at a time. Each question’s clock starts when it appears. A correct answer earns 6, 3 or 1 points on the first, second or third attempt, plus 4, 3, 2 or 1 more for answering within 10, 20, 30 or 45 seconds. A wrong answer pauses you for 5 seconds, then 10, and a third ends the question for zero.</p><p>Finish an official quiz question (or a historical puzzle) with your own attempted answer to earn up to 8 XP and 8 EORbits once per question or historical puzzle, within shared daily limits. Up to five completed questions or historical puzzles earn these rewards per UTC day. Practice and skips do not earn rewards. The server records rewards with your daily activity.</p><p>After the event closes, an official run with at least one attempt also updates your EOR Rating. A ten-question quiz counts the same as five games against a 1500-rated opponent. Answer all ten questions and get at least six right to qualify for honours; historical puzzle events require all five completed and at least three solved. With at least two public qualifying participants, the top score wins; tied top scores share the honour. Speed counts inside a sprint’s points, but there is no tie-break beyond the score. The board remains provisional until the event has been finalized.</p></details>`);
    ui.content.querySelector('[data-ar="refresh"]').onclick = () => events(ui);
    try {
      const data = await request("/arena/events", { actor: ui.actor, signal: ui.controller.signal });
      if (!live(ui) || ui.epoch !== epoch) return;
      if (!Array.isArray(data.events)) throw Error("The event calendar is temporarily unavailable.");
      const host = ui.content.querySelector(".ar-events"); host.innerHTML = data.events.length ? data.events.map(eventCard).join("") : '<p class="ar-note">The next weekend programme has not been published yet.</p>';
      host.querySelectorAll("[data-event]").forEach(node => { node.onclick = () => showEvent(ui, node.dataset.event); }); math(host);
    } catch (error) { loadFailure(ui, epoch, "Weekend events", error, () => events(ui), ".ar-events"); }
  }
  async function showEvent(ui, id) {
    const epoch = view(ui, "event", '<p>Opening the weekend…</p>');
    try {
      const data = await request("/arena/events/" + encodeURIComponent(id), { actor: ui.actor, signal: ui.controller.signal });
      if (!live(ui) || ui.epoch !== epoch) return;
      if (!data.event || data.event.id !== id || !Array.isArray(data.puzzles)) throw Error("This event is temporarily unavailable.");
      renderEvent(ui, data);
    } catch (error) { loadFailure(ui, epoch, "This weekend", error, () => showEvent(ui, id)); }
  }
  function eventResults(data) {
    if (!eventAvailable(data.event)) return "";
    const finalized = data.event.status === "finalized";
    const honors = (Array.isArray(data.honors) ? data.honors : []).filter(h => h.eventId === data.event.id && Number(h.awardedAt) > 0);
    const winners = finalized ? `<section class="ar-event-winners"><h3>Confirmed weekend champions</h3><div class="ar-honors">${honors.length ? honors.map(h => `<article class="ar-honor">${emblem()}<div><h3>${esc(h.name || "Public participant")}</h3><p>${esc(h.title)} · ${number(h.score)} / 100</p><span>${Number(h.coWinnerCount) > 1 ? "Joint champion · shared top score" : "Weekend champion"}</span></div></article>`).join("") : '<p class="ar-note">No public championship is displayed. Awards require at least two qualifying public completed runs; winners also keep control of their privacy.</p>'}</div></section>` : "";
    return winners + `<section class="ar-leaders"><h3>${finalized ? "Final scores" : "Provisional leaders"}</h3>${Array.isArray(data.leaders) && data.leaders.length ? `<ol>${data.leaders.map(l => `<li><span>${number(l.rank)} · ${esc(l.name)}<small>${l.completed ? "Completed run" : finalized ? "Incomplete run" : "Run in progress"} · ${number(l.solvedCount)} solved</small></span><strong>${number(l.score)} / 100</strong></li>`).join("")}</ol>` : '<p class="ar-note">No public scores yet.</p>'}<p class="ar-note">${finalized ? (data.event.mode === "sprint" ? "The score list includes incomplete runs. Championship eligibility requires all ten questions completed and at least six correct; only the confirmed honours above identify winners." : "The score list includes incomplete runs. Championship eligibility requires all five puzzles completed and at least three solved; only the confirmed honours above identify winners.") : "Honours are confirmed after the event closes; the current leader is not yet an awarded champion."}</p></section>`;
  }
  function renderEvent(ui, data) {
    ui.eventData = data; ui.puzzle = null;
    const event = data.event, entry = data.entry, closed = ["closed", "finalized"].includes(event.status);
    if (!eventAvailable(event)) {
      view(ui, "event", `<div class="ar-section-head"><div><span class="ar-eyebrow">No competition scheduled</span><h2>${esc(event.title)}</h2></div>${button("back", "All weekends")}</div><p>${esc(event.description)}</p><p class="ar-note">${esc(date(event.startsAt, event.timezone))} – ${esc(date(event.endsAt, event.timezone))} · ${esc(event.timezone)}</p>${curriculumHTML(event)}<p class="ar-note" role="status">${esc(event.curriculum?.reason || "There are not enough confirmed questions for this weekend yet.")}</p>`);
      ui.content.querySelector('[data-ar="back"]').onclick = () => events(ui);
      return;
    }
    view(ui, "event", `<div class="ar-section-head"><div><span class="ar-eyebrow">${esc(event.mode)} · ${esc(event.status)}</span><h2>${esc(event.title)}</h2></div>${button("back", "All weekends")}</div><p>${esc(event.description)}</p><p class="ar-note">${esc(date(event.startsAt, event.timezone))} – ${esc(date(event.endsAt, event.timezone))} · ${esc(event.timezone)}</p>${curriculumHTML(event)}<div class="ar-actions">${button("calendar", "Add to my calendar (.ics)")}${ui.actor.account ? button("mute", event.muted ? "Remind me this weekend" : "Mute this weekend") : ""}</div>${entry ? `<section class="ar-event-score"><strong>${number(entry.score)}<small> / 100</small></strong><span>${number(entry.resolvedCount)} of ${number(data.puzzles.length || (event.mode === "sprint" ? 10 : 5))} completed · ${number(entry.solvedCount)} ${event.mode === "sprint" ? "correct" : "solved"}<br>${entry.completed ? "Official run complete. Your score is safely recorded." : closed ? "Official play has closed. Your unfinished run’s score is kept; you can continue in practice mode." : "Your official run is in progress."}</span></section>` : event.status === "active" ? (event.mode === "sprint" ? `<section class="ar-ready"><h3>One official run. Ten timed questions.</h3><p>Open one question at a time: its clock starts when it appears. Up to three attempts: 6 / 3 / 1 points, plus up to 4 for answering quickly. Skips earn zero.</p>${button("start-event", ui.actor.account ? "Start my official run" : "Connect to join")}</section>` : `<section class="ar-ready"><h3>One official run. Five discoveries.</h3><p>Up to three attempts per puzzle: 20 / 12 / 6 points. You may choose the order. Skips earn zero and reveal the solution.</p>${button("start-event", ui.actor.account ? "Start my official run" : "Connect to join")}</section>`) : event.status === "upcoming" ? '<p class="ar-note">The questions open when the event begins. Save the date or explore a previous weekend.</p>' : '<p class="ar-note">Official play has closed. You can still review this event in practice mode.</p>'}<div class="ar-puzzle-list">${data.puzzles.map((p, i) => { const result = entry?.puzzles?.find(x => x.id === p.id); if (p.mode === "sprint") { const open = Number(result?.servedAt) > 0 && !result?.finished; return `<article><span class="ar-eyebrow">Question ${i + 1} · ${esc(p.courseName)}</span><h3>${esc(result?.finished ? (result.solved ? "Answered correctly" : "No points") : open ? "Open now" : "A timed question")}</h3><p>${result?.finished ? `${number(result.points)} points` : open ? "Its clock is running." : "The clock starts when you open it."}</p>${button("puzzle", !ui.actor.account ? (closed ? "Connect to practise" : "Connect to join") : result?.finished && !entry.completed && !closed ? "Review answer" : entry?.completed || closed ? "Practise question" : open ? "Continue question" : "Open question", `data-puzzle="${esc(p.id)}" ${ui.actor.account && !entry && !closed ? 'aria-disabled="true"' : ""}`)}</article>`; } return `<article><span class="ar-eyebrow">Puzzle ${i + 1} · ${esc(p.courseName)}</span><h3>${esc(p.title)}</h3><p>${result?.finished ? `${number(result.points)} points · ${result.solved ? "solved" : "complete"}` : "A new connection to discover"}</p>${button("puzzle", !ui.actor.account ? (closed ? "Connect to practise" : "Connect to join") : result?.finished && !entry.completed && !closed ? "Review result" : entry?.completed || closed ? "Practise puzzle" : "Open puzzle", `data-puzzle="${esc(p.id)}" ${ui.actor.account && !entry && !closed ? 'aria-disabled="true"' : ""}`)}</article>`; }).join("")}</div>${eventResults(data)}`);
    ui.content.querySelector('[data-ar="back"]').onclick = () => events(ui);
    ui.content.querySelector('[data-ar="calendar"]').onclick = () => perform(ui, "calendar", () => downloadCalendar(ui, event.id));
    ui.content.querySelector('[data-ar="mute"]')?.addEventListener("click", () => perform(ui, "mute", async () => {
      const epoch = ui.epoch, result = await request("/arena/events/" + encodeURIComponent(event.id) + "/mute", { actor: ui.actor, signal: ui.controller.signal, body: { muted: !event.muted } });
      if (!live(ui) || ui.epoch !== epoch) return;
      if (result.eventId !== event.id || typeof result.muted !== "boolean") throw Error("The reminder preference was not confirmed.");
      event.muted = result.muted; renderEvent(ui, data); feedback(ui, result.muted ? "This weekend’s website reminder is muted. Calendar exports are managed in your calendar app." : "This weekend’s website reminder is enabled.");
    }));
    ui.content.querySelector('[data-ar="start-event"]')?.addEventListener("click", () => {
      if (!ui.actor.account) { accountPrompt(ui); return; }
      perform(ui, "start-event", async () => {
        const epoch = ui.epoch, result = await request("/arena/events/" + encodeURIComponent(event.id) + "/start", { actor: ui.actor, signal: ui.controller.signal, body: {} });
        if (!live(ui) || ui.epoch !== epoch) return;
        if (result.entry?.eventId !== event.id || !Array.isArray(result.entry?.puzzles) || !Array.isArray(result.puzzles)) throw Error("Your official run was not confirmed. Refresh this event before retrying.");
        renderEvent(ui, { ...data, ...result });
      });
    });
    ui.content.querySelectorAll("[data-puzzle]").forEach(node => { node.onclick = () => {
      if (!ui.actor.account) { accountPrompt(ui); return; }
      if (node.getAttribute("aria-disabled") === "true") { feedback(ui, event.mode === "sprint" ? "Start your official run before opening a question." : "Start your official run before opening a scored puzzle."); return; }
      puzzle(ui, data, node.dataset.puzzle, !!entry?.completed || closed);
    }; });
    math(ui.content);
  }
  async function downloadCalendar(ui, id) {
    const content = await request("/arena/events/" + encodeURIComponent(id) + "/calendar.ics", { signal: ui.controller.signal, calendar: true });
    if (!live(ui)) return;
    if (!/^BEGIN:VCALENDAR\r?\n/.test(content) || content.length > 1000000) throw Error("The calendar file could not be verified.");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "wiki-weekend-" + String(id).replace(/[^\w-]/g, "") + ".ics"; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    feedback(ui, "Calendar file downloaded. Open it in your calendar app to add the event.");
  }
  // A Quiz Sprint question: served by the server when first opened, which starts
  // its clock, then answered by choosing one of four options.
  async function sprintQuestion(ui, data, id, practice) {
    const p = data.puzzles.find(item => item.id === id); if (!p) return;
    const progress = data.entry?.puzzles?.find(item => item.id === id);
    if (!practice && !progress?.finished && !Array.isArray(p.options)) {
      const epoch = view(ui, "puzzle", '<p role="status">Opening the question…</p>');
      if (!epoch) return;
      try {
        const result = await request("/arena/events/" + encodeURIComponent(data.event.id) + "/serve", { actor: ui.actor, signal: ui.controller.signal, body: { puzzleId: id } });
        if (!live(ui) || ui.epoch !== epoch) return;
        if (result.question?.id !== id || typeof result.question.question !== "string" || !Array.isArray(result.question.options)) throw Error("The question was not confirmed. Refresh the event before continuing.");
        Object.assign(p, result.question);
        if (result.entry?.eventId === data.event.id && Array.isArray(result.entry.puzzles)) data.entry = result.entry;
      } catch (error) { loadFailure(ui, epoch, "This question", error, () => showEvent(ui, data.event.id)); return; }
    }
    const current = data.entry?.puzzles?.find(item => item.id === id);
    ui.puzzle = { id, eventId: data.event.id, source: p, practice, sprint: true, progress: current, feedback: practice ? null : current?.feedback || null, retryAt: practice ? 0 : Number(current?.retryAt || 0), attempt: null };
    renderSprint(ui);
    ui.dialog.querySelector('.ar-scroll')?.scrollTo?.({ top: 0, behavior: 'instant' });
    ui.content.querySelector('h2')?.focus({ preventScroll: true });
  }
  function renderSprint(ui) {
    const q = ui.puzzle, data = ui.eventData, p = q.source, index = data.puzzles.findIndex(item => item.id === q.id);
    const finished = !q.practice && !!q.progress?.finished, eliminated = new Set(q.practice ? [] : q.progress?.eliminated || []), solution = q.feedback?.solution;
    view(ui, "puzzle", `<div class="ar-section-head"><div><span class="ar-eyebrow">${q.practice ? "Practice · no score changes" : "Your official run"} · ${esc(p.courseName)}</span><h2 tabindex="-1">Question ${number(index + 1)} of ${number(data.puzzles.length)}</h2></div>${button("back", "Event overview")}</div>${Array.isArray(p.options) ? `<p class="ar-question">${esc(p.question)}</p><div class="ar-options">${p.options.map((option, i) => `<button type="button" class="ar-option ${eliminated.has(i) ? "is-eliminated" : ""} ${solution && solution.correctIndex === i ? "is-correct" : ""}" data-sprint-choice="${i}"><span>${String.fromCharCode(65 + i)}</span><span>${esc(option)}</span>${eliminated.has(i) ? "<small>Incorrect</small>" : ""}</button>`).join("")}</div>` : '<p class="ar-note">This question was skipped before it was opened, so it has no text to show yet.</p>'}<p class="ar-puzzle-clock" data-puzzle-clock role="status"></p><div class="ar-puzzle-feedback" role="status" aria-live="polite"></div><div class="ar-puzzle-continue"></div><div class="ar-actions">${!q.practice && !finished ? button("skip-puzzle", "Skip for 0 points") : ""}</div><p class="ar-note">${q.practice ? "Practice is unlimited and cannot alter your official score." : "A correct answer earns 6, 3 or 1 points on the first, second or third attempt, plus 4, 3, 2 or 1 more for answering within 10, 20, 30 or 45 seconds of the question appearing. A wrong answer pauses you for 5 seconds, then 10."}</p>`);
    ui.content.querySelector('[data-ar="back"]').onclick = () => showEvent(ui, data.event.id);
    ui.content.querySelectorAll("[data-sprint-choice]").forEach(node => { node.onclick = () => { if (node.getAttribute("aria-disabled") !== "true") answerSprint(ui, Number(node.dataset.sprintChoice)); }; });
    ui.content.querySelector('[data-ar="skip-puzzle"]')?.addEventListener("click", () => ask(ui, "Skip this question?", "It finishes for zero points and shows its answer. You cannot answer it again for an official score.", "Skip for 0 points", () => answerSprint(ui, null)));
    paintSprintFeedback(ui); paintPuzzleClock(ui); math(ui.content);
  }
  function paintSprintFeedback(ui) {
    const q = ui.puzzle, host = ui.content.querySelector(".ar-puzzle-feedback"), f = q.feedback;
    paintPuzzleContinue(ui); if (!host || !f) return;
    const letter = f.solution && Number.isInteger(f.solution.correctIndex) ? String.fromCharCode(65 + f.solution.correctIndex) : "";
    host.innerHTML = `<h3>${f.correct ? "Correct." : f.finished ? "An idea to take with you." : "Not this one."}</h3><p>${esc(f.message || "Your answer was checked by the server.")}</p>${letter ? `<div class="ar-solution"><strong>Answer ${letter}</strong>${f.solution.explanation ? `<p>${esc(f.solution.explanation)}</p>` : ""}</div>` : ""}`;
    math(host);
  }
  function answerSprint(ui, choice) {
    const q = ui.puzzle; if (!live(ui) || !q?.sprint || (!q.practice && (q.progress?.finished || q.retryAt > Date.now()))) return;
    perform(ui, "puzzle-submit", async () => {
      const data = ui.eventData, signature = JSON.stringify(choice);
      // The same answer retried after a lost reply keeps its attempt id.
      if (!q.attempt || q.attempt.signature !== signature) q.attempt = { signature, id: uuid() };
      paintPuzzleClock(ui);
      const epoch = ui.epoch, result = await request("/arena/events/" + encodeURIComponent(q.eventId) + (q.practice ? "/practice" : "/submit"), { actor: ui.actor, signal: ui.controller.signal, body: { puzzleId: q.id, answer: choice, ...(!q.practice ? { attemptId: q.attempt.id } : {}) } });
      if (!live(ui) || ui.epoch !== epoch || ui.puzzle !== q) return;
      if (result.feedback?.puzzleId !== q.id || typeof result.feedback.correct !== "boolean") throw Error("This answer was not confirmed. Retry the same answer safely.");
      if (!q.practice && (result.entry?.eventId !== q.eventId || !Array.isArray(result.entry.puzzles))) throw Error("Your score was not confirmed. Refresh the event before continuing.");
      q.feedback = result.feedback; q.attempt = null;
      if (!q.practice) {
        data.entry = result.entry; q.progress = result.entry.puzzles.find(x => x.id === q.id); q.retryAt = Number(result.feedback.retryAt || 0);
        if (q.progress?.finished) refreshReward(ui, result.reward, q.eventId + ':' + q.id);
      }
      feedback(ui, q.practice ? "Practice checked. Your official score is unchanged." : "Answer recorded by the server.");
      renderSprint(ui);
      const answerFeedback = ui.content.querySelector('.ar-puzzle-feedback');
      answerFeedback?.setAttribute('tabindex', '-1'); answerFeedback?.focus({ preventScroll: true });
    }).then(() => { if (live(ui) && ui.puzzle === q) paintPuzzleClock(ui); });
  }
  function puzzle(ui, data, id, practice) {
    const p = data.puzzles.find(item => item.id === id); if (!p) return;
    if (p.mode === "sprint") return sprintQuestion(ui, data, id, practice);
    const progress = data.entry?.puzzles?.find(item => item.id === id);
    const modeKnown = ["relay", "route", "match"].includes(p.mode);
    const previous = ui.puzzle?.id === id && ui.puzzle?.eventId === data.event.id && ui.puzzle?.practice === practice ? ui.puzzle : null;
    const restored = practice ? null : (previous?.feedback || progress?.feedback || null);
    const restoredAnswer = Array.isArray(restored?.answer) ? restored.answer : null;
    ui.puzzle = { id, eventId: data.event.id, source: p, practice, progress, unsupported: !modeKnown, selected: p.mode !== "match" && restoredAnswer ? restoredAnswer.slice() : p.mode === "route" ? [p.startId] : [], pairs: p.mode === "match" && restoredAnswer ? Object.fromEntries(restoredAnswer.filter(pair => Array.isArray(pair) && pair.length === 2)) : {}, feedback: restored, retryAt: practice ? 0 : Number(progress?.retryAt || 0), attempt: null };
    const q = ui.puzzle;
    view(ui, "puzzle", `<div class="ar-section-head"><div><span class="ar-eyebrow">${practice ? "Practice · no score changes" : "Your official run"} · ${esc(p.courseName)}</span><h2>${esc(p.title)}</h2></div>${button("back", "Event overview")}</div><p class="ar-prompt">${esc(p.prompt)}</p><p class="ar-note">${p.mode === "relay" ? "More than one order may be valid. Only prerequisite relationships determine correctness. Use Move up, Move down or Remove to revise your order." : p.mode === "route" ? "Build the shortest route from prerequisite to dependent. Choose the next concept; Undo removes your last step." : "Choose one dependent for each prerequisite. Each right-hand concept is used once."}</p><div class="ar-puzzle-controls"></div><p class="ar-puzzle-clock" data-puzzle-clock role="status"></p><div class="ar-puzzle-feedback" role="status" aria-live="polite"></div><div class="ar-puzzle-continue"></div><div class="ar-actions">${button("submit-puzzle", practice ? "Check practice answer" : "Submit answer")}${!practice ? button("skip-puzzle", "Skip for 0 points") : button("reset-puzzle", "Try a fresh answer")}</div><p class="ar-note">${practice ? "Practice is unlimited and cannot alter your official score." : "First try without hints: up to 20 points. After one incorrect answer, a targeted hint lowers the maximum to 12; after two, fuller hints lower it to 6. The third incorrect answer ends the puzzle for 0 points. Each retry pauses for 2 seconds."}</p>`);
    ui.content.querySelector('[data-ar="back"]').onclick = () => showEvent(ui, data.event.id);
    if (!modeKnown) { ui.content.querySelector(".ar-puzzle-controls").textContent = "This game needs a newer version of the wiki. Refresh the page to continue."; ui.content.querySelector('[data-ar="submit-puzzle"]').setAttribute("aria-disabled", "true"); return; }
    ui.content.querySelector('[data-ar="submit-puzzle"]').onclick = () => submitPuzzle(ui, false);
    ui.content.querySelector('[data-ar="skip-puzzle"]')?.addEventListener("click", () => ask(ui, "Skip this official puzzle?", "This puzzle will finish for zero points and reveal its solution. You cannot retry it for an official score.", "Skip for 0 points", () => submitPuzzle(ui, true)));
    ui.content.querySelector('[data-ar="reset-puzzle"]')?.addEventListener("click", () => puzzle(ui, data, id, true));
    paintPuzzle(ui); paintPuzzleFeedback(ui); paintPuzzleClock(ui); math(ui.content);
    ui.dialog.querySelector('.ar-scroll')?.scrollTo?.({ top: 0, behavior: 'instant' });
    const heading = ui.content.querySelector('h2'); heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true });
  }
  function paintPuzzle(ui) {
    const q = ui.puzzle, p = q.source, host = ui.content.querySelector(".ar-puzzle-controls"); if (!host) return;
    const title = id => (p.nodes || p.cards || []).find(n => n.id === id)?.title || (p.cards || []).find(n => n.id === id)?.title || id;
    if (p.mode === "match") {
      host.innerHTML = `<div class="ar-pairs">${(p.left || []).map((left, i) => `<fieldset><legend>${i + 1}. ${conceptTitle(left.title)}</legend><div class="ar-pair-options">${(p.right || []).map(right => `<label><input type="radio" name="ar-pair-${serial}-${i}" data-left="${esc(left.id)}" value="${esc(right.id)}" aria-label="${conceptLabel(right.title)}" ${q.pairs[left.id] === right.id ? "checked" : ""}>${conceptTitle(right.title)}</label>`).join("")}</div></fieldset>`).join("")}</div>`;
      host.querySelectorAll("[data-left]").forEach(input => { input.onchange = () => { if (!live(ui) || ui.puzzle !== q || ui.busy.has('puzzle-submit') || (!q.practice && q.progress?.finished)) return; q.pairs[input.dataset.left] = input.value; q.attempt = null; }; });
    } else {
      host.innerHTML = `<div class="ar-sequence" aria-label="Your proposed ${p.mode === "route" ? "path" : "order"}">${q.selected.length ? q.selected.map((id, i) => `<article><span>${i + 1}</span><strong>${conceptTitle(title(id))}</strong>${p.mode === "relay" ? `<div class="ar-sequence-actions">${button("move-up", "↑", `data-index="${i}" aria-label="Move ${esc(title(id))} up" ${i === 0 ? 'aria-disabled="true"' : ""}`)}${button("move-down", "↓", `data-index="${i}" aria-label="Move ${esc(title(id))} down" ${i === q.selected.length - 1 ? 'aria-disabled="true"' : ""}`)}${button("remove-card", "×", `data-index="${i}" aria-label="Remove ${esc(title(id))}"`)}</div>` : ""}</article>`).join("") : '<p>Choose the first card below.</p>'}</div>${p.mode === "route" ? `<p>Target: <strong>${conceptTitle(title(p.targetId))}</strong> · maximum ${number(p.maxHops)} steps</p>${button("undo-card", "Undo last step", q.selected.length < 2 ? 'aria-disabled="true"' : "")}` : ""}<div class="ar-cards" aria-label="Available concepts">${(p.cards || p.nodes || []).filter(n => !q.selected.includes(n.id)).map(n => `<button type="button" class="ar-card" data-card="${esc(n.id)}" aria-label="${conceptLabel(n.title)}">${conceptTitle(n.title)}</button>`).join("")}</div>`;
      const revise = action => {
        const focused = document.activeElement, ownedFocus = host.contains(focused), index = Number(focused?.dataset?.index), kind = focused?.dataset?.ar;
        if (!live(ui) || ui.puzzle !== q || ui.busy.has('puzzle-submit') || (!q.practice && q.progress?.finished)) return;
        action(); q.attempt = null; paintPuzzle(ui); math(host);
        if (ownedFocus) {
          const nextIndex = kind === "move-up" ? index - 1 : kind === "move-down" ? index + 1 : index;
          const next = kind && Number.isInteger(index) ? host.querySelector('[data-ar="' + kind + '"][data-index="' + Math.min(nextIndex, q.selected.length - 1) + '"]') : kind === "undo-card" ? host.querySelector('[data-ar="undo-card"]') : null;
          (next || host.querySelector("[data-card]") || ui.content.querySelector('[data-ar="submit-puzzle"]'))?.focus({ preventScroll: true });
        }
      };
      host.querySelectorAll("[data-card]").forEach(node => { node.onclick = () => { if (p.mode === "route" && q.selected.length > Number(p.maxHops)) { feedback(ui, "Undo a step before extending this route."); return; } revise(() => q.selected.push(node.dataset.card)); }; });
      host.querySelectorAll("[data-index]").forEach(node => { node.onclick = () => {
        if (node.getAttribute("aria-disabled") === "true") return;
        const i = Number(node.dataset.index); revise(() => { if (node.dataset.ar === "remove-card") q.selected.splice(i, 1); else { const j = i + (node.dataset.ar === "move-up" ? -1 : 1); [q.selected[i], q.selected[j]] = [q.selected[j], q.selected[i]]; } });
      }; });
      host.querySelector('[data-ar="undo-card"]')?.addEventListener("click", () => { if (q.selected.length > 1) revise(() => q.selected.pop()); });
    }
  }
  function paintPuzzleClock(ui) {
    const q = ui.puzzle; if (!q) return;
    if (q.sprint) {
      const finished = !q.practice && !!q.progress?.finished, remaining = Math.max(0, q.retryAt - Date.now()), servedAt = Number(q.progress?.servedAt || 0);
      const clock = ui.content.querySelector("[data-puzzle-clock]");
      if (clock) clock.textContent = q.practice ? (q.feedback ? "Practice answer checked." : "Practice answer ready when you are.") : finished ? "Question complete · " + number(q.progress.points) + " points." : remaining ? "You can try again in " + Math.ceil(remaining / 1000) + "s." : servedAt ? "Time " + seconds(Date.now() - servedAt) + " · " + number(q.progress?.attempts) + " of 3 attempts used." : "";
      ui.content.querySelectorAll("[data-sprint-choice]").forEach(node => node.setAttribute("aria-disabled", String(finished || remaining > 0 || ui.busy.has("puzzle-submit") || (!q.practice && (q.progress?.eliminated || []).includes(Number(node.dataset.sprintChoice))))));
      ui.content.querySelector('[data-ar="skip-puzzle"]')?.setAttribute("aria-disabled", String(finished || ui.busy.has("puzzle-submit")));
      return;
    }
    const remaining = Math.max(0, q.retryAt - Date.now()), finished = !q.practice && !!q.progress?.finished;
    const clock = ui.content.querySelector("[data-puzzle-clock]");
    if (clock) clock.textContent = remaining ? "You can try again in " + Math.ceil(remaining / 1000) + "s." : finished ? "Official puzzle complete · " + number(q.progress.points) + " points." : q.practice ? "Practice answer ready when you are." : number(q.progress?.attempts) + " of 3 attempts used · next answer up to " + number(q.progress?.maxPoints ?? [20, 12, 6][Math.min(2, Number(q.progress?.attempts) || 0)]) + " points" + (Number(q.progress?.attempts) ? " (with hints)." : " (without hints).");
    for (const action of ["submit-puzzle", "skip-puzzle"]) ui.content.querySelector('[data-ar="' + action + '"]')?.setAttribute("aria-disabled", String(remaining > 0 || finished || q.unsupported || ui.busy.has("puzzle-submit")));
    ui.content.querySelectorAll('.ar-puzzle-controls button, .ar-puzzle-controls input').forEach(node => { node.disabled = finished || ui.busy.has('puzzle-submit'); });
  }
  function paintPuzzleContinue(ui) {
    const q = ui.puzzle, data = ui.eventData, host = ui.content.querySelector('.ar-puzzle-continue');
    if (!host || !q || !data) return;
    const done = q.practice ? !!q.feedback : !!q.progress?.finished;
    host.innerHTML = '';
    if (!done) return;
    const index = data.puzzles.findIndex(item => item.id === q.id);
    const ordered = [...data.puzzles.slice(index + 1), ...data.puzzles.slice(0, index)];
    const next = q.practice ? ordered[0] : ordered.find(item => !data.entry?.puzzles?.find(result => result.id === item.id)?.finished);
    host.innerHTML = `<div class="ar-actions">${button('continue-puzzle', next ? (q.practice ? 'Next practice puzzle' : 'Next puzzle') : 'View event results')}</div>`;
    host.querySelector('[data-ar="continue-puzzle"]').onclick = () => {
      if (!live(ui) || ui.puzzle !== q || ui.busy.has('puzzle-submit')) return;
      if (next) {
        puzzle(ui, data, next.id, q.practice || ['closed', 'finalized'].includes(data.event.status));
      } else showEvent(ui, data.event.id);
    };
  }
  function puzzleHintHtml(hints, title) {
    if (!hints || !Array.isArray(hints.conflicts) || !Array.isArray(hints.confirmed)) return '';
    const pair = row => `${conceptTitle(title(row.before))} → ${conceptTitle(title(row.after))}`;
    return `<div class="ar-puzzle-hints"><h4>Hint ${number(hints.level)}</h4><p>${esc(hints.message || '')}</p>${hints.conflicts.length ? `<p><strong>${hints.kind === 'relay' ? 'Needs to come earlier → depends on it' : 'Reconsider these links'}</strong></p><ul>${hints.conflicts.map(row=>`<li>${pair(row)}</li>`).join('')}</ul>` : ''}${hints.confirmed.length ? `<p><strong>These relationships already work in your submitted answer</strong></p><ul>${hints.confirmed.map(row=>`<li>${pair(row)}</li>`).join('')}</ul>` : ''}<p class="ar-note">Hints describe your last submitted answer. ${hints.kind === 'relay' ? 'A confirmed relationship does not fix either card to one exact position.' : 'Check your revised answer when ready.'}</p></div>`;
  }
  function paintPuzzleFeedback(ui) {
    const q = ui.puzzle, host = ui.content.querySelector(".ar-puzzle-feedback"), f = q.feedback;
    paintPuzzleContinue(ui); if (!host || !f) return;
    const all = [...(q.source.nodes || []), ...(q.source.cards || []), ...(q.source.left || []), ...(q.source.right || [])];
    const title = id => all.find(n => n.id === id)?.title || String(id);
    host.innerHTML = `<h3>${f.correct ? "A connection found." : f.finished ? "An idea to take with you." : "Try another connection."}</h3><p>${conceptTitle(f.message || "Your answer was checked by the server.")}</p>${puzzleHintHtml(f.hints, title)}${!q.practice && !f.finished && Number.isFinite(f.maxPoints) ? `<p><strong>Next correct answer: up to ${number(f.maxPoints)} points.</strong></p>` : ""}${Array.isArray(f.solution) ? `<div class="ar-solution"><strong>One valid solution</strong>${q.source.mode === "relay" ? "<p>This is an example, not a unique ordering. Unrelated cards can trade places.</p>" : ""}<ol>${f.solution.map(part => `<li>${Array.isArray(part) ? part.map(id => conceptTitle(title(id))).join(" → ") : conceptTitle(title(part))}</li>`).join("")}</ol></div>` : ""}`;
    math(host);
  }
  function submitPuzzle(ui, skip) {
    const q = ui.puzzle; if (!live(ui) || !q || q.unsupported || q.retryAt > Date.now() || (!q.practice && q.progress?.finished)) return;
    perform(ui, "puzzle-submit", async () => {
      const p = q.source, data = ui.eventData;
      let answer = skip ? null : p.mode === "match" ? (p.left || []).map(n => [n.id, q.pairs[n.id] || ""]) : q.selected.slice();
      if (!skip && p.mode === "relay" && answer.length !== (p.cards || []).length) throw Error("Include every card once before submitting.");
      if (!skip && p.mode === "route" && (answer.length < 2 || answer.at(-1) !== p.targetId)) throw Error("Complete a route from the start to the target before submitting.");
      if (!skip && p.mode === "match" && (answer.some(pair => !pair[1]) || new Set(answer.map(pair => pair[1])).size !== answer.length)) throw Error("Choose a different dependent for every prerequisite.");
      const signature = JSON.stringify(answer);
      if (!q.attempt || q.attempt.signature !== signature) q.attempt = { signature, id: uuid() };
      paintPuzzleClock(ui);
      const epoch = ui.epoch, result = await request("/arena/events/" + encodeURIComponent(q.eventId) + (q.practice ? "/practice" : "/submit"), { actor: ui.actor, signal: ui.controller.signal, body: { puzzleId: q.id, answer, ...(!q.practice ? { attemptId: q.attempt.id } : {}) } });
      if (!live(ui) || ui.epoch !== epoch || ui.puzzle !== q) return;
      if (result.feedback?.puzzleId !== q.id || typeof result.feedback.correct !== "boolean") throw Error("This answer was not confirmed. Retry the same answer safely.");
      if (!q.practice && (result.entry?.eventId !== q.eventId || !Array.isArray(result.entry.puzzles) || !result.entry.puzzles.some(item => item.id === q.id) || Number(result.entry.revision) < Number(data.entry?.revision || 0))) throw Error("Your score was not confirmed. Refresh the event before continuing.");
      q.feedback = result.feedback; q.retryAt = Number(result.feedback.retryAt || 0); q.attempt = null;
      if (!q.practice) { data.entry = result.entry; q.progress = result.entry.puzzles.find(x => x.id === q.id); }
      if (!q.practice && q.progress?.finished) refreshReward(ui, result.reward, q.eventId + ':' + q.id);
      feedback(ui, q.practice ? "Practice checked. Your official score is unchanged." : "Answer recorded by the server."); paintPuzzleFeedback(ui);
      const answerFeedback = ui.content.querySelector('.ar-puzzle-feedback');
      answerFeedback?.setAttribute('tabindex', '-1');
      answerFeedback?.focus({ preventScroll: true });
      answerFeedback?.scrollIntoView?.({ block: 'nearest', behavior: 'instant' });
    }).then(() => { if (live(ui) && ui.puzzle === q) paintPuzzleClock(ui); });
  }
  function open() { const ui = create(); if (ui) hub(ui); return ui?.dialog; }
  function openGhost(id) {
    const ui = create(); if (!ui) return null;
    if (!/^[a-f0-9-]{36}$/.test(String(id || ""))) { hub(ui); return ui.dialog; }
    showGhost(ui, String(id)); return ui.dialog;
  }
  function seenKey(actor, eventId) { return "mk_arena_weekend_seen_v1:" + encodeURIComponent(actor.account) + ":" + encodeURIComponent(eventId); }
  function dismissReminder() { reminderNode?.remove(); reminderNode = null; }
  function hasVisibleStudyOverlay() {
    return Array.from(document.querySelectorAll('dialog[open], [role="dialog"][aria-modal="true"], #aiq-modal, .ai-quiz-modal, .mk-local-activity-modal')).some(node => {
      if (!node.isConnected || !node.getClientRects().length) return false;
      // Some learning tools keep their ARIA dialog markup after closing. Check
      // ancestors too, including native dialogs that no longer have `open`.
      for (let parent = node; parent; parent = parent.parentElement) {
        if (parent.hidden || parent.tagName === "DIALOG" && !parent.open) return false;
        const style = window.getComputedStyle(parent);
        if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse") return false;
      }
      return true;
    });
  }
  function busyStudying() {
    const active = document.activeElement;
    return document.hidden || !!current || hasVisibleStudyOverlay()
      || !!(active && (/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName) || active.isContentEditable));
  }
  function invitationKey(actor, c) { return "mk_arena_invitation_seen_v1:" + encodeURIComponent(actor.account) + ":" + encodeURIComponent(c.id) + ":" + c.revision; }
  function hasSeenInvitation(actor, c) { const id = invitationKey(actor, c); if (invitationSeen.has(id)) return true; try { return !!localStorage.getItem(id); } catch (_) { return false; } }
  function markInvitation(actor, c) { const id = invitationKey(actor, c); invitationSeen.add(id); try { localStorage.setItem(id, "1"); } catch (_) {} }
  function clearIncoming() { incomingNode?.remove(); incomingNode = null; }
  function presentInvitation() {
    clearTimeout(pendingTimer);
    const inbox = background; if (!inbox || !same(inbox.actor)) return;
    const pending = Array.from(pendingInvitations.values()).find(c => !hasSeenInvitation(inbox.actor, c));
    if (!pending) { clearIncoming(); return; }
    if (incomingNode && incomingNode.dataset.invitation !== pending.id + ":" + pending.revision) clearIncoming();
    const show = () => {
      if (!same(inbox.actor)) return;
      const latest = pendingInvitations.get(pending.id);
      if (!latest || latest.revision !== pending.revision) { clearIncoming(); presentInvitation(); return; }
      clearIncoming(); dismissReminder();
      const ui = create(); if (ui) renderChallenge(ui, pending);
    };
    // Inbox state is shared across devices; opening a modal is this device's
    // explicit intent. Receiving, reconnecting or logging in only shows a card.
    if (!incomingNode && !document.hidden) {
      const node = document.createElement("aside"); node.className = "ar-incoming"; node.setAttribute("aria-label", "Pending challenge");
      node.dataset.invitation = pending.id + ":" + pending.revision;
      node.innerHTML = `<span class="ar-eyebrow">A table has your name on it</span><strong>New challenge invitation</strong><p>${esc(pending.participants.find(p => key(p.accountKey) !== inbox.actor.account)?.name || "Another learner")} invited you. Review it when you are ready.</p><div class="ar-actions">${button("review-invitation", "Review invitation")}${button("later-invitation", "Later")}</div>`;
      document.body.appendChild(node); incomingNode = node;
      node.querySelector('[data-ar="review-invitation"]').onclick = show;
      node.querySelector('[data-ar="later-invitation"]').onclick = () => { markInvitation(inbox.actor, pending); clearIncoming(); presentInvitation(); };
    }
    pendingTimer = setTimeout(presentInvitation, 3000);
  }
  function stopBackground() {
    clearTimeout(backgroundTimer); clearTimeout(pendingTimer); clearIncoming(); pendingInvitations.clear();
    const inbox = background; background = null; if (!inbox) return;
    inbox.stopped = true; inbox.controller.abort(); clearTimeout(inbox.retry); clearTimeout(inbox.refreshTimer); clearInterval(inbox.ping);
    try { inbox.socket?.close(); } catch (_) {}
  }
  function startBackground() {
    clearTimeout(backgroundTimer);
    const actor = context();
    if (!enabled() || !actor.account || !actor.visitor) { stopBackground(); return; }
    if (background && same(background.actor)) return;
    stopBackground();
    const inbox = { actor, controller: new AbortController(), socket: null, attempts: 0, stopped: false, reading: false, queued: false }; background = inbox;
    const valid = () => background === inbox && !inbox.stopped && same(actor);
    const refresh = async matchId => {
      if (!valid()) return;
      if (inbox.reading) { inbox.queued = true; return; }
      inbox.reading = true;
      try {
        const data = await request("/arena/me", { actor, signal: inbox.controller.signal });
        if (!valid()) return;
        if (key(data.me?.accountKey) !== actor.account || !Array.isArray(data.challenges)) throw Error("The connected account changed.");
        pendingInvitations.clear();
        for (const c of data.challenges) {
          const you = c.participants?.findIndex(p => key(p.accountKey) === actor.account);
          if (challengeValid(c, { actor }) && c.status === "pending" && c.recipient === you) pendingInvitations.set(c.id, c);
        }
        if (current && live(current)) {
          if (current.view === "duels") {
            // Hub refreshes do not replace typed offer forms or a live match.
            hub(current);
          } else if (current.view === "challenge" && current.challenge) {
            // Reconnection and coalesced refreshes may carry no matchId. The
            // current server list, not the notification hint, owns the terms.
            const latest = data.challenges.find(c => c.id === current.challenge.id);
            if (latest && (latest.revision !== current.challenge.revision || latest.status !== current.challenge.status)) {
              if (["accepted", "playing", "finished", "void"].includes(latest.status)) showChallenge(current, latest.id);
              else renderChallenge(current, latest);
            } else if (!latest && matchId === current.challenge.id) showChallenge(current, matchId);
          } else if (current.view === "ghost" && current.ghost && !current.busy.size) {
            const latest = (Array.isArray(data.ghosts) ? data.ghosts : []).find(g => g.id === current.ghost.id);
            if (latest && (latest.revision !== current.ghost.revision || latest.status !== current.ghost.status || String(latest.progress) !== String(current.ghost.progress) || String(latest.finished) !== String(current.ghost.finished))) reloadGhost(current, current.ghost.id);
          }
        }
        presentInvitation();
      } catch (_) { /* Offline invitations remain in D1; reconnect refresh retries. */ }
      finally { inbox.reading = false; if (inbox.queued && valid()) { inbox.queued = false; inbox.refreshTimer = setTimeout(refresh, 250); } }
    };
    const retry = () => {
      if (!valid()) return;
      clearInterval(inbox.ping); inbox.socket = null;
      clearTimeout(inbox.retry); inbox.retry = setTimeout(connectInbox, Math.min(30000, 1000 * (2 ** Math.min(inbox.attempts++, 5))));
    };
    const connectInbox = async () => {
      if (!valid()) return;
      try {
        const ticket = await request("/arena/socket-ticket", { actor, signal: inbox.controller.signal, body: { channel: "inbox" } });
        if (!valid()) return;
        const url = new URL(ticket.url);
        if (!["ws:", "wss:"].includes(url.protocol) || url.host !== new URL(base).host || Number(ticket.expiresAt) <= Date.now()) throw Error("Invalid connection ticket.");
        const socket = new WebSocket(url.href); inbox.socket = socket;
        socket.onopen = () => { if (!valid()) { socket.close(); return; } inbox.attempts = 0; refresh(); inbox.ping = setInterval(() => { if (valid() && socket.readyState === 1) socket.send(JSON.stringify({ type: "ping", nonce: uuid() })); }, 20000); };
        socket.onmessage = event => { if (!valid() || inbox.socket !== socket) return; let message; try { message = JSON.parse(event.data); } catch (_) { return; } if (message.type === "refresh") refresh(message.matchId); };
        socket.onerror = () => {};
        socket.onclose = retry;
      } catch (_) { if (valid()) retry(); }
    };
    connectInbox();
  }
  async function remind() {
    clearTimeout(reminderTimer);
    if (!enabled() || busyStudying()) { reminderTimer = setTimeout(remind, 60000); return; }
    const actor = context(); if (!actor.account || reminderRequest || reminderNode) return;
    const controller = new AbortController(); reminderRequest = controller;
    try {
      const data = await request("/arena/events", { actor, signal: controller.signal });
      if (!same(actor)) return;
      if (busyStudying()) { reminderTimer = setTimeout(remind, 60000); return; }
      const event = Array.isArray(data.events) && data.events.find(e => e.status === "active" && eventAvailable(e) && !e.muted);
      if (!event) return;
      try { if (localStorage.getItem(seenKey(actor, event.id))) return; } catch (_) {}
      const node = document.createElement("aside"); node.className = "ar-reminder"; node.setAttribute("aria-label", "Weekend event");
      node.innerHTML = `<span class="ar-eyebrow">${event.curriculum ? "Your course quiz this weekend" : "A little weekend adventure"}</span><strong>${esc(event.title)}</strong><p>${esc(event.description)}</p><div class="ar-actions">${button("explore", "Explore the event")}${button("dismiss", "Not now")}${button("mute", "Mute this weekend")}</div><p class="ar-reminder-status" role="status"></p>`;
      document.body.appendChild(node); reminderNode = node;
      try { localStorage.setItem(seenKey(actor, event.id), "1"); } catch (_) {}
      node.querySelector('[data-ar="dismiss"]').onclick = dismissReminder;
      node.querySelector('[data-ar="explore"]').onclick = () => { dismissReminder(); const ui = create(); if (ui) showEvent(ui, event.id); };
      node.querySelector('[data-ar="mute"]').onclick = async () => {
        const control = node.querySelector('[data-ar="mute"]'); if (control.getAttribute("aria-busy") === "true") return;
        control.setAttribute("aria-busy", "true");
        try {
          const result = await request("/arena/events/" + encodeURIComponent(event.id) + "/mute", { actor, signal: controller.signal, body: { muted: true } });
          if (same(actor) && node.isConnected) { if (result.eventId !== event.id || result.muted !== true) throw Error("Reminder preference was not confirmed."); dismissReminder(); }
        } catch (_) { if (same(actor) && node.isConnected) { node.querySelector(".ar-reminder-status").textContent = "Could not mute this weekend. Please try again."; control.removeAttribute("aria-busy"); } }
      };
    } catch (_) { /* A background reminder failure must never interrupt studying. */ }
    finally { if (reminderRequest === controller) reminderRequest = null; }
  }
  function reset() {
    if (current && !same(current.actor)) close();
    for (const mount of Array.from(mounts)) if (!same(mount.actor)) mount.dispose();
    if (background && !same(background.actor)) stopBackground();
    reminderRequest?.abort(); reminderRequest = null; dismissReminder(); clearTimeout(reminderTimer);
    if (enabled()) { reminderTimer = setTimeout(remind, 45000); backgroundTimer = setTimeout(startBackground, 1200); }
  }
  ["mk-account-workspace-changed", "mk-account-login-change", "storage", "mk-startup-prefs-change"].forEach(event => window.addEventListener(event, reset));
  window.addEventListener("pagehide", () => { close(); reset(); clearTimeout(reminderTimer); stopBackground(); });
  window.addEventListener("pageshow", reset);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { startBackground(); presentInvitation(); } });
  if (window.document$?.subscribe) {
    let route = window.location.pathname;
    window.document$.subscribe(() => { if (window.location.pathname !== route) { route = window.location.pathname; close(); dismissReminder(); } });
  }
  if (typeof MutationObserver === "function") {
    const observer = new MutationObserver(() => { if (!enabled()) reset(); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mk-startup-account", "class"] });
  }
  window.MkArena = { open, openGhost, challenge, close, mountProfile: (host, payload) => mountRecord(host, payload, false), mountCollection: host => mountRecord(host, null, true) };
  window.dispatchEvent(new CustomEvent("mk-arena-ready"));
  reminderTimer = setTimeout(remind, 45000);
  backgroundTimer = setTimeout(startBackground, 1200);
})();
