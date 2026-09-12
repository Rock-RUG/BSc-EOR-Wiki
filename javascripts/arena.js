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
  const date = (value, zone) => Number(value) ? new Date(Number(value)).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", hourCycle: "h23", ...(zone ? { timeZone: zone } : {}) }) : "Now · when both players are ready";
  const timezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const math = host => window.MkEC?.typesetActivityMath?.(host);
  const button = (action, text, extra = "") => `<button type="button" class="ar-button" data-ar="${action}" ${extra}>${text}</button>`;
  const emblem = () => '<span class="ar-emblem" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="m32 4 23 13v29L32 60 9 46V17Z"/><path d="M22 16h20v11c0 13-20 13-20 0Zm0 5h-8v5c0 6 5 10 10 10m18-15h8v5c0 6-5 10-10 10M32 38v10m-9 0h18"/></svg></span>';
  let current = null, serial = 0, reminderTimer = 0, reminderRequest = null, reminderNode = null;
  const mounts = new Set();
  let background = null, backgroundTimer = 0, pendingTimer = 0, incomingNode = null;
  const pendingInvitations = new Map(), invitationSeen = new Set();

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
        throw Error(data?.error || "Arena is temporarily unavailable. Try again.");
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
    current = null; ui.controller.abort(); clearInterval(ui.clock); disposeSocket(ui, "inbox"); disposeSocket(ui, "match");
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
  function requestClose(ui) {
    if (ui.state?.status === "playing") ask(ui, "Leave the live table?", "Closing disconnects you. Rejoin from Arena within 90 seconds to keep playing; otherwise the server may record a loss. Use Forfeit to end the match immediately.", "Close for now", close);
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
    if (ui.state?.status === "playing" && ui.view === "match") {
      ask(ui, "Keep your live match open?", "The other player is waiting. You can review the event hub after the match, or forfeit from the table.", "Return to match", () => {}); return;
    }
    action();
  }
  function view(ui, name, html) {
    if (!live(ui)) return 0;
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
    ui.me = data; return data;
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
    const epoch = view(ui, "duels", `<section class="ar-hero">${emblem()}<div><span class="ar-eyebrow">Same questions. Shared discoveries.</span><h2>Meet at the learning table.</h2><p>Choose a course, agree on the time, and take on the same quiz together. The first correct answer wins each round.</p></div></section><div class="ar-section-head"><h2>Your challenges</h2>${button("refresh", "Refresh")}</div><div data-challenges><p>Loading challenges…</p></div>${rules()}`);
    if (!epoch) return;
    ui.content.querySelector('[data-ar="refresh"]').onclick = () => hub(ui);
    if (!ui.actor.account) { accountPrompt(ui); return; }
    try {
      const data = await loadMe(ui); if (!live(ui) || ui.epoch !== epoch || !data) return;
      const host = ui.content.querySelector("[data-challenges]");
      host.innerHTML = data.challenges.length ? data.challenges.map(c => `<button type="button" class="ar-invite" data-challenge="${esc(c.id)}"><span class="ar-chip">${esc(c.status)}</span><strong>${esc(c.participants?.find(p => key(p.accountKey) !== ui.actor.account)?.name || "Another learner")}</strong><span>${terms(c)}</span><span class="ar-arrow" aria-hidden="true">↗</span></button>`).join("") : '<div class="ar-empty"><h3>Your next opponent is one profile away.</h3><p>Open another learner’s public profile and choose Challenge. Invitations and replies appear here.</p></div>';
      host.querySelectorAll("[data-challenge]").forEach(node => { node.onclick = () => showChallenge(ui, node.dataset.challenge); });
      connect(ui, "inbox"); math(host);
    } catch (error) { loadFailure(ui, epoch, "Your challenges", error, () => hub(ui), "[data-challenges]"); }
  }
  function rules() { return '<details class="ar-rules"><summary>How a duel works</summary><p>Agree on 10–50 questions and start now or schedule up to four weeks ahead. Both players must be online and Ready. There is one three-second countdown before the first question. An accepted table expires without a loss if both players are not ready within ten minutes of the agreed time (or acceptance for an immediate match).</p><p>Each question starts with zero mistakes for each player. Your first wrong answer pauses you for 5 seconds, your second for 10 seconds, and your third gives that question’s point to your opponent. Wrong options are crossed out for both players; an already eliminated choice has no extra penalty. The first correct answer earns one point.</p><p>Review the explanation, then both choose Next question. After the final question, the higher total wins; equal totals are a draw. The server decides answer order and scores. A dropped connection has a 90-second grace period; cancelling before play is not a loss. Ten minutes without a valid answer or Next action abandons an active match without a rated result; this is not a per-question time limit.</p><p>Friendly learning play, using the wiki’s public question bank. No XP or EORbits are awarded or spent.</p></details>'; }
  async function challenge(target) {
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
      ui.config = config; offer(ui, opponent); return { ok: true };
    } catch (error) { loadFailure(ui, epoch, "The challenge", error, () => challenge(opponent)); return { ok: false, error: error.message }; }
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
  function offer(ui, opponent, previous = null) {
    const courses = (ui.config?.courses || []).filter(c => Number(c.questionCount) >= 10);
    view(ui, "offer", `<div class="ar-section-head"><div><span class="ar-eyebrow">${previous ? "Make a counteroffer" : "Invite a fellow learner"}</span><h2>${esc(opponent.name)}</h2></div>${button("back", "Back")}</div><form class="ar-form"><label>Course<select name="course" required>${courses.map(c => `<option value="${esc(c.id)}" ${previous?.courseId === c.id ? "selected" : ""}>${esc(c.title)} · ${number(c.questionCount)} questions available</option>`).join("")}</select></label><label>Number of questions<input name="count" type="number" min="10" max="50" step="1" value="${previous?.questionCount || 10}" required></label><label>When<select name="when"><option value="now">Now, when we are both ready</option><option value="later" ${previous?.startAt ? "selected" : ""}>Schedule a time</option></select></label><label data-schedule ${previous?.startAt ? "" : "hidden"}>Your local start time · ${esc(timezone())}<input name="start" type="datetime-local" value="${previous?.startAt ? localDateInput(previous.startAt) : ""}"></label><p class="ar-note">Your opponent can accept, decline or suggest different terms. Nothing starts until both players are ready.</p><div class="ar-actions">${button("send-offer", previous ? "Send counteroffer" : "Send invitation", courses.length ? "" : 'aria-disabled="true"')}</div></form>${rules()}`);
    const form = ui.content.querySelector("form"), field = name => form.querySelector('[name="' + name + '"]');
    form.onsubmit = event => { event.preventDefault(); ui.content.querySelector('[data-ar="send-offer"]').click(); };
    field("when").onchange = () => { form.querySelector("[data-schedule]").hidden = field("when").value !== "later"; };
    ui.content.querySelector('[data-ar="back"]').onclick = () => previous ? showChallenge(ui, previous.id) : hub(ui);
    ui.content.querySelector('[data-ar="send-offer"]').onclick = () => perform(ui, "send-offer", async () => {
      const course = courses.find(c => c.id === field("course").value), count = Number(field("count").value), later = field("when").value === "later", startAt = later ? scheduledLocalTime(field("start").value) : null;
      if (!course || !Number.isInteger(count) || count < 10 || count > Math.min(50, Number(course.questionCount))) throw Error("Choose a course and 10–50 available questions.");
      if (later && (!Number.isFinite(startAt) || startAt <= Date.now() || startAt > Date.now() + 28 * 86400000)) throw Error("Choose a future time within four weeks.");
      const epoch = ui.epoch;
      const data = await request(previous ? "/arena/challenges/" + encodeURIComponent(previous.id) + "/respond" : "/arena/challenges", { actor: ui.actor, signal: ui.controller.signal, body: { opponent: opponent.accountKey, courseId: course.id, questionCount: count, startAt, timeZone: timezone(), ...(previous ? { revision: previous.revision, action: "counter" } : {}) } });
      if (!live(ui) || ui.epoch !== epoch) return;
      if (!challengeValid(data.challenge, ui)) throw Error("The invitation was not confirmed. Refresh your challenges before retrying.");
      renderChallenge(ui, data.challenge); feedback(ui, previous ? "Counteroffer sent. Waiting for the other player." : "Invitation sent. Waiting for the other player."); connect(ui, "inbox");
    });
    if (!courses.length) feedback(ui, "No course currently has ten eligible questions. Try again later.", true);
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
    if (["accepted", "playing", "finished"].includes(value.status)) { view(ui, "match", "<p>Connecting to the shared table…</p>"); if (state) acceptState(ui, state); else if (value.result) renderResult(ui, value.result); connect(ui, "match", value.id); return; }
    ui.state = null; disposeSocket(ui, "match");
    view(ui, "challenge", `<div class="ar-section-head"><h2>${esc(value.participants[1 - you].name)}</h2><span class="ar-chip">${esc(value.status)}</span></div><section class="ar-terms"><h3>Agreed course & time</h3><p>${terms(value)}</p>${value.cancelReason ? `<p>${esc(value.cancelReason)}</p>` : ""}<p>Proposal ${number(value.revision)} · expires ${esc(date(value.expiresAt))}</p></section><div class="ar-actions">${value.status === "pending" ? value.recipient === you ? button("accept", "Accept invitation") + button("counter", "Suggest different terms") + button("decline", "Decline") : button("cancel", "Cancel invitation") : ""}${button("back", "All challenges")}</div>${rules()}`);
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
          else if (message.type === "error") { ui.pendingAnswer = null; feedback(ui, message.error || "The server could not accept that action.", true); tick(ui); }
          else if (message.type === "pong" && Number.isFinite(message.serverNow)) ui.serverOffset = message.serverNow - Date.now();
          else if (message.type === "refresh" && channel === "inbox") {
            if (ui.view === "duels") hub(ui);
            else if (ui.view === "challenge" && ui.challenge?.id === message.matchId) showChallenge(ui, message.matchId);
            else if (message.matchId && ui.view !== "match") feedback(ui, "A challenge has an update. Open Duels to see the latest reply.");
          }
        };
        socket.onerror = () => { label("Connection interrupted. Reconnecting…"); };
        socket.onclose = retry;
      } catch (error) { if (valid()) { label(error.message || "Connection unavailable."); retry(); } }
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
  }
  function send(ui, type, payload = {}) {
    if (!live(ui) || ui.match?.socket?.readyState !== 1) { feedback(ui, "Reconnecting. Wait for the live connection before playing.", true); return false; }
    try { ui.match.socket.send(JSON.stringify({ type, commandId: uuid(), ...payload })); return true; }
    catch (_) { feedback(ui, "The connection changed. Reconnect before trying that action again.", true); return false; }
  }
  function renderResult(ui, result) {
    const you = ui.state?.you ?? ui.challenge.participants.findIndex(p => key(p.accountKey) === ui.actor.account);
    const title = result.winner == null ? "A well-matched draw." : result.winner === you ? "A round of applause. You won!" : "A good match. A new discovery.";
    const reason = { score: "All rounds completed.", forfeit: "The match ended with a forfeit.", disconnect: "The connection grace period ended." }[result.reason] || "The server has confirmed the result.";
    return `<section class="ar-result">${emblem()}<span class="ar-eyebrow">Match complete</span><h2>${esc(title)}</h2><p class="ar-final-score">${number(result.scores?.[you])} <span>:</span> ${number(result.scores?.[1 - you])}</p><p>${reason}</p></section>`;
  }
  function renderMatch(ui) {
    const state = ui.state; if (!live(ui) || !state) return;
    const focused = document.activeElement, focusInside = ui.content.contains(focused), focusedAction = focused?.dataset?.ar, focusedChoice = focused?.dataset?.choice;
    const you = state.you, other = 1 - you, round = state.round;
    ui.view = "match";
    ui.content.innerHTML = `<div class="ar-scoreboard">${[you, other].map((p, i) => `<div class="ar-player ${i ? "" : "is-you"}"><span class="ar-eyebrow">${i ? "Opponent" : "You"} · ${state.online?.[p] ? "online" : "offline"}</span><strong>${esc(state.participants[p]?.name)}</strong><b>${number(state.scores[p])}</b><span>${state.ready?.[p] ? "Ready" : "Not ready"}</span></div>`).join('<span class="ar-versus" aria-hidden="true">vs</span>')}</div>${state.result ? renderResult(ui, state.result) : ""}${["cancelled", "abandoned", "expired"].includes(state.status) ? `<section class="ar-empty"><h2>${state.status === "abandoned" ? "Match abandoned" : state.status === "expired" ? "This table has expired" : "Match cancelled"}</h2><p>No rated result has been recorded.</p></section>` : state.status === "accepted" ? `<section class="ar-ready"><h2>Your table is waiting.</h2><p>${terms(ui.challenge)}</p><p>Both players must be online and Ready. ${state.ready?.[you] ? "You are ready; waiting for the other player or scheduled time." : "Review the terms, then join when you are ready."}</p>${button("ready", state.ready?.[you] ? "You are ready" : "I’m ready", state.ready?.[you] ? 'aria-disabled="true"' : "")}</section>` : round ? `<section class="ar-round" data-round="${esc(round.id)}"><div class="ar-section-head"><h2 tabindex="-1">Question ${number(state.roundIndex + 1)} of ${number(state.questionCount)}</h2><span class="ar-chip" data-clock></span></div><p class="ar-question">${esc(round.question)}</p><div class="ar-options">${round.options.map((option, i) => `<button type="button" class="ar-option ${round.eliminated.some(e => e.choice === i) ? "is-eliminated" : ""} ${round.resolved && round.correctIndex === i ? "is-correct" : ""}" data-choice="${i}"><span>${String.fromCharCode(65 + i)}</span><span>${esc(option)}</span>${round.eliminated.some(e => e.choice === i) ? `<small>${round.eliminated.find(e => e.choice === i).by === you ? "You chose this" : "Opponent chose this"} · incorrect</small>` : ""}</button>`).join("")}</div><p class="ar-note">Your mistakes this question: ${number(round.wrong[you])}/3 · opponent: ${number(round.wrong[other])}/3. Counters reset at the next question.</p>${round.resolved ? `<div class="ar-explanation"><h3>${round.winner == null ? "Round complete" : round.winner === you ? "Your point" : "Opponent’s point"}</h3><p>${esc(round.explanation || "The server has resolved this round.")}</p></div>${state.status === "finished" ? "" : button("next", round.nextReady?.[you] ? "Waiting for the other player…" : "Next question", round.nextReady?.[you] ? 'aria-disabled="true"' : "")}` : ""}</section>` : '<section class="ar-ready"><h2>Get ready.</h2><p data-clock>Waiting for the server’s first question…</p></section>'}<div class="ar-actions">${["accepted", "playing"].includes(state.status) ? button("leave", state.status === "playing" ? "Forfeit match" : "Cancel before play") : button("back", "Back to challenges")}</div>`;
    ui.content.querySelector('[data-ar="ready"]')?.addEventListener("click", () => { if (!ui.state.ready?.[you]) send(ui, "ready"); });
    ui.content.querySelector('[data-ar="next"]')?.addEventListener("click", () => { if (ui.state.round?.resolved && !ui.state.round.nextReady?.[you]) send(ui, "next", { roundId: ui.state.round.id }); });
    ui.content.querySelectorAll("[data-choice]").forEach(node => { node.onclick = () => {
      tick(ui); if (node.getAttribute("aria-disabled") === "true" || ui.pendingAnswer) return;
      const pending = { commandId: uuid(), roundId: ui.state.round.id, choice: Number(node.dataset.choice) };
      if (send(ui, "answer", pending)) { ui.pendingAnswer = pending; feedback(ui, "Answer sent. Waiting for the server…"); tick(ui); }
    }; });
    ui.content.querySelector('[data-ar="leave"]')?.addEventListener("click", () => ask(ui, state.status === "playing" ? "Forfeit this match?" : "Cancel this table?", state.status === "playing" ? "Your opponent will win this match. This cannot be undone." : "Cancelling before play will not count as a loss.", state.status === "playing" ? "Confirm forfeit" : "Confirm cancellation", () => perform(ui, "leave", async () => {
      const data = await request("/arena/challenges/" + encodeURIComponent(ui.challenge.id) + "/leave", { actor: ui.actor, signal: ui.controller.signal, body: {} });
      if (live(ui)) { if (data.state) acceptState(ui, data.state); else if (challengeValid(data.challenge, ui)) renderChallenge(ui, data.challenge); else throw Error("The result was not confirmed. Reopen the match."); }
    })));
    ui.content.querySelector('[data-ar="back"]')?.addEventListener("click", () => { disposeSocket(ui, "match"); ui.state = null; hub(ui); });
    tick(ui); math(ui.content);
    if (focusInside) (focusedChoice != null ? ui.content.querySelector('[data-choice="' + focusedChoice + '"]') : ui.content.querySelector('[data-ar="' + (focusedAction || "") + '"]'))?.focus({ preventScroll: true });
  }
  function tick(ui) {
    if (!live(ui)) { if (current === ui) close(); return; }
    const state = ui.state, now = Date.now() + ui.serverOffset;
    if (ui.view === "match" && state) {
      const round = state.round, remaining = Math.max(0, Number(round?.cooldownUntil?.[state.you] || 0) - now), countdown = Math.max(0, Number(state.startAt || 0) - now), connected = ui.match?.socket?.readyState === 1;
      const clock = ui.content.querySelector("[data-clock]");
      if (clock) clock.textContent = !connected ? "Reconnecting…" : countdown > 0 ? "Starts in " + Math.ceil(countdown / 1000) : remaining > 0 ? "Try again in " + Math.ceil(remaining / 1000) + "s" : round?.resolved ? "Review together" : "First correct answer wins";
      ui.content.querySelectorAll("[data-choice]").forEach(node => node.setAttribute("aria-disabled", String(!connected || state.status !== "playing" || !!round?.resolved || remaining > 0 || countdown > 0 || !!ui.pendingAnswer || !!round?.eliminated.some(e => e.choice === Number(node.dataset.choice)))));
    }
    if (ui.view === "puzzle" && ui.puzzle) paintPuzzleClock(ui);
  }
  function recordHTML(record, compact = false) {
    if (!record || !Array.isArray(record.honors)) return '<p class="ar-note">Competition record is not shared.</p>';
    const honors = record.honors.filter(h => Number(h.earnedAt || h.awardedAt) > 0);
    return `<div class="ar-record-stats">${[["Wins", record.wins], ["Draws", record.draws], ["Losses", record.losses], ["Opponents", record.uniqueOpponents]].map(([label, value]) => `<div><strong>${number(value)}</strong><span>${label}</span></div>`).join("")}</div><div class="ar-honors">${honors.length ? honors.map(h => `<article class="ar-honor">${emblem()}<div><h3>${esc(h.title)}</h3><p>${esc(h.description)}</p><span>${esc(date(h.earnedAt || h.awardedAt))}</span></div></article>`).join("") : '<p class="ar-note">Your first competition keepsake is still ahead. Complete friendly duels and weekend events to discover honours.</p>'}</div>${Array.isArray(record.progression) ? `<div class="ar-progression">${record.progression.map(p => `<article><strong>${esc(p.title)}</strong><p>${esc(p.description)}</p><progress max="${Math.max(1, Number(p.target) || 1)}" value="${Math.max(0, Math.min(Number(p.target) || 1, Number(p.progress) || 0))}" aria-label="${esc(p.title)}"></progress><span>${number(p.progress)} / ${number(p.target)}</span></article>`).join("")}</div>` : ""}${!compact && Array.isArray(record.recent) && record.recent.length ? `<h3>Recent matches</h3><div class="ar-history">${record.recent.map(r => `<article><strong>${esc(r.courseTitle)}</strong><span>${esc(r.outcome)} · ${number(r.scores?.[0])}–${number(r.scores?.[1])}</span><span>${esc(date(r.finishedAt))}</span></article>`).join("")}</div>` : ""}${!compact && Array.isArray(record.events) && record.events.length ? `<h3>Weekend discoveries</h3><div class="ar-history">${record.events.map(r => `<article><strong>${esc(r.title || r.eventId)}</strong><span>${number(r.score)} / 100</span><span>${esc(r.mode || "")}</span></article>`).join("")}</div>` : ""}`;
  }
  async function records(ui) {
    const epoch = view(ui, "record", '<h2>Your competition story</h2><p>Loading your record…</p>');
    if (!ui.actor.account) { accountPrompt(ui); return; }
    try {
      const data = await loadMe(ui); if (!live(ui) || ui.epoch !== epoch || !data) return;
      ui.content.innerHTML = `<div class="ar-section-head"><h2>Your competition story</h2>${button("refresh", "Refresh")}</div>${recordHTML(data.record)}<section class="ar-settings"><h3>Your choice of company</h3><label><input type="checkbox" data-setting="invitations" ${data.settings.invitations ? "checked" : ""}> Allow other learners to invite me</label><label><input type="checkbox" data-setting="publicRecord" ${data.settings.publicRecord ? "checked" : ""}> Show my competition record on my public profile</label><p class="ar-note">Invitation preferences and record visibility are independent. Existing profile and ranking privacy settings still apply. Turning invitations off does not silently decline a pending invitation.</p>${button("save-settings", "Save preferences")}</section>`;
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
    host.innerHTML = '<section class="ar-profile"><div class="ar-section-head"><h3>Competition honours</h3></div><p role="status">Loading competition record…</p></section>';
    const section = host.querySelector(".ar-profile");
    if (collection && !actor.account) { section.innerHTML = '<h3>Competition honours</h3><p>Connect an account to collect honours from friendly duels and weekend events.</p>'; return mount.dispose; }
    if (!collection && !target) { mount.dispose(); host.replaceChildren(); return mount.dispose; }
    const load = () => {
      if (!valid()) return;
      section.innerHTML = '<h3>Competition honours</h3><p role="status">Loading competition record…</p>';
      request(collection ? "/arena/me" : "/arena/profile?account=" + encodeURIComponent(target), { ...(collection ? { actor } : {}), signal: controller.signal }).then(data => {
      if (!valid()) { mount.dispose(); return; }
      if (collection && key(data.me?.accountKey) !== actor.account) throw Error("Your connected account could not be confirmed.");
      if (data.record !== null && (!data.record || !Array.isArray(data.record.honors))) throw Error("Competition record is temporarily unavailable.");
      section.innerHTML = `<div class="ar-section-head"><h3>Competition honours</h3>${data.record ? '<span class="ar-chip">Earned through play</span>' : ""}</div>${recordHTML(data.record, true)}${collection || payload?.self ? button("arena-open", "Open Arena & weekend events") : ""}`;
      section.querySelector('[data-ar="arena-open"]')?.addEventListener("click", open); math(section);
      }).catch(error => {
        if (!valid()) return;
        section.innerHTML = `<h3>Competition honours could not load</h3><p role="status">${esc(error.message || "Competition record is temporarily unavailable.")}</p>${button("retry-record", "Try again")}`;
        section.querySelector('[data-ar="retry-record"]').onclick = load;
      });
    };
    load();
    return mount.dispose;
  }
  function eventCard(event) {
    return `<article class="ar-event ar-event--${esc(event.mode)}"><span class="ar-chip">${esc(event.status === "active" ? "This weekend · open" : event.status)}</span><span class="ar-event-symbol" aria-hidden="true">${event.mode === "relay" ? "↗" : event.mode === "route" ? "⌁" : "⋈"}</span><h3>${esc(event.title)}</h3><p>${esc(event.description)}</p><p class="ar-note">${esc(date(event.startsAt, event.timezone))} – ${esc(date(event.endsAt, event.timezone))}<br>${esc(event.timezone)} · ${number(event.puzzleCount)} puzzles · ${number(event.maxScore)} points</p>${button("event", event.status === "upcoming" ? "Preview the weekend" : "Open event", `data-event="${esc(event.id)}"`)}</article>`;
  }
  async function events(ui) {
    const epoch = view(ui, "events", `<section class="ar-hero ar-hero--events"><div><span class="ar-eyebrow">A fresh way to explore</span><h2>A little weekend adventure.</h2><p>Order ideas, find a path, or connect prerequisites. Five puzzles, one official run, and room to practise afterwards.</p></div><span class="ar-event-symbol" aria-hidden="true">⌁</span></section><div class="ar-section-head"><h2>On the calendar</h2>${button("refresh", "Refresh")}</div><div class="ar-events"><p>Loading weekends…</p></div><details class="ar-rules"><summary>How weekend events work</summary><p>Events run from Saturday 00:00 to Monday 00:00 in Europe/Amsterdam, including daylight saving changes. The next two weekends are previewed here.</p><p>Your one official run has five puzzles. Correct on the first, second or third attempt earns 20, 12 or 6 points. Three incorrect attempts or an explicit skip earns zero. A wrong unfinished attempt has a two-second pause. Practise freely after completing your run or after the event closes.</p><p>Complete all five puzzles and solve at least three to qualify for honours. With at least two public qualifying participants, the top score wins; tied top scores share the honour. There is no speed tie-break. The board remains provisional until the event has been finalized.</p></details>`);
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
    const finalized = data.event.status === "finalized";
    const honors = (Array.isArray(data.honors) ? data.honors : []).filter(h => h.eventId === data.event.id && Number(h.awardedAt) > 0);
    const winners = finalized ? `<section class="ar-event-winners"><h3>Confirmed weekend champions</h3><div class="ar-honors">${honors.length ? honors.map(h => `<article class="ar-honor">${emblem()}<div><h3>${esc(h.name || "Public participant")}</h3><p>${esc(h.title)} · ${number(h.score)} / 100</p><span>${Number(h.coWinnerCount) > 1 ? "Joint champion · shared top score" : "Weekend champion"}</span></div></article>`).join("") : '<p class="ar-note">No public championship is displayed. Awards require at least two qualifying public completed runs; winners also keep control of their privacy.</p>'}</div></section>` : "";
    return winners + `<section class="ar-leaders"><h3>${finalized ? "Final scores" : "Provisional leaders"}</h3>${Array.isArray(data.leaders) && data.leaders.length ? `<ol>${data.leaders.map(l => `<li><span>${number(l.rank)} · ${esc(l.name)}<small>${l.completed ? "Completed run" : finalized ? "Incomplete run" : "Run in progress"} · ${number(l.solvedCount)} solved</small></span><strong>${number(l.score)} / 100</strong></li>`).join("")}</ol>` : '<p class="ar-note">No public scores yet.</p>'}<p class="ar-note">${finalized ? "The score list includes incomplete runs. Championship eligibility requires all five puzzles completed and at least three solved; only the confirmed honours above identify winners." : "Honours are confirmed after the event closes; the current leader is not yet an awarded champion."}</p></section>`;
  }
  function renderEvent(ui, data) {
    ui.eventData = data; ui.puzzle = null;
    const event = data.event, entry = data.entry, closed = ["closed", "finalized"].includes(event.status);
    view(ui, "event", `<div class="ar-section-head"><div><span class="ar-eyebrow">${esc(event.mode)} · ${esc(event.status)}</span><h2>${esc(event.title)}</h2></div>${button("back", "All weekends")}</div><p>${esc(event.description)}</p><p class="ar-note">${esc(date(event.startsAt, event.timezone))} – ${esc(date(event.endsAt, event.timezone))} · ${esc(event.timezone)}</p><div class="ar-actions">${button("calendar", "Add to my calendar (.ics)")}${ui.actor.account ? button("mute", event.muted ? "Remind me this weekend" : "Mute this weekend") : ""}</div>${entry ? `<section class="ar-event-score"><strong>${number(entry.score)}<small> / 100</small></strong><span>${number(entry.resolvedCount)} of 5 completed · ${number(entry.solvedCount)} solved<br>${entry.completed ? "Official run complete. Your score is safely recorded." : closed ? "Official play has closed. Your unfinished run’s score is kept; you can continue in practice mode." : "Your official run is in progress."}</span></section>` : event.status === "active" ? `<section class="ar-ready"><h3>One official run. Five discoveries.</h3><p>Up to three attempts per puzzle: 20 / 12 / 6 points. You may choose the order. Skips earn zero and reveal the solution.</p>${button("start-event", ui.actor.account ? "Start my official run" : "Connect to join")}</section>` : event.status === "upcoming" ? '<p class="ar-note">The puzzle pack opens when the event begins. Save the date or explore a previous weekend.</p>' : '<p class="ar-note">Official play has closed. You can still explore these puzzles in practice mode.</p>'}<div class="ar-puzzle-list">${data.puzzles.map((p, i) => { const result = entry?.puzzles?.find(x => x.id === p.id); return `<article><span class="ar-eyebrow">Puzzle ${i + 1} · ${esc(p.courseName)}</span><h3>${esc(p.title)}</h3><p>${result?.finished ? `${number(result.points)} points · ${result.solved ? "solved" : "complete"}` : "A new connection to discover"}</p>${button("puzzle", !ui.actor.account ? (closed ? "Connect to practise" : "Connect to join") : result?.finished && !entry.completed && !closed ? "Review result" : entry?.completed || closed ? "Practise puzzle" : "Open puzzle", `data-puzzle="${esc(p.id)}" ${ui.actor.account && !entry && !closed ? 'aria-disabled="true"' : ""}`)}</article>`; }).join("")}</div>${eventResults(data)}`);
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
      if (node.getAttribute("aria-disabled") === "true") { feedback(ui, "Start your official run before opening a scored puzzle."); return; }
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
  function puzzle(ui, data, id, practice) {
    const p = data.puzzles.find(item => item.id === id); if (!p) return;
    const progress = data.entry?.puzzles?.find(item => item.id === id);
    const modeKnown = ["relay", "route", "match"].includes(p.mode);
    const previous = ui.puzzle?.id === id && ui.puzzle?.eventId === data.event.id && ui.puzzle?.practice === practice ? ui.puzzle : null;
    const restored = practice ? null : (previous?.feedback || progress?.feedback || null);
    const restoredAnswer = Array.isArray(restored?.answer) ? restored.answer : null;
    ui.puzzle = { id, eventId: data.event.id, source: p, practice, progress, unsupported: !modeKnown, selected: p.mode !== "match" && restoredAnswer ? restoredAnswer.slice() : p.mode === "route" ? [p.startId] : [], pairs: p.mode === "match" && restoredAnswer ? Object.fromEntries(restoredAnswer.filter(pair => Array.isArray(pair) && pair.length === 2)) : {}, feedback: restored, retryAt: practice ? 0 : Number(progress?.retryAt || 0), attempt: null };
    const q = ui.puzzle;
    view(ui, "puzzle", `<div class="ar-section-head"><div><span class="ar-eyebrow">${practice ? "Practice · no score changes" : "Your official run"} · ${esc(p.courseName)}</span><h2>${esc(p.title)}</h2></div>${button("back", "Event overview")}</div><p class="ar-prompt">${esc(p.prompt)}</p><p class="ar-note">${p.mode === "relay" ? "Choose cards in order. Use Move up, Move down or Remove to revise the sequence." : p.mode === "route" ? "Build the shortest route from prerequisite to dependent. Choose the next concept; Undo removes your last step." : "Choose one dependent for each prerequisite. Each right-hand concept is used once."}</p><div class="ar-puzzle-controls"></div><p class="ar-puzzle-clock" data-puzzle-clock role="status"></p><div class="ar-puzzle-feedback" role="status" aria-live="polite"></div><div class="ar-actions">${button("submit-puzzle", practice ? "Check practice answer" : "Submit answer")}${!practice ? button("skip-puzzle", "Skip for 0 points") : button("reset-puzzle", "Try a fresh answer")}</div><p class="ar-note">${practice ? "Practice is unlimited and cannot alter your official score." : "Attempts score 20 / 12 / 6 points. Incorrect unfinished answers pause for 2 seconds; the server confirms every result."}</p>`);
    ui.content.querySelector('[data-ar="back"]').onclick = () => showEvent(ui, data.event.id);
    if (!modeKnown) { ui.content.querySelector(".ar-puzzle-controls").textContent = "This game needs a newer version of the wiki. Refresh the page to continue."; ui.content.querySelector('[data-ar="submit-puzzle"]').setAttribute("aria-disabled", "true"); return; }
    ui.content.querySelector('[data-ar="submit-puzzle"]').onclick = () => submitPuzzle(ui, false);
    ui.content.querySelector('[data-ar="skip-puzzle"]')?.addEventListener("click", () => ask(ui, "Skip this official puzzle?", "This puzzle will finish for zero points and reveal its solution. You cannot retry it for an official score.", "Skip for 0 points", () => submitPuzzle(ui, true)));
    ui.content.querySelector('[data-ar="reset-puzzle"]')?.addEventListener("click", () => puzzle(ui, data, id, true));
    paintPuzzle(ui); paintPuzzleFeedback(ui); paintPuzzleClock(ui); math(ui.content);
  }
  function paintPuzzle(ui) {
    const q = ui.puzzle, p = q.source, host = ui.content.querySelector(".ar-puzzle-controls"); if (!host) return;
    const title = id => (p.nodes || p.cards || []).find(n => n.id === id)?.title || (p.cards || []).find(n => n.id === id)?.title || id;
    if (p.mode === "match") {
      host.innerHTML = `<div class="ar-pairs">${(p.left || []).map((left, i) => `<label><span>${i + 1}. ${esc(left.title)}</span><select data-left="${esc(left.id)}"><option value="">Choose a dependent…</option>${(p.right || []).map(right => `<option value="${esc(right.id)}" ${q.pairs[left.id] === right.id ? "selected" : ""}>${esc(right.title)}</option>`).join("")}</select></label>`).join("")}</div>`;
      host.querySelectorAll("[data-left]").forEach(select => { select.onchange = () => { q.pairs[select.dataset.left] = select.value; q.attempt = null; }; });
    } else {
      host.innerHTML = `<div class="ar-sequence" aria-label="Your proposed ${p.mode === "route" ? "path" : "order"}">${q.selected.length ? q.selected.map((id, i) => `<article><span>${i + 1}</span><strong>${esc(title(id))}</strong>${p.mode === "relay" ? `<div class="ar-sequence-actions">${button("move-up", "↑", `data-index="${i}" aria-label="Move ${esc(title(id))} up" ${i === 0 ? 'aria-disabled="true"' : ""}`)}${button("move-down", "↓", `data-index="${i}" aria-label="Move ${esc(title(id))} down" ${i === q.selected.length - 1 ? 'aria-disabled="true"' : ""}`)}${button("remove-card", "×", `data-index="${i}" aria-label="Remove ${esc(title(id))}"`)}</div>` : ""}</article>`).join("") : '<p>Choose the first card below.</p>'}</div>${p.mode === "route" ? `<p>Target: <strong>${esc(title(p.targetId))}</strong> · maximum ${number(p.maxHops)} steps</p>${button("undo-card", "Undo last step", q.selected.length < 2 ? 'aria-disabled="true"' : "")}` : ""}<div class="ar-cards" aria-label="Available concepts">${(p.cards || p.nodes || []).filter(n => !q.selected.includes(n.id)).map(n => `<button type="button" class="ar-card" data-card="${esc(n.id)}">${esc(n.title)}</button>`).join("")}</div>`;
      const revise = action => {
        const focused = document.activeElement, ownedFocus = host.contains(focused), index = Number(focused?.dataset?.index), kind = focused?.dataset?.ar;
        action(); paintPuzzle(ui); math(host);
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
    const remaining = Math.max(0, q.retryAt - Date.now()), finished = !q.practice && !!q.progress?.finished;
    const clock = ui.content.querySelector("[data-puzzle-clock]");
    if (clock) clock.textContent = remaining ? "You can try again in " + Math.ceil(remaining / 1000) + "s." : finished ? "Official puzzle complete · " + number(q.progress.points) + " points." : q.practice ? "Practice answer ready when you are." : number(q.progress?.attempts) + " of 3 attempts used.";
    for (const action of ["submit-puzzle", "skip-puzzle"]) ui.content.querySelector('[data-ar="' + action + '"]')?.setAttribute("aria-disabled", String(remaining > 0 || finished || q.unsupported || ui.busy.has("puzzle-submit")));
  }
  function paintPuzzleFeedback(ui) {
    const q = ui.puzzle, host = ui.content.querySelector(".ar-puzzle-feedback"), f = q.feedback; if (!host || !f) return;
    const all = [...(q.source.nodes || []), ...(q.source.cards || []), ...(q.source.left || []), ...(q.source.right || [])];
    const title = id => all.find(n => n.id === id)?.title || String(id);
    host.innerHTML = `<h3>${f.correct ? "A connection found." : f.finished ? "An idea to take with you." : "Try another connection."}</h3><p>${esc(f.message || "Your answer was checked by the server.")}</p>${Array.isArray(f.solution) ? `<div class="ar-solution"><strong>One valid solution</strong><ol>${f.solution.map(part => `<li>${esc(Array.isArray(part) ? part.map(title).join(" → ") : title(part))}</li>`).join("")}</ol></div>` : ""}`;
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
      if (!q.practice && (result.entry?.eventId !== q.eventId || !Array.isArray(result.entry.puzzles) || Number(result.entry.revision) < Number(data.entry?.revision || 0))) throw Error("Your score was not confirmed. Refresh the event before continuing.");
      q.feedback = result.feedback; q.retryAt = Number(result.feedback.retryAt || 0); q.attempt = null;
      if (!q.practice) { data.entry = result.entry; q.progress = result.entry.puzzles.find(x => x.id === q.id); }
      feedback(ui, q.practice ? "Practice checked. Your official score is unchanged." : "Answer recorded by the server."); paintPuzzleFeedback(ui);
    }).then(() => { if (live(ui) && ui.puzzle === q) paintPuzzleClock(ui); });
  }
  function open() { const ui = create(); if (ui) hub(ui); return ui?.dialog; }
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
    if (!busyStudying()) { show(); return; }
    // While another task owns focus, retain a visible pending entry and wait.
    // As soon as the page is idle, this revision opens its dismissible full
    // negotiation dialog once. Closing it never declines the invitation.
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
              if (["accepted", "playing", "finished"].includes(latest.status)) showChallenge(current, latest.id);
              else renderChallenge(current, latest);
            } else if (!latest && matchId === current.challenge.id) showChallenge(current, matchId);
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
      const event = Array.isArray(data.events) && data.events.find(e => e.status === "active" && !e.muted);
      if (!event) return;
      try { if (localStorage.getItem(seenKey(actor, event.id))) return; } catch (_) {}
      const node = document.createElement("aside"); node.className = "ar-reminder"; node.setAttribute("aria-label", "Weekend event");
      node.innerHTML = `<span class="ar-eyebrow">A little weekend adventure</span><strong>${esc(event.title)}</strong><p>${esc(event.description)}</p><div class="ar-actions">${button("explore", "Explore the event")}${button("dismiss", "Not now")}${button("mute", "Mute this weekend")}</div><p class="ar-reminder-status" role="status"></p>`;
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
  window.MkArena = { open, challenge, close, mountProfile: (host, payload) => mountRecord(host, payload, false), mountCollection: host => mountRecord(host, null, true) };
  window.dispatchEvent(new CustomEvent("mk-arena-ready"));
  reminderTimer = setTimeout(remind, 45000);
  backgroundTimer = setTimeout(startBackground, 1200);
})();
