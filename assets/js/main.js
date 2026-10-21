document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (nav && navToggle && header) {
  const mobileNavigation = window.matchMedia("(max-width: 980px)");
  nav.id ||= "site-navigation";
  navToggle.setAttribute("aria-controls", nav.id);

  const setNavigationOpen = (open, returnFocus = false) => {
    const isOpen = open && mobileNavigation.matches;
    nav.classList.toggle("is-open", isOpen);
    header.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "關閉選單" : "開啟選單");
    nav.inert = mobileNavigation.matches && !isOpen;

    if (returnFocus && mobileNavigation.matches) navToggle.focus();
  };

  setNavigationOpen(false);

  navToggle.addEventListener("click", () => {
    setNavigationOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setNavigationOpen(false, true);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      event.preventDefault();
      setNavigationOpen(false, true);
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setNavigationOpen(false);
  });

  document.addEventListener("focusin", (event) => {
    if (!header.contains(event.target)) setNavigationOpen(false);
  });

  mobileNavigation.addEventListener("change", () => {
    const focusWillBeHidden = mobileNavigation.matches && nav.contains(document.activeElement);
    setNavigationOpen(false, focusWillBeHidden);
  });
}

const readings = {
  family: {
    title: "你最近比較像家裡的隊長，很多事都放在心裡自己處理。",
    label: "家庭狀態",
    state: "什麼都想自己扛",
    focus: "習慣先處理責任，較少替自己保留恢復空間。",
    need: "背部、肩頸與腹部放鬆",
    trait: "土系穩定或木系提振，依現場諮詢調整。",
    advice: "保留一段不被打斷的休息時間，讓身體慢慢回穩。"
  },
  work: {
    title: "你正在把很多期待轉成行動，但也容易忘記替自己保留恢復時間。",
    label: "工作狀態",
    state: "效率很高，壓力也很滿",
    focus: "行動快、要求高，頭頸與背肩容易長時間維持緊繃。",
    need: "頭、肩、頸與背部舒緩",
    trait: "火系循環律動或金系排引通暢，依疲勞感調整。",
    advice: "工作段落之間安排短休息，不讓肩頸一直維持緊繃。"
  },
  wealth: {
    title: "你對未來有很強的想像力，正在尋找更穩定的累積節奏。",
    label: "財運狀態",
    state: "想突破，也想安心",
    focus: "重視累積與掌控，需要更穩定的身體節奏支持決策。",
    need: "腹部、腿部與代謝節奏",
    trait: "土系暖腹助排或水系青春激活，依身體沉重感調整。",
    advice: "把保養排進行事曆，讓身體支持正在累積的計畫。"
  },
  social: {
    title: "你最近很在意關係中的回應，也正在學習更舒服地表達自己。",
    label: "人際狀態",
    state: "想靠近，也需要空間",
    focus: "感受細膩，關係裡的回應容易反映在前胸與肩頸。",
    need: "前胸、肩頸與手部放鬆",
    trait: "木系能量提振或水系修護，依情緒緊繃程度調整。",
    advice: "先讓呼吸和肩膀鬆下來，再回到需要溝通的事情。"
  }
};

document.querySelectorAll(".theme-switcher").forEach((tablist, listIndex) => {
  const themeButtons = [...tablist.querySelectorAll("[data-theme]")].filter(
    (button) => Object.hasOwn(readings, button.dataset.theme)
  );
  const panel = tablist.parentElement?.querySelector(".reading-card");
  if (!panel || !themeButtons.length) return;

  const fields = {
    title: panel.querySelector("[data-result-title]"),
    label: panel.querySelector("dt"),
    state: panel.querySelector("[data-result-state]"),
    focus: panel.querySelector("[data-result-focus]"),
    need: panel.querySelector("[data-result-need]"),
    trait: panel.querySelector("[data-result-trait]"),
    advice: panel.querySelector("[data-result-advice]")
  };
  if (Object.values(fields).some((node) => !node)) return;

  tablist.setAttribute("role", "tablist");
  panel.id ||= `reading-panel-${listIndex + 1}`;
  panel.setAttribute("role", "tabpanel");
  panel.tabIndex = 0;

  const activateTheme = (button, moveFocus = false) => {
    const reading = readings[button.dataset.theme];
    themeButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    panel.setAttribute("aria-labelledby", button.id);
    Object.entries(fields).forEach(([key, node]) => {
      node.textContent = reading[key];
    });
    if (moveFocus) button.focus();
  };

  themeButtons.forEach((button, index) => {
    button.id ||= `reading-tab-${listIndex + 1}-${button.dataset.theme}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", panel.id);
    button.addEventListener("click", () => activateTheme(button));
    button.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      let nextIndex;

      switch (event.key) {
        case "ArrowRight":
          nextIndex = (index + 1) % themeButtons.length;
          break;
        case "ArrowLeft":
          nextIndex = (index - 1 + themeButtons.length) % themeButtons.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = themeButtons.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      activateTheme(themeButtons[nextIndex], true);
    });
  });

  activateTheme(themeButtons.find((button) => button.getAttribute("aria-selected") === "true") || themeButtons[0]);
});
