# ⚠️ Firebase Admin SDK 使用说明

## 重要安全提示

**此 Service Account Key 文件包含私钥，绝不能暴露在前端代码或公开仓库中！**

## 正确使用方式

### 1. 后端项目配置（Node.js/Express）

在您的**后端项目根目录**创建此文件：

**后端项目结构：**
```
backend/
├── config/
│   └── firebase-admin.js
├── serviceAccountKey.json  ← 放在这里（添加到 .gitignore）
├── .gitignore
└── server.js
```

### 2. 安装依赖

```bash
npm install firebase-admin
```

### 3. 创建 Firebase Admin 配置文件

**文件位置：** `backend/config/firebase-admin.js`

```javascript
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "se331project"
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
```

### 4. 使用示例

```javascript
// backend/routes/news.js
const { db } = require('../config/firebase-admin');

// 获取所有新闻
app.get('/api/news', async (req, res) => {
  try {
    const snapshot = await db.collection('news').get();
    const news = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 5. 添加到 .gitignore

**在后端项目的 `.gitignore` 中添加：**

```gitignore
# Firebase Admin SDK Private Key
serviceAccountKey.json
*-firebase-adminsdk-*.json
```

## 当前前端项目配置 ✅

前端已正确配置 Firebase Client SDK：
- 文件：`src/config/firebase.ts`
- 用途：Analytics, Hosting
- 无需 Service Account Key

## 部署建议

### 前端部署（Firebase Hosting）
```bash
npm run build
firebase deploy --only hosting
```

### 后端部署（推荐 Vercel/Railway/Render）
使用环境变量存储密钥：

```bash
# 在 Vercel/Railway 环境变量中设置
FIREBASE_PROJECT_ID=se331project
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@se331project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n......"
```

然后在代码中读取：

```javascript
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});
```

## 安全检查清单

- [ ] Service Account Key 文件已添加到 .gitignore
- [ ] 私钥未提交到 Git 仓库
- [ ] 后端使用环境变量存储敏感信息
- [ ] 前端只使用 Client SDK（无私钥）
- [ ] Firebase Console 中启用必要的 API
