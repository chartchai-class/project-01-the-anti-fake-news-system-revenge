# 🛠️ 快速修复指南

由于有多个组件需要更新字段名，以下是所有需要修改的地方：

## 需要修改的文件和字段

### 1. `src/components/CommentItem.vue` 

**需要修改的字段**：
- `comment.username` → `comment.author.name`
- `comment.comment` → `comment.content`  
- `comment.imageUrl` → `comment.author.imageUrl`
- `comment.vote` → 删除所有投票逻辑（Comment 不再有 vote 字段）
- `comment.id.slice(0, 8)` → `comment.id`（ID 已是 number）

### 2. `src/pages/Home.vue`

**需要修改的字段**：
- `n.nonFakeVotes` → `n.trueVotes`

### 3. `src/pages/NewsDetails.vue`

**需要修改的字段**：
- `id === id` → `n.id === Number(id)`（类型匹配）
- `item.topic` → `item.title`
- `item.fullDetail` → `item.content`
- `item.reporter` → `item.author.name`
- `item.reportedAt` → `item.createdAt`
- `item.nonFakeVotes` → `item.trueVotes`

## 快速修复命令

由于组件较多，建议使用以下步骤：

### 步骤 1：停止开发服务器
```bash
# 按 Ctrl+C 停止 Vite
```

### 步骤 2：使用 VSCode 全局查找替换

**查找**：`nonFakeVotes`  
**替换为**：`trueVotes`  
**范围**：`src/` 目录

**查找**：`.topic`  
**替换为**：`.title`  
**范围**：`src/` 目录

**查找**：`.shortDetail`  
**替换为**：`.summary`  
**范围**：`src/` 目录

**查找**：`.fullDetail`  
**替换为**：`.content`  
**范围**：`src/` 目录

**查找**：`.reporter`  
**替换为**：`.author.name`  
**范围**：`src/` 目录

**查找**：`.reportedAt`  
**替换为**：`.createdAt`  
**范围**：`src/` 目录

### 步骤 3：手动修复 CommentItem.vue

由于 Comment 结构变化较大，需要手动修复：

```typescript
// 修改 script 部分
const voteClass = computed(() => 'status-neutral')
const voteText = computed(() => 'Comment')
const voteIcon = computed(() => '💬')
const voteColor = computed(() => 'var(--color-text-secondary)')
```

```vue
<!-- 修改模板部分 -->
{{ props.comment.author.name }} <!-- 原 username -->
{{ props.comment.content }} <!-- 原 comment -->
{{ props.comment.id }} <!-- 原 id.slice(0, 8) -->
```

删除所有包含 `props.comment.vote` 的代码块。

### 步骤 4：修复 NewsDetails.vue 的 ID 比较

```typescript
// 原代码
const id = route.params.id as string
const item = ref(newsSeed.find(n => n.id === id))

// 修复为
const id = Number(route.params.id)
const item = ref(newsSeed.find(n => n.id === id))
```

### 步骤 5：重新构建验证

```bash
npm run build
```

如果还有错误，查看错误信息并继续修复。

## 已知问题和解决方案

### 问题：Comment 字段不存在
**原因**：Comment 类型定义已更新  
**解决**：使用新字段 `author.name`, `content`

### 问题：ID 类型不匹配
**原因**：ID 从 string 改为 number  
**解决**：使用 `Number(route.params.id)`

### 问题：nonFakeVotes 不存在
**原因**：字段改名为 trueVotes  
**解决**：全局替换

## 完成后测试

1. 启动开发服务器：`npm run dev`
2. 访问所有页面：
   - 首页（新闻列表）
   - 新闻详情
   - 投票页面
   - 评论列表
3. 检查控制台是否有错误
4. 测试所有交互功能

---

**预计修复时间**：10-15分钟  
**难度**：中等（主要是批量替换）
