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
    need: "學會放下一些",
    trait: "行動快、責任感重，常把壓力先收在自己身上。",
    advice: "放慢一點，讓信任的人一起分擔。"
  },
  work: {
    title: "你正在把很多期待轉成行動，但也容易忘記替自己保留恢復時間。",
    label: "工作狀態",
    state: "效率很高，壓力也很滿",
    need: "建立界線與清楚優先順序",
    trait: "擅長推進，也容易把身體訊號放到最後。",
    advice: "先定三件重要的事，留一段恢復時間。"
  },
  wealth: {
    title: "你對未來有很強的想像力，正在尋找更穩定的累積節奏。",
    label: "財運狀態",
    state: "想突破，也想安心",
    need: "讓計畫回到可執行",
    trait: "看得見機會，也需要更穩的節奏。",
    advice: "把大目標拆小，讓每週都有可確認的前進。"
  },
  social: {
    title: "你最近很在意關係中的回應，也正在學習更舒服地表達自己。",
    label: "人際狀態",
    state: "想靠近，也需要空間",
    need: "把真實感受說清楚",
    trait: "感受力細膩，常先照顧別人的情緒。",
    advice: "先確認自己的界線，再溫柔表達期待。"
  }
};

const themeButtons = document.querySelectorAll("[data-theme]");
const titleNode = document.querySelector("[data-result-title]");
const stateLabelNode = document.querySelector(".reading-card dt");
const stateNode = document.querySelector("[data-result-state]");
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
    needNode.textContent = reading.need;
    traitNode.textContent = reading.trait;
    adviceNode.textContent = reading.advice;
  });
});
