# 幸運竹 SPA 靜態網站

繁體中文 SPA 品牌官網，可直接以靜態檔案部署到 GitHub Pages，無須建置、套件安裝、API 金鑰或資料庫。

## 檔案結構

- `index.html`：首頁、品牌素材、療程摘要、服務流程、諮詢入口與互動狀態示例。
- `experience.html`、`courses.html`、`insights.html`、`resources.html`：服務流程、課程精油、遊戲諮詢與 PDF 下載。
- `assets/css/styles.css`：共用樣式；`assets/css/homepage.css`：首頁視覺與響應式版面。`home.css` 為保留的舊版樣式，現行頁面未引用。
- `assets/js/main.js`：共用導覽與首頁的狀態切換，支援鍵盤與行動選單，使用原生 JavaScript。
- `assets/img/*.webp`：由三張新品牌海報與既有圖片等比例縮放、壓縮的 WebP 圖片（保留原始構圖）；首頁以 `srcset`、尺寸屬性與延後載入減少傳輸與版面位移。
- `assets/img/`、`img/`：保留的原始品牌與空間圖片；部分由延伸頁使用。
- `assets/pdf/`：公開可閱讀及下載的九份 PDF。
- `robots.txt`、`sitemap.xml`：公開頁面的搜尋引擎索引資訊。
- `CNAME`：正式網域 `lucky-spa.petrichor.tw`。
- `scripts/check_site.py`：不依賴第三方套件的靜態檢查。

首頁圖片來自 `/Users/ycliao/Downloads/material/`，原始文件不需隨網站部署。只引用專案內的相對路徑，瀏覽器不會讀取本機素材目錄。

## 本機預覽與檢查

使用 Python 3.9 以上版本，在專案根目錄執行：

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

開啟 `http://127.0.0.1:4173/`。另開終端機執行：

```sh
python3 scripts/check_site.py
```

靜態檢查涵蓋五個頁面的本機連結與錨點、CSS 圖片路徑、PDF 檔頭、首頁圖片尺寸及響應式來源、SEO 網域與 Sitemap。發布前也應用瀏覽器檢查桌機、平板與手機寬度，確認導覽、鍵盤操作、狀態切換、圖片載入與外部遊戲入口。靜態檢查不會確認外部服務是否在線。

## 部署

將檔案提交至 GitHub repository，於 GitHub Pages 選擇正確的發布分支與根目錄。保留 `CNAME` 並確認 DNS 與 HTTPS 設定。若更換網域，請同步更新首頁的 canonical、Open Graph、Twitter 圖片網址，以及 `robots.txt`、`sitemap.xml`。

網站透過 Google Fonts 載入字體，並保留系統字體作為備援。預約入口使用 `mailto:ubodyspa@gmail.com`；接球遊戲連至外部 Canva 網站。部署後請確認電子郵件與外部遊戲目的地仍符合實際營運需求。

不要將原始簡報或私人資料加入公開 repository。`.gitignore` 會忽略 `assets/resource/`、PowerPoint 暫存與來源檔；已追蹤的檔案仍會公開，部署前應檢查提交內容。
