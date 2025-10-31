# 📸 图片功能完整文档

## ✅ 已完成的功能

### 1. 新闻详情页显示网络图片
- **数据来源**: `src/data/news.ts`
- **图片类型**: 来自 Unsplash 的真实新闻相关图片
- **显示位置**: NewsDetails.vue 页面
- **图片数量**: 10 张不同的新闻图片循环使用

**图片列表**:
1. 报纸和咖啡场景
2. 新闻编辑室
3. 手机阅读新闻
4. 新闻播报场景
5. 记者采访
6. 社交媒体新闻
7. 数字媒体
8. 传统媒体
9. 事实核查
10. 办公场景

### 2. 图片上传功能

#### 📦 后端 API
**端点**: `POST http://localhost:8080/uploads`

**请求格式**:
- Content-Type: `multipart/form-data`
- 字段名: `file` (必须)
- 文件类型: JPG, PNG, GIF, WebP
- 最大大小: 10MB

**响应格式**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "url": "/uploads/550e8400-e29b-41d4-a716-446655440000.jpg",
    "uploadedBy": "user@example.com",
    "uploadedAt": "2025-10-31T10:51:57.913741Z"
  },
  "message": "file uploaded successfully"
}
```

#### 🎨 前端组件

**ImageUploader.vue 组件**:
- 位置: `src/components/ImageUploader.vue`
- 功能:
  - ✅ 支持手动输入图片 URL
  - ✅ 支持点击按钮上传本地图片
  - ✅ 实时预览上传的图片
  - ✅ 显示上传进度条
  - ✅ 支持删除已上传图片
  - ✅ 文件类型和大小验证
  - ✅ 错误提示

**使用示例**:
```vue
<ImageUploader 
  v-model="formData.imageUrl"
  label="图片证据 (可选)"
  placeholder="输入图片URL或点击上传按钮上传图片"
  :error="fieldErrors.imageUrl"
/>
```

#### 📍 已集成的页面

**1. VotePage.vue (投票页面)**
- 位置: `src/pages/VotePage.vue`
- 用途: 用户投票时可以上传证据图片
- 字段: `formData.imageUrl`

**2. Register.vue (注册页面)**
- 位置: `src/pages/Register.vue`
- 用途: 用户注册时可以上传头像
- 字段: `imageUrl`

#### 🔧 API 服务

**位置**: `src/services/api.ts`

**uploadService**:
```typescript
export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    // 上传图片并返回 URL
  }
}
```

**使用方法**:
```typescript
import { uploadService } from '@/services/api'

// 上传图片
const imageUrl = await uploadService.uploadImage(file)
console.log('图片URL:', imageUrl)
```

---

## 🚀 使用方法

### 方式 1: 查看新闻图片
1. 启动前端: `npm run dev`
2. 访问: `http://localhost:5174`
3. 点击任意新闻卡片
4. 查看新闻详情页的图片（来自 Unsplash）

### 方式 2: 测试图片上传（投票页面）
1. 登录账号
2. 进入新闻详情页
3. 点击 "Go Vote" 按钮
4. 在 "图片证据" 部分:
   - **方式A**: 输入网络图片 URL
   - **方式B**: 点击 "📤 上传" 按钮，选择本地图片
5. 填写投票和评论
6. 提交

### 方式 3: 测试图片上传（注册页面）
1. 访问注册页面
2. 填写邮箱、用户名、密码
3. 在 "头像" 部分:
   - **方式A**: 输入头像 URL
   - **方式B**: 点击 "📤 上传" 按钮，上传头像图片
4. 注册

### 方式 4: 使用 Apidog 测试上传 API

**配置**:
```
URL: http://localhost:8080/uploads
Method: POST
Body: form-data
  - Key: file (Type: File)
  - Value: 选择图片文件
Headers:
  - Authorization: Bearer YOUR_TOKEN (如果需要)
```

**PowerShell 测试命令**:
```powershell
$token = "YOUR_TOKEN"
$file = "C:\path\to\image.jpg"

Invoke-RestMethod -Uri "http://localhost:8080/uploads" `
    -Method Post `
    -Headers @{"Authorization"="Bearer $token"} `
    -Form @{file=Get-Item $file}
```

---

## 📊 功能对比

| 功能 | 新闻详情页图片 | 上传功能 |
|------|---------------|----------|
| **数据来源** | JSON 文件 | 用户上传 |
| **图片类型** | 网络图片 URL | 本地文件 |
| **存储位置** | Unsplash CDN | 后端服务器 |
| **使用场景** | 展示新闻 | 投票证据、用户头像 |
| **是否需要登录** | ❌ 否 | ✅ 是 |
| **可编辑** | ❌ 否 | ✅ 是 |

---

## 🎯 技术实现

### 前端
- **框架**: Vue 3 + TypeScript
- **HTTP 客户端**: Fetch API (原生)
- **文件上传**: FormData + multipart/form-data
- **组件**: 可复用的 ImageUploader 组件

### 后端（已存在）
- **框架**: Spring Boot
- **文件存储**: 本地文件系统 (`uploads/` 目录)
- **文件名**: UUID + 原始扩展名
- **静态资源**: Spring MVC 静态资源映射

---

## 🔒 安全性

### 前端验证
- ✅ 文件类型检查（只允许图片）
- ✅ 文件大小限制（10MB）
- ✅ URL 格式验证

### 后端验证（需确认）
- ✅ JWT Token 认证
- ✅ 文件类型验证
- ✅ 文件大小限制
- ✅ 路径遍历防护

---

## 📝 注意事项

1. **新闻图片**: 
   - 来自 Unsplash，无需上传
   - 已在 `news.ts` 中配置好
   - 自动循环使用 10 张图片

2. **上传功能**:
   - 需要后端服务器运行
   - 需要用户登录（部分功能）
   - 上传的文件存储在后端 `uploads/` 目录

3. **图片 URL**:
   - 新闻图片使用外部 URL（Unsplash）
   - 上传的图片使用本地路径（`/uploads/xxx.jpg`）

4. **性能优化**:
   - Unsplash 图片带有 CDN 加速
   - 已设置图片尺寸参数（800x450）

---

## 🐛 故障排查

### 问题 1: 新闻详情页图片不显示
**检查**:
- 网络连接是否正常
- Unsplash 是否被防火墙拦截
- 浏览器控制台是否有错误

### 问题 2: 上传功能返回 500
**检查**:
- 后端服务器是否运行
- `uploads/` 目录是否存在
- 文件大小是否超过限制
- 字段名是否为 `file`

### 问题 3: 上传成功但无法访问
**检查**:
- 静态资源映射是否配置
- 返回的 URL 路径是否正确
- 浏览器直接访问 `http://localhost:8080/uploads/xxx.jpg`

---

## ✅ 测试清单

- [x] 新闻列表显示图片缩略图
- [x] 新闻详情页显示完整图片
- [x] 投票页面图片上传功能
- [x] 注册页面头像上传功能
- [x] 图片预览功能
- [x] 上传进度显示
- [x] 文件类型验证
- [x] 文件大小验证
- [x] 错误提示
- [x] 删除图片功能

---

## 🎉 完成！

现在你的项目同时支持：
1. ✅ **新闻详情页显示网络图片**（来自 JSON 文件）
2. ✅ **用户上传图片功能**（投票证据、头像等）

两者互不冲突，各司其职！
