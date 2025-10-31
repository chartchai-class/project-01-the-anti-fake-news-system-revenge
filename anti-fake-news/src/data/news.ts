import type { NewsItem } from '@/types'

/** Real news image URL list */
const newsImages = [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop', // Newspaper and coffee
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=450&fit=crop', // Newsroom
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&h=450&fit=crop', // Mobile news
    'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&h=450&fit=crop', // News broadcast
    'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800&h=450&fit=crop', // Reporter interview
    'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=450&fit=crop', // Social media
    'https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?w=800&h=450&fit=crop', // Digital media
    'https://images.unsplash.com/photo-1560177112-fbfd5fde9566?w=800&h=450&fit=crop', // Traditional media
    'https://images.unsplash.com/photo-1579869847557-1f67382cc158?w=800&h=450&fit=crop', // Fact checking
    'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=800&h=450&fit=crop', // Office scene
]

/** Generate 60 news seed data (aligned with backend fields) */
export const newsSeed: NewsItem[] = Array.from({ length: 60 }).map((_, i) => {
    return {
        id: i + 1,
        title: `News Title ${i + 1}`,
        shortDetail: `Short summary of news ${i + 1}.`,  // Backend field: shortDetail
        fullDetail: `Full detail for news ${i + 1}. This is long text to simulate real content on the details page.`,  // Backend field: fullDetail
        imageUrls: [newsImages[i % newsImages.length]],  // Cycle through real images
        reporterName: ['Alex Reporter', 'Bao Journalist', 'Chai News'][i % 3],  // Backend field: reporterName (string)
        createdBy: ['alex@news.com', 'bao@news.com', 'chai@news.com'][i % 3],  // Backend field: createdBy
        status: ['UNKNOWN', 'FAKE', 'NON_FAKE'][i % 3] as 'UNKNOWN' | 'FAKE' | 'NON_FAKE',  // Backend enum: UNKNOWN|FAKE|NON_FAKE
        deleted: false,
        createdAt: new Date(Date.now() - i * 5 * 60 * 60 * 1000).toISOString(),
        deletedAt: undefined
    } as NewsItem
})
