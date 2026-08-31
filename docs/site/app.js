(function () {
  const STORE = "duster-workshop-v1";
  const LANG_KEY = "duster-lang";
  const UNIT_KEY = "duster-units";

  const SHOP = [
    { g: "buyWood", items: [
      { id: "ply", t: "buyPly", n: "buyPlyN" },
      { id: "band", t: "buyBand", n: "buyBandN" },
      { id: "felt", t: "buyFelt", n: "buyFeltN" },
      { id: "cleat", t: "buyCleat", n: "buyCleatN" },
    ]},
    { g: "buyHw", items: [
      { id: "h1", t: "buyHinge1", n: "buyHinge1N" },
      { id: "h2", t: "buyHinge2", n: "buyHinge2N" },
      { id: "h3", t: "buyHinge3", n: "buyHinge3N" },
      { id: "butt", t: "buyButt", n: "buyButtN" },
      { id: "stay", t: "buyStay", n: "buyStayN" },
      { id: "bolt", t: "buyBolt", n: "buyBoltN" },
    ]},
    { g: "buyFast", items: [
      { id: "s1", t: "buyScr1", n: "buyScr1N" },
      { id: "s2", t: "buyScr2", n: "buyScr2N" },
      { id: "br", t: "buyBrkt", n: "buyBrktN" },
      { id: "glue", t: "buyGlue", n: "buyGlueN" },
    ]},
    { g: "buySoft", items: [
      { id: "st", t: "buyStrap", n: "buyStrapN" },
      { id: "lp", t: "buyLoop", n: "buyLoopN" },
      { id: "mt", t: "buyMatt", n: "buyMattN" },
      { id: "pd", t: "buyPad", n: "buyPadN" },
    ]},
    { g: "buyTools", items: [
      { id: "tool", t: "buyTool", n: "buyToolN" },
    ]},
  ];

  const qLang = new URLSearchParams(location.search).get("lang");
  let lang = (qLang === "en" || qLang === "ca") ? qLang : (localStorage.getItem(LANG_KEY) || guessLang());
  let units = localStorage.getItem(UNIT_KEY) || "mm";
  let state = loadState();

  function guessLang() {
    const n = (navigator.language || "en").toLowerCase();
    return n.startsWith("ca") ? "ca" : "en";
  }

  function t(key) {
    const pack = window.I18N[lang] || window.I18N.en;
    return pack[key] != null ? pack[key] : window.I18N.en[key] || key;
  }

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}"); }
    catch { return {}; }
  }

  function saveState() {
    localStorage.setItem(STORE, JSON.stringify(state));
  }

  function fmtLen(mm) {
    if (units === "cm") {
      const n = mm / 10;
      const s = Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", lang === "ca" ? "," : ".");
      return s + " cm";
    }
    return Math.round(mm) + " mm";
  }

  function parseInput(raw) {
    if (raw == null || String(raw).trim() === "") return null;
    const n = parseFloat(String(raw).replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) return null;
    return units === "cm" ? n * 10 : n;
  }

  function applyI18n() {
    const pack = window.I18N[lang] || window.I18N.en;
    document.documentElement.lang = pack.htmlLang;
    document.title = pack.title;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (pack[key] != null) el.textContent = pack[key];
    });
    document.getElementById("lang-en").classList.toggle("on", lang === "en");
    document.getElementById("lang-ca").classList.toggle("on", lang === "ca");
    document.getElementById("u-mm").classList.toggle("on", units === "mm");
    document.getElementById("u-cm").classList.toggle("on", units === "cm");
    document.querySelectorAll(".need[data-need-mm]").forEach((el) => {
      el.textContent = "≥ " + fmtLen(Number(el.dataset.needMm));
    });
    renderShop();
    renderCuts();
    refreshViewer();
    fillSavedMeasures();
    updateNeedPlaceholders();
  }

  function updateNeedPlaceholders() {
    document.querySelectorAll("#fit-form input").forEach((inp) => {
      inp.placeholder = units === "cm" ? "cm" : "mm";
    });
  }

  function refreshViewer() {
    const frame = document.getElementById("viewer");
    const next = "../viewer/index.html?lang=" + lang;
    if (!frame.dataset.boot) {
      frame.src = next;
      frame.dataset.boot = "1";
      return;
    }
    if (frame.getAttribute("src") !== next) frame.src = next;
  }

  function renderShop() {
    const host = document.getElementById("shop");
    const ticked = state.shop || {};
    host.innerHTML = "";
    let total = 0;
    let done = 0;
    SHOP.forEach((block) => {
      const wrap = document.createElement("div");
      wrap.className = "shop-block";
      wrap.innerHTML = "<h3>" + t(block.g) + "</h3>";
      block.items.forEach((it) => {
        total += 1;
        if (ticked[it.id]) done += 1;
        const row = document.createElement("label");
        row.className = "shop-item" + (ticked[it.id] ? " done" : "");
        row.innerHTML =
          "<input type='checkbox'" + (ticked[it.id] ? " checked" : "") + " />" +
          "<span>" + t(it.t) + "</span>" +
          "<span class='qty'>" + t(it.n) + "</span>";
        row.querySelector("input").addEventListener("change", (e) => {
          ticked[it.id] = e.target.checked;
          state.shop = ticked;
          saveState();
          renderShop();
        });
        wrap.appendChild(row);
      });
      host.appendChild(wrap);
    });
    document.getElementById("shop-count").textContent = String(done);
    document.getElementById("shop-total").textContent = String(total);
  }

  function woodFill(g, feat) {
    if (feat === "wing") return { fill: "#b7d2be", stroke: "#2f5d3a", grain: "#7fa88a" };
    if (g === "deck") return { fill: "#d2b48a", stroke: "#5a4030", grain: "#b08960" };
    if (g === "frame") return { fill: "#a8b4c2", stroke: "#2c3a4a", grain: "#7d8b99" };
    return { fill: "#d8c09a", stroke: "#5a4030", grain: "#b8956a" };
  }

  function partSvg(p) {
    const VW = 280;
    const VH = 168;
    const left = 36;
    const top = 10;
    const right = 12;
    const bot = 28;
    const max = Math.max(p.w, p.h);
    const dw = Math.max(16, ((VW - left - right) * p.w) / max);
    const dh = Math.max(10, ((VH - top - bot) * p.h) / max);
    const x = left + (VW - left - right - dw) / 2;
    const y = top + (VH - top - bot - dh) / 2;
    const sx = dw / p.w;
    const sy = dh / p.h;
    const c = woodFill(p.g, p.feat);
    const uid = p.id + "-" + p.qty;
    let inner = "";
    if (p.feat === "slots") {
      const slots = [[80, 40], [800 - 120, 40], [80, 320 - 48], [800 - 120, 320 - 48]];
      slots.forEach(([hx, hy]) => {
        inner += "<rect x='" + (x + hx * sx) + "' y='" + (y + hy * sy) + "' width='" + (40 * sx) + "' height='" + Math.max(3, 8 * sy) + "' fill='#f3ead6' stroke='" + c.stroke + "' stroke-width='0.8'/>";
      });
    }
    if (p.feat === "finger") {
      inner += "<rect x='" + (x + dw / 2 - 18) + "' y='" + (y + dh / 2 - 6) + "' width='36' height='12' rx='6' fill='#f3ead6' stroke='" + c.stroke + "' stroke-width='0.8'/>";
    }
    if (p.feat === "hole") {
      inner += "<circle cx='" + (x + dw / 2) + "' cy='" + (y + dh / 2) + "' r='6' fill='#f3ead6' stroke='" + c.stroke + "' stroke-width='0.8'/>";
    }
    if (p.feat === "socket") {
      inner += "<path d='M " + (x + 4) + " " + (y + 4) + " H " + (x + dw - 4) + " V " + (y + dh - 4) + " H " + (x + 4) + " V " + (y + dh * 0.35) + " H " + (x + dw * 0.35) + " V " + (y + dh * 0.65) + " H " + (x + 4) + " Z' fill='#f3ead6' stroke='" + c.stroke + "' stroke-width='0.8'/>";
    }
    const grain = [0.18, 0.38, 0.58, 0.78].map((t, i) => {
      const gx = x + 6 + i * 7;
      return "<path d='M " + gx + " " + (y + 3) + " C " + (gx + 8) + " " + (y + dh * 0.35) + ", " + (gx - 6) + " " + (y + dh * 0.65) + ", " + (gx + 4) + " " + (y + dh - 3) + "' fill='none' stroke='" + c.grain + "' stroke-width='1.2' opacity='0.35'/>";
    }).join("");
    const dimW = fmtLen(p.w);
    const dimH = fmtLen(p.h);
    return (
      "<svg class='part-svg' viewBox='0 0 " + VW + " " + VH + "' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>" +
      "<defs><linearGradient id='g-" + uid + "' x1='0' y1='0' x2='0' y2='1'>" +
      "<stop offset='0' stop-color='#fff6e8' stop-opacity='0.35'/><stop offset='1' stop-color='#000' stop-opacity='0.08'/>" +
      "</linearGradient></defs>" +
      "<rect x='" + x + "' y='" + y + "' width='" + dw + "' height='" + dh + "' rx='3' fill='" + c.fill + "' stroke='" + c.stroke + "' stroke-width='1.6'/>" +
      grain +
      "<rect x='" + x + "' y='" + y + "' width='" + dw + "' height='" + dh + "' rx='3' fill='url(#g-" + uid + ")'/>" +
      inner +
      "<line x1='" + x + "' y1='" + (y + dh + 10) + "' x2='" + (x + dw) + "' y2='" + (y + dh + 10) + "' stroke='#5c5146' stroke-width='1'/>" +
      "<line x1='" + x + "' y1='" + (y + dh + 6) + "' x2='" + x + "' y2='" + (y + dh + 14) + "' stroke='#5c5146'/>" +
      "<line x1='" + (x + dw) + "' y1='" + (y + dh + 6) + "' x2='" + (x + dw) + "' y2='" + (y + dh + 14) + "' stroke='#5c5146'/>" +
      "<text x='" + (x + dw / 2) + "' y='" + (y + dh + 22) + "' text-anchor='middle' fill='#1f1a14' font-size='11' font-family='Segoe UI,sans-serif'>" + dimW + "</text>" +
      "<line x1='" + (x - 10) + "' y1='" + y + "' x2='" + (x - 10) + "' y2='" + (y + dh) + "' stroke='#5c5146' stroke-width='1'/>" +
      "<line x1='" + (x - 14) + "' y1='" + y + "' x2='" + (x - 6) + "' y2='" + y + "' stroke='#5c5146'/>" +
      "<line x1='" + (x - 14) + "' y1='" + (y + dh) + "' x2='" + (x - 6) + "' y2='" + (y + dh) + "' stroke='#5c5146'/>" +
      "<text x='" + (x - 16) + "' y='" + (y + dh / 2 + 4) + "' text-anchor='end' fill='#1f1a14' font-size='11' font-family='Segoe UI,sans-serif'>" + dimH + "</text>" +
      "</svg>"
    );
  }

  function renderCuts() {
    const host = document.getElementById("cuts");
    const groups = [
      { id: "box", title: t("cutGroupBox") },
      { id: "deck", title: t("cutGroupDeck") },
      { id: "frame", title: t("cutGroupFrame") },
    ];
    host.innerHTML = "";
    groups.forEach((g) => {
      const box = document.createElement("div");
      box.className = "cut-group";
      box.innerHTML = "<h3>" + g.title + "</h3><div class='cut-grid'></div>";
      const grid = box.querySelector(".cut-grid");
      window.PARTS.filter((p) => p.g === g.id).forEach((p) => {
        const card = document.createElement("article");
        card.className = "cut-card " + p.g + (p.feat === "wing" ? " wing" : "");
        card.innerHTML =
          partSvg(p) +
          "<div class='name'>" + p.id + "  ×" + p.qty + "</div>" +
          "<div class='size'>" + fmtLen(p.w) + " × " + fmtLen(p.h) + " × 15 mm</div>" +
          "<div class='note'>" + (lang === "ca" ? p.ca : p.en) + "</div>";
        grid.appendChild(card);
      });
      host.appendChild(box);
    });
  }

  function fillSavedMeasures() {
    const form = document.getElementById("fit-form");
    const m = state.measure || {};
    ["A", "B", "G", "C", "W1"].forEach((id) => {
      const inp = form.elements[id];
      if (!inp) return;
      if (m[id] == null) {
        inp.value = "";
        return;
      }
      inp.value = units === "cm"
        ? (m[id] / 10).toFixed(m[id] % 10 === 0 ? 0 : 1)
        : String(Math.round(m[id]));
    });
    if (Object.keys(m).length) runFit(false);
  }

  function runFit(save) {
    const form = document.getElementById("fit-form");
    const got = {};
    ["A", "B", "G", "C", "W1"].forEach((id) => {
      got[id] = parseInput(form.elements[id].value);
    });
    if (save) {
      state.measure = got;
      saveState();
    }

    const checks = {
      A: { need: 960, warn: 970 },
      B: { need: 820, warn: 840 },
      G: { need: 330, warn: 350 },
      C: { need: 1900, warn: 1920 },
      W1: { need: 1320, warn: 1340 },
    };

    let filled = 0;
    let fails = 0;
    let tights = 0;
    form.querySelectorAll(".m-row").forEach((row) => {
      const name = row.querySelector("input").name;
      const lamp = row.querySelector(".lamp");
      const v = got[name];
      lamp.className = "lamp";
      if (v == null) return;
      filled += 1;
      const c = checks[name];
      if (v < c.need) {
        lamp.classList.add("no");
        fails += 1;
      } else if (v < c.warn) {
        lamp.classList.add("warn");
        tights += 1;
      } else {
        lamp.classList.add("ok");
      }
    });

    const verdict = document.getElementById("verdict");
    const advice = document.getElementById("advice");
    const list = document.getElementById("advice-list");
    list.innerHTML = "";

    if (filled === 0) {
      verdict.className = "verdict wait";
      verdict.textContent = t("fitWait");
      advice.hidden = true;
      return;
    }

    let tone = "pass";
    let msg = t("fitPass");
    if (fails) {
      tone = "fail";
      msg = t("fitFail");
    } else if (tights) {
      tone = "tight";
      msg = t("fitTight");
    }
    verdict.className = "verdict " + tone;
    verdict.textContent = msg;

    function add(text) {
      const li = document.createElement("li");
      li.textContent = text;
      list.appendChild(li);
    }

    if (got.A != null) {
      add(got.A < 960 ? t("fitBoxShrink").replace("{n}", fmtLen(got.A - 20)) : t("fitBoxOk"));
    }
    if (got.B != null && got.B >= 820) add(t("fitDepthOk"));
    if (got.G != null) add(got.G < 330 ? t("fitShelfLow") : t("fitShelfOk"));
    if (got.C != null) {
      add(got.C < 1900 ? t("fitBedShort").replace("{n}", fmtLen(got.C)) : t("fitBedOk"));
    }
    if (got.W1 != null) {
      add(got.W1 < 1320 ? t("fitWingShrink").replace("{n}", fmtLen(got.W1 - 20)) : t("fitWingOk"));
    }
    advice.hidden = list.children.length === 0;
  }

  function setLang(next) {
    lang = next;
    localStorage.setItem(LANG_KEY, lang);
    applyI18n();
  }

  function setUnits(next) {
    units = next;
    localStorage.setItem(UNIT_KEY, units);
    applyI18n();
  }

  document.getElementById("lang-en").addEventListener("click", () => setLang("en"));
  document.getElementById("lang-ca").addEventListener("click", () => setLang("ca"));
  document.getElementById("u-mm").addEventListener("click", () => setUnits("mm"));
  document.getElementById("u-cm").addEventListener("click", () => setUnits("cm"));
  document.getElementById("print").addEventListener("click", () => window.print());
  document.getElementById("fit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    runFit(true);
  });
  document.getElementById("fit-clear").addEventListener("click", () => {
    state.measure = {};
    saveState();
    fillSavedMeasures();
    document.getElementById("verdict").className = "verdict wait";
    document.getElementById("verdict").textContent = t("fitWait");
    document.getElementById("advice").hidden = true;
    document.querySelectorAll(".lamp").forEach((el) => { el.className = "lamp"; });
  });

  const links = [...document.querySelectorAll(".nav a")];
  const secs = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  function spy() {
    let cur = secs[0];
    const y = window.scrollY + 120;
    secs.forEach((s) => { if (s.offsetTop <= y) cur = s; });
    links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + cur.id));
  }
  window.addEventListener("scroll", spy, { passive: true });

  applyI18n();
  spy();
})();
