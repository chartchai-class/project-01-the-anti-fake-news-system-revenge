import type { NewsItem } from '@/types'

/** 生成 60 条新闻种子数据（已对齐后端字段） */
export const newsSeed: NewsItem[] = Array.from({ length: 60 }).map((_, i) => {
    return {
        id: i + 1,
        title: `News Title ${i + 1}`,
        shortDetail: `Short summary of news ${i + 1}.`,  // 后端字段: shortDetail
        fullDetail: `Full detail for news ${i + 1}. This is long text to simulate real content on the details page.`,  // 后端字段: fullDetail
        imageUrls: [`https://picsum.photos/seed/${i + 1}/640/360`],  // 后端字段: imageUrls (数组)
        reporterName: ['Alex Reporter', 'Bao Journalist', 'Chai News'][i % 3],  // 后端字段: reporterName (字符串)
        createdBy: ['alex@news.com', 'bao@news.com', 'chai@news.com'][i % 3],  // 后端字段: createdBy
        status: ['UNKNOWN', 'FAKE', 'NON_FAKE'][i % 3] as 'UNKNOWN' | 'FAKE' | 'NON_FAKE',  // 后端枚举: UNKNOWN|FAKE|NON_FAKE
        deleted: false,
        createdAt: new Date(Date.now() - i * 5 * 60 * 60 * 1000).toISOString(),
        deletedAt: undefined
    } as NewsItem
})
