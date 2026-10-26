(function () {
  "use strict";

  var DAY = 86400000;
  var INTERVALS = [
    { id: "20m", label: "Dakika 20", ms: 20 * 60000 },
    { id: "1h", label: "Saa 1", ms: 3600000 },
    { id: "3h", label: "Saa 3", ms: 3 * 3600000 },
    { id: "6h", label: "Saa 6", ms: 6 * 3600000 },
    { id: "12h", label: "Saa 12", ms: 12 * 3600000 },
    { id: "1d", label: "Siku 1", ms: DAY },
    { id: "1w", label: "Wiki 1", ms: 7 * DAY },
    { id: "1mo", label: "Mwezi 1", ms: 30 * DAY },
    { id: "3mo", label: "Miezi 3", ms: 91 * DAY },
    { id: "6mo", label: "Miezi 6", ms: 182 * DAY },
    { id: "1y", label: "Mwaka 1", ms: 365 * DAY }
  ];

  // Herufi za Unicode zenye mtindo (zinabaki zikiwa nzuri hata ukibandika kwenye SMS/WhatsApp)
  var STYLES = {
    script:     { name: "Mkono",        up: 0x1D4D0, lo: 0x1D4EA },
    bolditalic: { name: "Nzito iliyoinama", up: 0x1D468, lo: 0x1D482 },
    fraktur:    { name: "Kale",         up: 0x1D56C, lo: 0x1D586 },
    serifbold:  { name: "Nzito",        up: 0x1D400, lo: 0x1D41A },
    sansbold:   { name: "Nzito safi",   up: 0x1D5D4, lo: 0x1D5EE },
    plain:      { name: "Kawaida (SMS fupi)" }
  };
  var STYLE_ORDER = ["script", "bolditalic", "fraktur", "serifbold", "sansbold", "plain"];
  var HUES = [42, 330, 200, 150, 350, 48, 280, 24, 170, 215, 100, 260, 190, 12, 300];

  var $ = function (id) { return document.getElementById(id); };
  var V = window.VERSES || {};
  var LABELS = window.THEME_LABELS || {};
  var keys = Object.keys(V).filter(function (k) { return V[k] && V[k].length; });

  /* ---------- Hifadhi (localStorage, salama) ---------- */
  var mem = {};
  function load() {
    try { return JSON.parse(localStorage.getItem("mistari_v2")) || {}; } catch (e) { return mem; }
  }
  function save() {
    mem = state;
    try { localStorage.setItem("mistari_v2", JSON.stringify(state)); } catch (e) {}
  }
  var state = load();
  state.starts = state.starts || {};
  state.seen = state.seen || {};
  state.style = STYLES[state.style] ? state.style : "script";
  state.interval = INTERVALS.some(function (i) { return i.id === state.interval; }) ? state.interval : "20m";
  if (typeof state.adorn !== "boolean") state.adorn = true;
  state.greeting = state.greeting || "";
  state.sign = state.sign || "";

  /* ---------- Mwonekano (usiku/mchana) ---------- */
  var root = document.documentElement;
  var lightQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : { matches: false };
  function applyMode() { if (state.mode) root.setAttribute("data-mode", state.mode); else root.removeAttribute("data-mode"); }
  applyMode();
  $("modeBtn").onclick = function () {
    var isLight = state.mode ? state.mode === "light" : lightQuery.matches;
    state.mode = isLight ? "dark" : "light";
    save(); applyMode();
  };

  if (!keys.length) { $("setup").classList.remove("hidden"); registerSW(); return; }

  /* ---------- Zana ndogo ---------- */
  function intervalMs() {
    for (var i = 0; i < INTERVALS.length; i++) if (INTERVALS[i].id === state.interval) return INTERVALS[i].ms;
    return INTERVALS[0].ms;
  }
  function intervalLabel() {
    for (var i = 0; i < INTERVALS.length; i++) if (INTERVALS[i].id === state.interval) return INTERVALS[i].label;
    return "";
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmt(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    var t = (h > 0 || d > 0 ? pad(h) + ":" : "") + pad(m) + ":" + pad(s);
    return d > 0 ? d + (d === 1 ? " siku " : " siku ") + t : t;
  }
  function countFor(theme, now, noStart) {
    var list = V[theme];
    var start = state.starts[theme];
    if (!start) {
      if (noStart) return 0;
      start = state.starts[theme] = now; save();
    }
    return Math.min(list.length, 1 + Math.floor((now - start) / intervalMs()));
  }
  function hueOf(theme) { return HUES[keys.indexOf(theme) % HUES.length]; }

  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  function copyText(text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      toast(ok ? "Imenakiliwa" : "Imeshindikana kunakili");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Imenakiliwa"); }, fallback);
    } else { fallback(); }
  }

  /* ---------- Herufi za mtindo na ujumbe ---------- */
  function stylize(text) {
    var s = STYLES[state.style];
    if (!s || !s.up) return text;
    var out = "";
    for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c >= 65 && c <= 90) out += String.fromCodePoint(s.up + c - 65);
      else if (c >= 97 && c <= 122) out += String.fromCodePoint(s.lo + c - 97);
      else out += text.charAt(i);
    }
    return out;
  }
  function ascii(t) {
    return t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
            .replace(/[–—]/g, "-").replace(/…/g, "...");
  }
  function buildMessage(v) {
    var plain = state.style === "plain";
    var blocks = [];
    var g = state.greeting.trim();
    if (g) blocks.push(stylize(plain ? ascii(g) : g));
    if (!plain && state.adorn) blocks.push("✝");
    var body = plain ? ascii(v.t) : v.t;
    blocks.push((plain ? '"' : "“") + stylize(body) + (plain ? '"' : "”"));
    var tail = (plain ? "- " : "— ") + stylize(v.r) + "\n" + stylize("Biblia Takatifu");
    var sg = state.sign.trim();
    if (sg) tail += "\n" + (plain ? "- " : "~ ") + stylize(plain ? ascii(sg) : sg);
    blocks.push(tail);
    return blocks.join("\n\n");
  }
  function smsSegments(msg) {
    var gsm = /^[\x20-\x7E\n\r]*$/.test(msg);
    var n = msg.length; // UTF-16: herufi za mtindo huhesabiwa mbili
    if (gsm) return { n: n, seg: n <= 160 ? 1 : Math.ceil(n / 153), ucs: false };
    return { n: n, seg: n <= 70 ? 1 : Math.ceil(n / 67), ucs: true };
  }
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  /* ---------- Hali ya kuonyesha ---------- */
  var theme = state.theme && V[state.theme] ? state.theme : keys[0];
  var viewIdx = null;      // null = mstari mpya zaidi
  var lastN = -1;
  var histLimit = 20;
  var chipsSig = "";

  function currentIdx(n) {
    if (viewIdx === null) return n - 1;
    return Math.max(0, Math.min(viewIdx, n - 1));
  }

  /* ---------- Mada (chips) ---------- */
  function renderChips() {
    var nav = $("themes");
    var now = Date.now();
    nav.innerHTML = "";
    keys.forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = LABELS[k] || k;
      b.setAttribute("aria-pressed", k === theme ? "true" : "false");
      var started = countFor(k, now, true);
      if (k !== theme && started > (state.seen[k] || 0)) {
        var d = document.createElement("span"); d.className = "dot"; b.appendChild(d);
      }
      b.onclick = function () {
        theme = k; state.theme = k; viewIdx = null; histLimit = 20; lastN = -1;
        save(); tick(true);
        var act = nav.querySelector('[aria-pressed="true"]');
        if (act && act.scrollIntoView) act.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      };
      nav.appendChild(b);
    });
  }
  function chipsSignature() {
    var now = Date.now();
    return theme + "|" + keys.map(function (k) {
      return k !== theme && countFor(k, now, true) > (state.seen[k] || 0) ? 1 : 0;
    }).join("");
  }

  /* ---------- Kadi ya mstari ---------- */
  function renderVerse(animate) {
    var list = V[theme];
    var n = countFor(theme, Date.now());
    var idx = currentIdx(n);
    var cur = list[idx];

    root.style.setProperty("--hue", hueOf(theme));
    $("verseCard").classList.remove("hidden");
    $("composer").classList.remove("hidden");
    $("timerCard").classList.remove("hidden");
    $("themeLabel").textContent = LABELS[theme] || theme;
    $("counter").textContent = "Mstari " + (idx + 1) + " kati ya " + list.length;
    $("verseText").textContent = cur.t;
    $("verseRef").textContent = cur.r;
    if (animate) {
      var vc = $("verseCard");
      vc.classList.remove("fade-in"); void vc.offsetWidth; vc.classList.add("fade-in");
    }

    $("prevBtn").disabled = idx <= 0;
    $("nextBtn").disabled = idx >= n - 1;
    $("latestBtn").classList.toggle("hidden", idx >= n - 1);

    if (idx === n - 1) { state.seen[theme] = n; save(); }

    var msg = buildMessage(cur);
    $("preview").textContent = msg;
    var info = smsSegments(msg);
    $("smsNote").textContent = info.ucs
      ? "Herufi za mtindo huchukua nafasi mbili kila moja: SMS hii ni takriban " + info.seg +
        ". WhatsApp haina kikomo. Chagua \"Kawaida\" kwa SMS fupi."
      : "SMS hii ni takriban " + info.seg + (info.seg === 1 ? "." : " (ujumbe mrefu hugawanywa).");

    $("copyBtn").onclick = function () { copyText(msg); };
    $("smsBtn").href = "sms:" + (isIOS ? "&" : "?") + "body=" + encodeURIComponent(msg);
    $("waBtn").href = "https://wa.me/?text=" + encodeURIComponent(msg);
    if (navigator.share) {
      $("shareBtn").classList.remove("hidden");
      $("shareBtn").onclick = function () {
        navigator.share({ text: msg }).catch(function () {});
      };
    }
    renderHistory(n, list);
  }

  function renderHistory(n, list) {
    var h = $("history");
    h.innerHTML = "";
    var shown = 0;
    for (var i = n - 1; i >= 0 && shown < histLimit; i--, shown++) {
      (function (v, index) {
        var d = document.createElement("div"); d.className = "item";
        var t = document.createElement("div"); t.className = "t"; t.textContent = v.t;
        var r = document.createElement("div"); r.className = "r"; r.textContent = v.r;
        var row = document.createElement("div"); row.className = "row";
        var c = document.createElement("button"); c.type = "button"; c.textContent = "Nakili";
        c.onclick = function () { copyText(buildMessage(v)); };
        var o = document.createElement("button"); o.type = "button"; o.textContent = "Fungua";
        o.onclick = function () {
          viewIdx = index; renderVerse(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        };
        row.appendChild(c); row.appendChild(o);
        d.appendChild(t); d.appendChild(r); d.appendChild(row);
        h.appendChild(d);
      })(list[i], i);
    }
    $("historyBox").classList.toggle("hidden", n < 2);
    $("moreBtn").classList.toggle("hidden", n <= histLimit);
  }

  /* ---------- Chaguo la herufi ---------- */
  function renderStyles() {
    var box = $("styles");
    box.innerHTML = "";
    STYLE_ORDER.forEach(function (k) {
      var saved = state.style;
      state.style = k;
      var sample = k === "plain" ? "Aa" : stylize("Aa");
      state.style = saved;
      var b = document.createElement("button");
      b.type = "button"; b.className = "sty";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", k === state.style ? "true" : "false");
      b.innerHTML = '<span class="sample"></span><span class="nm"></span>';
      b.firstChild.textContent = sample;
      b.lastChild.textContent = STYLES[k].name;
      b.onclick = function () { state.style = k; save(); renderStyles(); renderVerse(false); };
      box.appendChild(b);
    });
  }

  /* ---------- Muda ---------- */
  function renderInterval() {
    var sel = $("interval");
    sel.innerHTML = "";
    INTERVALS.forEach(function (i) {
      var o = document.createElement("option");
      o.value = i.id; o.textContent = i.label;
      if (i.id === state.interval) o.selected = true;
      sel.appendChild(o);
    });
    sel.onchange = function () {
      var now = Date.now(), oldMs = intervalMs();
      var newIv = INTERVALS.filter(function (i) { return i.id === sel.value; })[0];
      // Hifadhi idadi ya mistari iliyofunguliwa kwa kila mada, anza hesabu upya
      Object.keys(state.starts).forEach(function (k) {
        var n = Math.min(V[k] ? V[k].length : 1, 1 + Math.floor((now - state.starts[k]) / oldMs));
        state.starts[k] = now - (n - 1) * newIv.ms;
      });
      state.interval = newIv.id; save();
      lastN = -1; tick(true);
      toast("Mstari mpya kila " + newIv.label.toLowerCase());
    };
  }

  function tick(force) {
    var now = Date.now();
    var list = V[theme];
    var n = countFor(theme, now);
    if (force || n !== lastN) {
      var grew = lastN !== -1 && n > lastN && viewIdx === null;
      lastN = n;
      renderVerse(grew || force === true);
      if (grew) toast("Mstari mpya umefunguka");
    }
    var sig = chipsSignature();
    if (sig !== chipsSig) { chipsSig = sig; renderChips(); }

    var ms = intervalMs(), start = state.starts[theme];
    $("unlockInfo").textContent = "Zimefunguliwa " + n + " kati ya " + list.length + " · kila " + intervalLabel().toLowerCase();
    var bar = $("barFill");
    if (n >= list.length) {
      $("countdown").textContent = "Mistari yote imefunguliwa";
      bar.style.width = "100%";
    } else {
      var into = (now - start) % ms;
      $("countdown").textContent = fmt(ms - into);
      bar.style.width = Math.min(100, (into / ms) * 100).toFixed(2) + "%";
      bar.parentNode.setAttribute("aria-valuenow", Math.round((into / ms) * 100));
    }
  }

  /* ---------- Vitufe na vidhibiti ---------- */
  $("prevBtn").onclick = function () {
    var n = countFor(theme, Date.now());
    viewIdx = Math.max(0, currentIdx(n) - 1); renderVerse(true);
  };
  $("nextBtn").onclick = function () {
    var n = countFor(theme, Date.now());
    var i = currentIdx(n) + 1;
    viewIdx = i >= n - 1 ? null : i; renderVerse(true);
  };
  $("latestBtn").onclick = function () { viewIdx = null; renderVerse(true); };
  $("moreBtn").onclick = function () { histLimit += 20; renderVerse(false); };
  $("resetBtn").onclick = function () {
    if (!window.confirm("Anza upya mada hii? Mstari wa kwanza tu ndio utabaki.")) return;
    state.starts[theme] = Date.now(); state.seen[theme] = 1; save();
    viewIdx = null; histLimit = 20; lastN = -1; tick(true);
  };
  $("greeting").value = state.greeting;
  $("signoff").value = state.sign;
  $("adorn").checked = state.adorn;
  $("greeting").oninput = function () { state.greeting = this.value; save(); renderVerse(false); };
  $("signoff").oninput = function () { state.sign = this.value; save(); renderVerse(false); };
  $("adorn").onchange = function () { state.adorn = this.checked; save(); renderVerse(false); };

  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowLeft") $("prevBtn").click();
    if (e.key === "ArrowRight") $("nextBtn").click();
  });

  /* ---------- Usakinishaji (PWA) na offline ---------- */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferredPrompt = e;
    $("installBtn").classList.remove("hidden");
  });
  $("installBtn").onclick = function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function () { deferredPrompt = null; $("installBtn").classList.add("hidden"); });
  };
  window.addEventListener("appinstalled", function () { $("installBtn").classList.add("hidden"); toast("Imesakinishwa"); });

  var standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
  if (isIOS && !standalone && !state.iosTipClosed) $("iosTip").classList.remove("hidden");
  $("iosTipClose").onclick = function () { state.iosTipClosed = true; save(); $("iosTip").classList.add("hidden"); };

  function registerSW() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function () {
        return navigator.serviceWorker.ready;
      }).then(function () {
        var b = $("offlineBadge"); if (b) b.classList.remove("hidden");
      }).catch(function () {});
    });
  }

  /* ---------- Anza ---------- */
  renderInterval();
  renderStyles();
  tick(true);
  setInterval(function () { tick(false); }, 1000);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) tick(false); });
  registerSW();
})();
