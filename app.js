(function () {
  var INTERVAL = 20 * 60 * 1000; // dakika 20
  var V = window.VERSES || {};
  var LABELS = window.THEME_LABELS || {};
  var keys = Object.keys(V).filter(function (k) { return V[k] && V[k].length; });

  var $ = function (id) { return document.getElementById(id); };

  if (!keys.length) { $("setup").classList.remove("hidden"); return; }

  function load() {
    try { return JSON.parse(localStorage.getItem("mistari_state")) || {}; } catch (e) { return {}; }
  }
  function save(s) {
    try { localStorage.setItem("mistari_state", JSON.stringify(s)); } catch (e) {}
  }

  var state = load();
  var theme = state.theme && V[state.theme] ? state.theme : keys[0];
  state.starts = state.starts || {};

  // Herufi za Unicode zenye mtindo: zinabaki zikiwa nzito/za kupendeza hata ukibandika kwenye SMS
  var STYLES = {
    script: { name: "Mkono (bold script)", up: 0x1D4D0, lo: 0x1D4EA },
    serif:  { name: "Nzito ya kawaida (bold)", up: 0x1D400, lo: 0x1D41A },
    fraktur:{ name: "Kale (bold fraktur)", up: 0x1D56C, lo: 0x1D586 },
    sans:   { name: "Nzito safi (sans bold)", up: 0x1D5D4, lo: 0x1D5EE },
    plain:  { name: "Kawaida" }
  };
  state.style = STYLES[state.style] ? state.style : "script";

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

  function formatVerse(v) {
    return "“" + stylize(v.t) + "”\n\n— " + stylize(v.r) + "\n" + stylize("Biblia Takatifu");
  }

  (function setupStyle() {
    var sel = $("styleSel");
    if (!sel) return;
    Object.keys(STYLES).forEach(function (k) {
      var o = document.createElement("option");
      o.value = k; o.textContent = STYLES[k].name;
      if (k === state.style) o.selected = true;
      sel.appendChild(o);
    });
    sel.onchange = function () { state.style = sel.value; save(state); shown = -1; render(); };
  })();

  function toast() {
    var t = $("toast");
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 1500);
  }

  function copy(text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast(); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(toast, fallback);
    } else { fallback(); }
  }

  function unlocked() {
    var list = V[theme];
    if (!state.starts[theme]) { state.starts[theme] = Date.now(); save(state); }
    var elapsed = Date.now() - state.starts[theme];
    var n = 1 + Math.floor(elapsed / INTERVAL);
    return Math.min(n, list.length);
  }

  function renderThemes() {
    var nav = $("themes");
    nav.innerHTML = "";
    keys.forEach(function (k) {
      var b = document.createElement("button");
      b.textContent = LABELS[k] || k;
      if (k === theme) b.className = "active";
      b.onclick = function () { theme = k; state.theme = k; save(state); renderThemes(); render(); };
      nav.appendChild(b);
    });
  }

  function render() {
    var list = V[theme];
    var n = unlocked();
    var cur = list[n - 1];
    $("current").classList.remove("hidden");
    $("themeLabel").textContent = LABELS[theme] || theme;
    $("verseText").textContent = stylize(cur.t);
    $("verseRef").textContent = stylize(cur.r);
    $("copyBtn").onclick = function () { copy(formatVerse(cur)); };
    $("smsBtn").href = "sms:?body=" + encodeURIComponent(formatVerse(cur));
    $("progress").textContent = "Mstari " + n + " kati ya " + list.length;

    var h = $("history");
    h.innerHTML = "";
    for (var i = n - 2; i >= 0; i--) {
      (function (v) {
        var d = document.createElement("div");
        d.className = "item";
        var p = document.createElement("div");
        p.textContent = v.t;
        var r = document.createElement("div");
        r.className = "ref";
        r.textContent = v.r;
        var b = document.createElement("button");
        b.textContent = "Nakili";
        b.onclick = function () { copy(formatVerse(v)); };
        d.appendChild(p); d.appendChild(r); d.appendChild(b);
        h.appendChild(d);
      })(list[i]);
    }
    $("historyBox").classList.toggle("hidden", n < 2);
  }

  var shown = -1;
  function tick() {
    var list = V[theme];
    var n = unlocked();
    if (n !== shown) { shown = n; render(); }
    if (n >= list.length) { $("countdown").textContent = "Mistari yote imefunguliwa"; return; }
    var left = INTERVAL - ((Date.now() - state.starts[theme]) % INTERVAL);
    var m = Math.floor(left / 60000), s = Math.floor((left % 60000) / 1000);
    $("countdown").textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  var origRender = renderThemes;
  renderThemes = function () { shown = -1; origRender(); };

  renderThemes();
  tick();
  setInterval(tick, 1000);
})();
