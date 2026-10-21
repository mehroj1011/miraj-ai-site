(function () {
  var T = window.I18N, C = window.SITE_CONFIG || {};
  var DEFAULT = "tg";
  var lang = DEFAULT;

  // ?lang=ru | remembered choice | default Tajik
  try {
    var q = new URLSearchParams(location.search).get("lang");
    var saved = localStorage.getItem("miraj_lang");
    if (q && T[q]) lang = q; else if (saved && T[saved]) lang = saved;
  } catch (e) {}

  var FEATURES = ["f1","f2","f3","f4","f5","f6","f7","f8","f9"];
  var ICONS = ["💬","🧭","🎯","🗓️","🧘","📓","🤝","👩‍⚕️","🩺"];

  var NUM = {
    assump: [["a1","9 837","src_author"],["a2","5,00 с.","src_author"],["a3","19 872","src_author"],["a4","a4v","src_policy"],["a5","a5v","src_rules"],["a6","a6v","src_est"],["a7","12","src_est"],["a8","0,01455 с.","src_est"]],
    costs: [["c1","15 561"],["c2","2 000"],["c3","600"],["c4","240"],["c5","124"],["c6","1 853"],["c_ops","20 378","tot"],["c_labor","8 000"],["c_total","28 378","tot"]],
    income: [["i1","49 185,00"],["i2","− 7 377,75"],["i3","41 807,25","tot"],["i4","i4v"]],
    result: [["r1","13 429 с."],["r2","21 429 с."],["r3","47,3%"],["r4","r4v"],["r5","r5v"]],
    sens: [["s1","41 807","28 378","13 429","47,3%"],["s2","34 430","28 378","6 052","21,3%"],["s3","41 807","38 647","3 160","8,2%"],["s4","20 906","25 542","− 4 636","− 18,2%"]]
  };

  function t(k) { return (T[lang] && T[lang][k]) || T.tg[k] || k; }
  function val(v) { return T.tg[v] !== undefined ? t(v) : v; }

  function table(title, head, rows) {
    var h = "<div class='tw'><h3>" + title + "</h3><table><thead><tr>" + head.map(function (c, i) { return "<th" + (c.n ? " class='num'" : "") + ">" + c.t + "</th>"; }).join("") + "</tr></thead><tbody>" + rows + "</tbody></table></div>";
    return h;
  }

  function renderEcon() {
    var out = "";
    out += table(t("t_assump"), [{t:t("th_param")},{t:t("th_value"),n:1},{t:t("th_src")}],
      NUM.assump.map(function (r) { return "<tr><td>" + t(r[0]) + "</td><td class='num'>" + val(r[1]) + "</td><td>" + t(r[2]) + "</td></tr>"; }).join(""));
    out += table(t("t_costs"), [{t:t("th_item")},{t:"с.",n:1}],
      NUM.costs.map(function (r) { return "<tr" + (r[2] ? " class='tot'" : "") + "><td>" + t(r[0]) + "</td><td class='num'>" + r[1] + "</td></tr>"; }).join(""));
    out += table(t("t_income"), [{t:t("th_item")},{t:"с.",n:1}],
      NUM.income.map(function (r) { return "<tr" + (r[2] ? " class='tot'" : "") + "><td>" + t(r[0]) + "</td><td class='num'>" + val(r[1]) + "</td></tr>"; }).join(""));
    out += table(t("t_result"), [{t:t("th_param")},{t:t("th_value"),n:1}],
      NUM.result.map(function (r) { return "<tr><td>" + t(r[0]) + "</td><td class='num'>" + val(r[1]) + "</td></tr>"; }).join(""));
    // simple bar chart
    var bars = [["th_inc", 41807, ""], ["th_cost", 28378, "cost"], ["th_profit", 13429, "profit"]];
    out += "<div class='tw'><h3>" + t("econ_chart") + "</h3><div class='bars'>" + bars.map(function (b) {
      return "<div class='bar " + b[2] + "'><span>" + t(b[0]) + "</span><div class='t'><i style='width:" + Math.round(b[1] / 41807 * 100) + "%'></i></div><b>" + b[1].toLocaleString("en-US").replace(",", " ") + "</b></div>";
    }).join("") + "</div></div>";
    out += table(t("t_sens"), [{t:t("th_scn")},{t:t("th_inc"),n:1},{t:t("th_cost"),n:1},{t:t("th_profit"),n:1},{t:"ROI",n:1}],
      NUM.sens.map(function (r) { return "<tr><td>" + t(r[0]) + "</td><td class='num'>" + r[1] + "</td><td class='num'>" + r[2] + "</td><td class='num'>" + r[3] + "</td><td class='num'>" + r[4] + "</td></tr>"; }).join(""));
    out += "<p class='small'>" + t("econ_sens_note") + "</p>";
    document.getElementById("econTables").innerHTML = out;
  }

  function renderFeatures() {
    document.getElementById("features").innerHTML = FEATURES.map(function (f, i) {
      return "<div class='card'><h3>" + ICONS[i] + " " + t(f + "_t") + "</h3><p>" + t(f + "_d") + "</p></div>";
    }).join("");
  }

  function renderLinks() {
    var L = [["lnk_privacy", "privacy-policy"], ["lnk_terms", "terms-of-service"], ["lnk_who", "https://www.who.int/news-room/fact-sheets/detail/mental-disorders"]];
    if (C.appStoreUrl) L.unshift(["lnk_appstore", C.appStoreUrl]);
    if (C.playUrl) L.unshift(["lnk_play", C.playUrl]);
    if (C.actUrl) L.unshift(["lnk_act", C.actUrl]);
    L.unshift(["lnk_actdoc", "docs/Miraj-AI-Act-" + lang + ".docx"]);
    document.getElementById("links").innerHTML = L.map(function (l) {
      var ext = /^https?:/.test(l[1]);
      var dl = /\.docx$/.test(l[1]) ? " download" : "";
      return "<a class='btn s' href='" + l[1] + "'" + dl + (ext ? " target='_blank' rel='noopener'" : "") + ">" + t(l[0]) + "</a>";
    }).join("");
  }

  function renderArch() {
    var m = { ar_ios: "tech_ios", ar_and: "tech_and", ar_local: "tech_local", ar_local_d: "tech_local_d", ar_proxy: "tech_proxy", ar_proxy_d: "tech_proxy_d", ar_ai: "tech_ai", ar_ai_d: "tech_ai_d", ar_db: "tech_db", ar_db_d: "tech_db_d" };
    Object.keys(m).forEach(function (id) { var e = document.getElementById(id); if (e) e.textContent = t(m[id]); });
  }

  function renderDownloads() {
    var ios = document.getElementById("storeIos"), and = document.getElementById("storeAnd");
    if (C.appStoreUrl) { ios.href = C.appStoreUrl; ios.target = "_blank"; ios.rel = "noopener"; ios.removeAttribute("aria-disabled"); }
    var hasApk = !!C.apkUrl, hasPlay = !!C.playUrl;
    document.getElementById("soonNote").classList.toggle("hidden", !!C.appStoreUrl && (hasApk || hasPlay));
    if (!hasApk && !hasPlay) { and.setAttribute("aria-disabled", "true"); return; }
    and.removeAttribute("aria-disabled");

    var modal = document.getElementById("apkModal");
    function open() { modal.classList.remove("hidden"); document.getElementById("apkBtn").focus(); }
    function close() { modal.classList.add("hidden"); and.focus(); }
    and.addEventListener("click", open);
    document.getElementById("apkClose").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.classList.contains("hidden")) close(); });

    var btn = document.getElementById("apkBtn");
    if (hasApk) { btn.href = C.apkUrl; btn.setAttribute("download", ""); } else { btn.classList.add("hidden"); }
    var meta = [C.apkVersion, C.apkSize, C.apkMinAndroid].every(Boolean);
    document.getElementById("apkMeta").classList.toggle("hidden", !meta);
    document.getElementById("apkSha").textContent = C.apkSha256 || "";
    document.getElementById("shaRow").classList.toggle("hidden", !C.apkSha256);
    var pl = document.getElementById("playLink");
    document.getElementById("playAlt").classList.toggle("hidden", !hasPlay);
    if (hasPlay) pl.href = C.playUrl;
    document.getElementById("shaCopy").addEventListener("click", function () {
      var b = this; try { navigator.clipboard.writeText(C.apkSha256); b.textContent = t("dl_copied"); setTimeout(function () { b.textContent = t("dl_sha_copy"); }, 1500); } catch (e) {}
    });
  }

  function renderOptional() {
    if (C.demoEmail && C.demoPassword) {
      document.getElementById("demo").classList.remove("hidden");
      document.getElementById("demoEmail").textContent = C.demoEmail;
      document.getElementById("demoPass").textContent = C.demoPassword;
    }
    var who = [C.authorName, C.authorRole].filter(Boolean).join(" — ");
    if (who) { document.getElementById("who").classList.remove("hidden"); document.getElementById("whoText").textContent = who; }
    var contact = [];
    if (C.contactEmail) contact.push("<a href='mailto:" + C.contactEmail + "'>" + C.contactEmail + "</a>");
    if (C.telegram) contact.push("<a href='" + C.telegram + "' target='_blank' rel='noopener'>Telegram</a>");
    if (contact.length) { document.getElementById("contactRow").classList.remove("hidden"); document.getElementById("contactText").innerHTML = contact.join(" · "); }
    if (C.statsImages && C.statsImages.length) {
      document.getElementById("real").classList.remove("hidden");
      document.getElementById("realImgs").innerHTML = C.statsImages.map(function (s) { return "<img src='" + s + "' alt=''>"; }).join("");
    }
  }

  function apply() {
    document.documentElement.lang = lang === "tg" ? "tg" : lang;
    document.title = t("meta_title");
    document.querySelector("meta[name=description]").setAttribute("content", t("meta_desc"));
    document.querySelectorAll("[data-i]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i")); });
    document.querySelectorAll(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    renderFeatures(); renderLinks(); renderArch(); renderEcon();
    var ab = document.getElementById("actBtn"); if (ab) ab.href = "docs/Miraj-AI-Act-" + lang + ".docx";
    var m = document.getElementById("apkMeta");
    if (m) m.textContent = t("dl_modal_meta").replace("{v}", C.apkVersion || "").replace("{s}", C.apkSize || "").replace("{m}", C.apkMinAndroid || "");
  }

  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.dataset.lang;
      try { localStorage.setItem("miraj_lang", lang); } catch (e) {}
      apply();
    });
  });

  apply(); renderOptional(); renderDownloads();
})();
