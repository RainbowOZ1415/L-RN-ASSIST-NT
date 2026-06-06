(function () {
  if (window.__laSoundEngine) return;
  window.__laSoundEngine = true;

  var VOL = { click: 0.22, entry: 0.25, delete: 0.23, swipe: 0.18 };
  var deleteRe = /verwerfen|leeren|entfernen|löschen|delete/i;
  var swipeCooldown = 0;
  var entryPlayed = sessionStorage.getItem("la_entry_ok") === "1";

  function soundUrl(name) {
    return new URL("app/static/sounds/" + name + ".wav", window.location.origin).href;
  }

  function getSound(name) {
    if (!window.__laSounds) window.__laSounds = {};
    if (!window.__laSounds[name]) {
      var a = new Audio(soundUrl(name));
      a.volume = VOL[name] || 0.2;
      a.preload = "auto";
      window.__laSounds[name] = a;
    }
    return window.__laSounds[name];
  }

  function unlock() {
    if (window.__laUnlocked) return;
    window.__laUnlocked = true;
    Object.keys(VOL).forEach(function (k) {
      var a = getSound(k);
      a.play().then(function () {
        a.pause();
        a.currentTime = 0;
      }).catch(function () {});
    });
  }

  function play(name) {
    var a = getSound(name);
    a.currentTime = 0;
    return a.play().catch(function () {});
  }

  function playEntry() {
    if (entryPlayed) return;
    play("entry").then(function () {
      entryPlayed = true;
      sessionStorage.setItem("la_entry_ok", "1");
    });
  }

  function playSwipe() {
    var now = Date.now();
    if (now - swipeCooldown < 100) return;
    swipeCooldown = now;
    play("swipe");
  }

  function inDropdownList(target) {
    return !!(target && target.closest &&
      target.closest('[role="listbox"], [data-baseweb="popover"]'));
  }

  function isDeleteAction(target) {
    if (target.closest('[data-baseweb="tag"]') &&
      target.closest("button, [role='button']")) return true;
    var btn = target.closest("button");
    if (!btn) return false;
    var label = (btn.innerText || btn.textContent || "").trim();
    if (deleteRe.test(label)) return true;
    var hint = (btn.getAttribute("aria-label") || btn.getAttribute("title") || "").toLowerCase();
    return /remove|löschen|entfernen|clear tag|delete tag/.test(hint);
  }

  document.addEventListener("click", function (e) {
    unlock();
    playEntry();
    if (e.target.closest('[role="option"]')) { play("click"); return; }
    if (isDeleteAction(e.target)) { play("delete"); return; }
    if (e.target.closest("button")) play("click");
  }, true);

  document.addEventListener("wheel", function (e) {
    if (inDropdownList(e.target)) playSwipe();
  }, { capture: true, passive: true });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    if (document.querySelector('[data-baseweb="popover"]:not([hidden])') ||
      e.target.closest('[data-baseweb="select"]')) playSwipe();
  }, true);

  var lastHighlight = null;
  new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.type !== "attributes") return;
      if (m.attributeName === "aria-selected") {
        var el = m.target;
        if (el.getAttribute("aria-selected") === "true" && el !== lastHighlight) {
          lastHighlight = el;
          playSwipe();
        }
      }
      if (m.attributeName === "aria-activedescendant") playSwipe();
    });
  }).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-selected", "aria-activedescendant"],
  });

  playEntry();
})();
