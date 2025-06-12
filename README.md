
# LoveUnlock - 每日歌曲解鎖

LoveUnlock 是一個充滿愛意的小應用，讓您可以每天透過回答一個特別的問題來為您的摯愛解鎖一首歌曲。每一首解鎖的歌曲都伴隨著一段獨特的回憶或留言，為彼此的每一天增添甜蜜與驚喜。

## ✨ 核心功能

*   **每日問題挑戰**：
    *   應用程式每天會顯示一個預設的問題。
    *   使用者需要輸入正確的答案才能繼續。
*   **答案驗證**：
    *   使用者提交的答案會經過 SHA256 雜湊處理，並與儲存在 Firestore 中的正確答案雜湊值進行比對。
    *   答案比對不區分大小寫，並會自動去除前後多餘的空格。
*   **歌曲解鎖**：
    *   一旦答案驗證成功，當日的特別歌曲連結即會解鎖。
    *   解鎖狀態會儲存在瀏覽器的 Local Storage 中，確保同一天內使用者再次訪問時可以直接看到已解鎖的歌曲。
    *   每天只能解鎖一個問題和一首歌曲。
*   **內建歌曲播放器**：
    *   解鎖後的歌曲可以直接在應用程式內的音訊播放器中播放。
    *   播放器下方會顯示一段來自 Firestore 的特別留言 (`memory`)，如果沒有特別留言，則顯示預設的祝賀與愛意表達。
*   **已解鎖歌曲列表**：
    *   使用者可以查看一個包含所有先前已成功解鎖歌曲的列表。
    *   每首歌曲都會顯示解鎖日期和歌曲標題。
    *   點擊列表中的任何歌曲都可以再次播放該歌曲。
*   **響應式設計與風格**：
    *   界面採用柔和的粉色系主題，營造浪漫可愛的氛圍。
    *   整體佈局適應不同裝置尺寸，並限制頁面高度以避免不必要的滾動。

## 🛠️ 使用技術

*   **前端框架**：[Next.js](https://nextjs.org/) (使用 App Router)
*   **UI 函式庫**：[React](https://react.dev/)
*   **程式語言**：[TypeScript](https://www.typescriptlang.org/)
*   **樣式**：
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [ShadCN UI](https://ui.shadcn.com/) (用於 UI 元件)
*   **圖示**：[Lucide React](https://lucide.dev/)
*   **後端與資料庫**：
    *   [Firebase](https://firebase.google.com/)
        *   **Firestore**：用於儲存每日問題、答案雜湊、歌曲資訊和特別留言。
        *   **App Hosting**：用於部署應用程式。
*   **AI 工具包 (目前未使用於核心功能)**：[Genkit](https://firebase.google.com/docs/genkit) (已整合，但目前未主動使用)
*   **環境變數管理**：透過 `.env.local` (本地開發) 和 Firebase App Hosting 控制台 (部署環境)。

## 🚀 開始使用 (簡要指南)

### 環境變數設定

1.  **本地開發**：
    *   複製或建立 `.env.local` 檔案在專案根目錄。
    *   填入您的 Firebase 專案設定，例如：
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
        NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
        ```
2.  **部署至 Firebase App Hosting**：
    *   在 Firebase 控制台的 App Hosting 後端設定中，設定相應的「建置環境變數」(Build environment variables)。

### Firestore 資料庫設定

應用程式依賴 Firestore 中的 `dailyChallenges` 集合。

*   **集合名稱**：`dailyChallenges`
*   **文件 ID**：使用 `YYYYMMDD` 格式的日期字串 (例如：`20240728`)。
*   **文件欄位範例**：
    *   `question` (string): "我們第一次一起看的電影是什麼？"
    *   `answerHash` (string): (問題答案經過小寫、去頭尾空格後的 SHA256 雜湊值)
    *   `songTitle` (string): "A Thousand Years"
    *   `songUrl` (string): (指向音訊檔案的直接連結，例如 `.mp3`)
    *   `memory` (string, 可選): "這首歌讓我想起我們在星空下的那個夜晚。"

### 安全性規則

確保您的 Firestore 安全性規則允許讀取 `dailyChallenges` 集合。一個基本的規則範例如下：

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dailyChallenges/{challengeId} {
      allow read: if true;
      allow write: if false; // 通常透過 Firebase 控制台或後端管理內容
    }
  }
}
```

---

這個應用程式是為愛而生的，希望您和您的摯愛喜歡！💖
