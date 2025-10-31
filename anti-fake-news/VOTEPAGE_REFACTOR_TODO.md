# ⚠️ VotePage.vue 需要重构

## 问题
VotePage.vue 仍在使用旧的字段名和本地状态管理，需要改为调用后端 API。

## 当前错误
1. `newsItem.fakeVotes++` - NewsItem 没有 fakeVotes 字段
2. `newsItem.trueVotes++` - NewsItem 没有 trueVotes 字段  
3. `author: { ... }` - Comment 不使用嵌套 author 对象

## 正确做法

### 1. 投票流程（使用后端 API）

```typescript
import { voteService } from '@/services/api'
import type { VoteValue } from '@/types'

// 提交投票
const submitVote = async (value: VoteValue) => {
  try {
    await voteService.submit(newsId, { value })
    // 重新加载投票统计
    await loadVoteStats()
    router.push(`/news/${newsId}`)
  } catch (error) {
    console.error('Vote failed:', error)
  }
}

// 加载投票统计
const voteStats = ref<VoteResponse | null>(null)
const loadVoteStats = async () => {
  try {
    voteStats.value = await voteService.getStats(newsId)
  } catch (error) {
    console.error('Failed to load vote stats:', error)
  }
}
```

### 2. 评论创建（使用后端 API）

```typescript
import { commentService } from '@/services/api'

const createComment = async () => {
  try {
    await commentService.create(newsId, {
      content: commentContent.value,
      imageUrl: commentImage.value || undefined
    })
    // 重新加载评论列表
    await loadComments()
    // 清空表单
    commentContent.value = ''
    commentImage.value = ''
  } catch (error) {
    console.error('Comment creation failed:', error)
  }
}
```

### 3. 移除本地投票计数

**删除**:
```typescript
// ❌ 不要直接修改 NewsItem
newsItem.fakeVotes++
newsItem.trueVotes++

// ❌ 不要使用 localStorage 存储投票数
localStorage.setItem(`news_${id}`, JSON.stringify(newsData))
```

**改为**:
```typescript
// ✅ 调用后端 API，由后端管理投票状态
await voteService.submit(newsId, { value: 'FAKE' })
// 或
await voteService.submit(newsId, { value: 'NOT_FAKE' })

// ✅ 从后端获取最新统计
const stats = await voteService.getStats(newsId)
// stats.fakeCount, stats.notFakeCount, stats.myVote
```

## 建议

由于 VotePage 需要大幅重构，建议：

1. **短期方案**: 暂时注释掉 VotePage 相关路由，先完成其他页面的后端对接
2. **长期方案**: 按照上述正确做法重写 VotePage，完全使用后端 API

## 当前状态

- ❌ VotePage.vue 未对齐后端
- ✅ Home.vue 已对齐
- ✅ NewsDetails.vue 已对齐
- ✅ CommentItem.vue 已对齐
- ✅ VoteSummary.vue 已对齐
