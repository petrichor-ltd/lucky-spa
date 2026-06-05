# 幸運竹 SPA Static Website

這是一個可直接部署到 GitHub Pages 的靜態官網。

## 結構

- `index.html`: 首頁入口、SEO metadata、導覽與主體驗摘要。
- `experience.html`: 五感體驗、入店儀式與空間語彙。
- `courses.html`: MIT 幸運竹、五行精油與節氣課程。
- `insights.html`: 能量遊戲導入、結果解讀與九宮格狀態語彙。
- `resources.html`: 使用者可閱讀與下載的 PDF 資料頁。
- `assets/css/styles.css`: 視覺系統、響應式版面、互動動畫。
- `assets/js/main.js`: 行動選單與「能量解讀」主題切換。
- `assets/pdf/`: 由簡報與文件轉出的 PDF，以及既有產品 PDF。
- `img/`: 網站主視覺與參考圖片素材。
- `img/hero-reception-crop.jpg`: 由原始接待空間圖裁切出的 hero 專用圖，避免首屏露出圖內流程文字。
- `img/contact-entrance-crop.jpg`: 由入口空間圖裁切出的 contact 背景圖，保留迎賓氛圍並移除底部資訊卡。
- `assets/resource/`: 本機整理用原始資料，不部署到 GitHub Pages；公開網站只提供 `assets/pdf/` 中整理後的 PDF。

## 部署

將此資料夾推到 GitHub repository 後，在 GitHub Pages 選擇 repository root 作為發布來源即可。

## 後續擴充方向

- 將 Canva 遊戲連結替換成正式遊戲 URL 或自建互動頁。
- 將 `main.js` 的 `readings` 物件擴充成更多主題、分數區間與療程建議。
- 新增預約表單、CRM、GA4 或 Meta Pixel 等追蹤整合。
- 將 `img/` 中圖片另存 WebP/AVIF，提升載入速度。
