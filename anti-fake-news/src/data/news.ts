import type { NewsItem } from '@/types'

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 生成 60 条新闻，便于分页演示 */
export const newsSeed: NewsItem[] = Array.from({ length: 60 }).map((_, i) => {
    const fake = rand(0, 40)
    const nonfake = rand(0, 40)
    return {
        id: String(i + 1),
        topic: `News Topic ${i + 1}`,
        shortDetail: `Short summary of news ${i + 1}.`,
        fullDetail:
            `Full detail for news ${i + 1}. This is long text to simulate real content on the details page.`,
        reporter: ['Alex', 'Bao', 'Chai'][i % 3],
        reportedAt: new Date(Date.now() - i * 5 * 60 * 60 * 1000).toISOString(),
        imageUrl: `https://picsum.photos/seed/${i + 1}/640/360`,
        fakeVotes: fake,
        nonFakeVotes: nonfake,
    } as NewsItem
})
