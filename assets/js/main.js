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
    trait: "你是行動派，習慣用實際成果證明自己。獨立、果敢，不喜歡拖泥帶水。",
    advice: "嘗試慢下來聆聽內心聲音，適時尋求合作會讓成果加倍。"
  },
  work: {
    title: "你正在把很多期待轉成行動，但也容易忘記替自己保留恢復時間。",
    label: "工作狀態",
    state: "效率很高，壓力也很滿",
    need: "建立界線與清楚優先順序",
    trait: "你擅長推進任務，對結果敏感，能在混亂中快速找到方向。",
    advice: "把待辦拆成三個層級，先完成最能帶來安定感的事，再安排短暫放鬆。"
  },
  wealth: {
    title: "你對未來有很強的想像力，正在尋找更穩定的累積節奏。",
    label: "財運狀態",
    state: "想突破，也想安心",
    need: "讓計畫回到可執行",
    trait: "你對機會有直覺，也願意投入資源，但需要更清楚地衡量節奏。",
    advice: "把大目標轉成每週可確認的進度，搭配能讓心緒沉澱的療癒儀式。"
  },
  social: {
    title: "你最近很在意關係中的回應，也正在學習更舒服地表達自己。",
    label: "人際狀態",
    state: "想靠近，也需要空間",
    need: "把真實感受說清楚",
    trait: "你能感受他人的情緒變化，容易照顧大家，卻偶爾忽略自己的需求。",
    advice: "先確認自己的界線，再用溫和但明確的方式提出期待，關係會更輕鬆。"
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
