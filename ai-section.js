/* Interactive AI-architecture section: request lifecycle, comparison, evaluation workflow. Text comes from i18n-ai.js. */
(function () {
  var STATUS = window.AI_STATUS || {};
  var TITLES = {
    input: "User Input", context: "Context Engineering Layer", instr: "System Instructions", conv: "Conversation Context",
    memory: "User Memory", personal: "Personalization", knowledge: "Curated Knowledge", safety: "Safety Constraints",
    model: "Foundation Model", process: "Response Processing", response: "Personalized Response", improve: "Feedback, Evaluation & Improvement"
  };
  var ORDER = ["input", "context", "instr", "conv", "memory", "personal", "knowledge", "safety", "model", "process", "response", "improve"];
  var SUB = ["instr", "conv", "memory", "personal", "knowledge", "safety"];
  var state = { sel: "input", playing: false, timer: null, cmp: 2, wf: 1 };
  var T = function (k) { return k; };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function chip(code) { return "<span class='chip-s " + code + "'>" + T("st_" + code) + "</span>"; }
  function node(id, extra) {
    var code = STATUS[id];
    return "<button type='button' class='lcn " + code + (state.sel === id ? " sel" : "") + (extra || "") + "' data-id='" + id + "' aria-expanded='" + (state.sel === id) + "'>" +
      "<span class='lcn-top'><b>" + TITLES[id] + "</b>" + chip(code) + "</span><span class='lcn-s'>" + esc(T("lc_" + id + "_s")) + "</span></button>";
  }
  function detail(id) { return "<div class='lcd' role='region' aria-live='polite'><b>" + TITLES[id] + "</b> " + chip(STATUS[id]) + "<p>" + esc(T("lc_" + id + "_d")) + "</p></div>"; }
  var arrow = "<div class='lca' aria-hidden='true'>↓</div>";

  function renderLifecycle() {
    var el = document.getElementById("lifecycle"); if (!el) return;
    var idx = ORDER.indexOf(state.sel) + 1;
    var inCtx = state.sel === "context" || SUB.indexOf(state.sel) >= 0;
    var h = "<div class='lc-ctl'><button type='button' class='btn s' id='lcPlay'>" + (state.playing ? "❚❚ " + T("lc_pause") : "▶ " + T("lc_play")) + "</button>" +
      "<button type='button' class='btn s' id='lcPrev' aria-label='" + T("lc_prev") + "'>←</button><button type='button' class='btn s' id='lcNext' aria-label='" + T("lc_next") + "'>→</button>" +
      "<span class='small' id='lcStep'>" + T("lc_step").replace("{n}", idx).replace("{m}", ORDER.length) + "</span></div>";
    h += "<div class='lc'>";
    h += node("input") + (state.sel === "input" ? detail("input") : "") + arrow;
    h += "<div class='lc-group" + (inCtx ? " on" : "") + "'>" + node("context") +
      "<div class='lc-sub'>" + SUB.map(function (s) { return node(s, " small"); }).join("") + "</div>" +
      (inCtx ? detail(state.sel) : "") + "</div>" + arrow;
    ["model", "process", "response"].forEach(function (id, i) { h += node(id) + (state.sel === id ? detail(id) : "") + (i < 2 ? arrow : ""); });
    h += "<div class='lca dashed' aria-hidden='true'>⇣</div>" + node("improve") + (state.sel === "improve" ? detail("improve") : "");
    h += "</div>";
    el.innerHTML = h;
  }

  function select(id, keepPlay) {
    state.sel = id; if (!keepPlay) stop();
    renderLifecycle();
  }
  function step(d) {
    var i = (ORDER.indexOf(state.sel) + d + ORDER.length) % ORDER.length;
    select(ORDER[i], true);
  }
  function stop() { state.playing = false; if (state.timer) { clearInterval(state.timer); state.timer = null; } }
  function play() {
    if (state.playing) { stop(); renderLifecycle(); return; }
    state.playing = true;
    if (ORDER.indexOf(state.sel) === ORDER.length - 1) state.sel = ORDER[0];
    state.timer = setInterval(function () { step(1); if (ORDER.indexOf(state.sel) === ORDER.length - 1) { stop(); renderLifecycle(); } }, reduce ? 3500 : 2600);
    renderLifecycle();
  }

  function renderCards() {
    var ce = document.getElementById("ceCards");
    if (ce) ce.innerHTML = [1, 2, 3, 4, 5, 6].map(function (i) {
      var map = ["instr", "conv", "memory", "personal", "knowledge", "safety"][i - 1];
      return "<div class='card'><h3>" + T("ce" + i + "_t") + "</h3><p>" + T("ce" + i + "_d") + "</p><div class='card-st'>" + chip(STATUS[map]) + "</div></div>";
    }).join("");
    var ds = document.getElementById("dsCards");
    if (ds) ds.innerHTML = ["A", "B", "C", "D"].map(function (k) {
      return "<div class='card'><h3>" + T("ds" + k + "_t") + "</h3><p>" + T("ds" + k + "_d") + "</p><div class='card-st'>" + chip(STATUS["ds" + k]) + "</div></div>";
    }).join("");
  }

  function renderCompare() {
    var el = document.getElementById("cmp"); if (!el) return;
    var two = state.cmp === 2;
    var blocks = two ? "<div class='blocks'>" + [1, 2, 3, 4, 5].map(function (i) { return "<span class='blk'>" + T("cmp_b" + i) + "</span>"; }).join("") + "</div>" : "";
    el.innerHTML = "<div class='tabs' role='tablist'>" +
      "<button role='tab' type='button' class='tab" + (!two ? " on" : "") + "' aria-selected='" + (!two) + "' data-cmp='1'>" + T("cmp_tab1") + "</button>" +
      "<button role='tab' type='button' class='tab" + (two ? " on" : "") + "' aria-selected='" + two + "' data-cmp='2'>" + T("cmp_tab2") + "</button></div>" +
      "<div class='card cmpbox'><span class='chip-s plan'>" + T("cmp_ill") + "</span>" +
      "<p class='q'>" + T("cmp_prev") + "<br>" + T("cmp_ask") + "</p>" +
      "<p class='small'>" + (two ? T("cmp_sent2") : T("cmp_sent1")) + "</p>" + blocks +
      "<div class='ans " + (two ? "good" : "plain") + "'>" + T(two ? "cmp_a2" : "cmp_a1") + "</div></div>" +
      "<p class='small'>" + T("cmp_note") + "</p>";
  }

  function renderWorkflow() {
    var el = document.getElementById("wf"); if (!el) return;
    var h = "<div class='wf-steps' role='tablist'>";
    for (var i = 1; i <= 7; i++) h += "<button type='button' role='tab' class='wf-s" + (state.wf === i ? " on" : "") + "' aria-selected='" + (state.wf === i) + "' data-wf='" + i + "'><b>" + i + "</b><span>" + T("wf" + i + "_t") + "</span></button>";
    h += "</div><div class='card wf-d'><h3>" + state.wf + ". " + T("wf" + state.wf + "_t") + "</h3><p>" + T("wf" + state.wf + "_d") + "</p>" +
      "<div class='wf-nav'><button type='button' class='btn s' data-wfn='-1'>←</button><button type='button' class='btn s' data-wfn='1'>→</button></div></div>";
    el.innerHTML = h;
  }

  function renderEval() {
    var el = document.getElementById("ev"); if (!el) return;
    var rows = [1, 2, 3, 4, 5].map(function (i) { return "<tr><td>" + T("ev_c" + i) + "</td><td>" + T("ev_r" + i) + "</td></tr>"; }).join("");
    el.innerHTML = "<span class='chip-s plan'>" + T("ev_badge") + "</span>" +
      "<div class='bubble u'>" + T("ev_user") + "</div><div class='bubble a'>" + T("ev_resp") + "</div>" +
      "<div class='tw'><table><thead><tr><th>" + T("ev_h1") + "</th><th>" + T("ev_h2") + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>" +
      "<p class='small'>" + T("ev_how") + "</p>";
  }

  function renderSummary() {
    var el = document.getElementById("smTable"); if (!el) return;
    var rows = STATUS.sm.map(function (c, i) { return "<tr><td>" + T("sm" + (i + 1)) + "</td><td>" + chip(c) + "</td></tr>"; }).join("");
    el.innerHTML = "<table><thead><tr><th>" + T("sm_h1") + "</th><th>" + T("sm_h2") + "</th></tr></thead><tbody>" + rows + "</tbody></table>";
  }

  // one delegated listener for every interactive control of the section
  document.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || !document.getElementById("aiSuite") || !document.getElementById("aiSuite").contains(b)) return;
    if (b.classList.contains("lcn")) { select(b.dataset.id); return; }
    if (b.id === "lcPlay") { play(); return; }
    if (b.id === "lcPrev") { stop(); step(-1); return; }
    if (b.id === "lcNext") { stop(); step(1); return; }
    if (b.dataset.cmp) { state.cmp = +b.dataset.cmp; renderCompare(); return; }
    if (b.dataset.wf) { state.wf = +b.dataset.wf; renderWorkflow(); return; }
    if (b.dataset.wfn) { state.wf = ((state.wf - 1 + +b.dataset.wfn + 7) % 7) + 1; renderWorkflow(); }
  });

  window.MirajAI = {
    render: function (tfn) { T = tfn; renderLifecycle(); renderCards(); renderCompare(); renderWorkflow(); renderEval(); renderSummary(); }
  };
})();
