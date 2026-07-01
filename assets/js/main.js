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
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    header.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "關閉選單" : "開啟選單");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      header.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "開啟選單");
    });
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

const themeButtons = document.querySelectorAll("[data-theme]");
const titleNode = document.querySelector("[data-result-title]");
const stateLabelNode = document.querySelector(".reading-card dt");
const stateNode = document.querySelector("[data-result-state]");
const focusNode = document.querySelector("[data-result-focus]");
const needNode = document.querySelector("[data-result-need]");
const traitNode = document.querySelector("[data-result-trait]");
const adviceNode = document.querySelector("[data-result-advice]");

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.theme;
    const reading = readings[key];
    if (!reading) return;

    themeButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
    });

    titleNode.textContent = reading.title;
    stateLabelNode.textContent = reading.label;
    stateNode.textContent = reading.state;
    focusNode.textContent = reading.focus;
    needNode.textContent = reading.need;
    traitNode.textContent = reading.trait;
    adviceNode.textContent = reading.advice;
  });
});
