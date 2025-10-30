import type { NewsItem } from '@/types'

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 生成 60 条新闻，便于分页演示 */
export const newsSeed: NewsItem[] = Array.from({ length: 60 }).map((_, i) => {
    const fake = rand(0, 40)
    const trueVotes = rand(0, 40)
    return {
        id: i + 1,  // 改为 number
        title: `News Title ${i + 1}`,  // 改为 title
        summary: `Short summary of news ${i + 1}.`,  // 改为 summary
        content: `Full detail for news ${i + 1}. This is long text to simulate real content on the details page.`,  // 改为 content
        imageUrl: `https://picsum.photos/seed/${i + 1}/640/360`,
        author: {  // 改为 author 对象
            id: (i % 3) + 1,
            name: ['Alex Reporter', 'Bao Journalist', 'Chai News'][i % 3],
            email: ['alex@news.com', 'bao@news.com', 'chai@news.com'][i % 3],
            imageUrl: `https://ui-avatars.com/api/?name=${['Alex', 'Bao', 'Chai'][i % 3]}&background=random`
        },
        status: ['PENDING', 'APPROVED', 'REJECTED'][i % 3] as 'PENDING' | 'APPROVED' | 'REJECTED',
        fakeVotes: fake,
        trueVotes: trueVotes,  // 改为 trueVotes
        isDeleted: false,
        createdAt: new Date(Date.now() - i * 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString()
    } as NewsItem
})
