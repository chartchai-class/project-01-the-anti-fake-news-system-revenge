import fs from 'node:fs'

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
	return arr[rand(0, arr.length - 1)]
}

const NUM_NEWS = 60

const news = Array.from({ length: NUM_NEWS }).map((_, i) => {
	const fake = rand(0, 40)
	const nonfake = rand(0, 40)
	return {
		id: String(i + 1),
		topic: `News Topic ${i + 1}`,
		shortDetail: `Short summary of news ${i + 1}.`,
		fullDetail: `Full detail for news ${i + 1}. This is long text to simulate real content on the details page.`,
		reporter: ['Alex', 'Bao', 'Chai'][i % 3],
		reportedAt: new Date(Date.now() - i * 5 * 60 * 60 * 1000).toISOString(),
		imageUrl: `https://picsum.photos/seed/${i + 1}/640/360`,
		fakeVotes: fake,
		nonFakeVotes: nonfake,
	}
})

const usernames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Liam', 'Emma', 'Noah']
const commentTexts = [
	'Looks real to me based on the sources.',
	'Timeline mismatch with other reports.',
	'The data points seem credible.',
	'Requires further verification.',
	'Reporter has a solid track record.',
	'I am not convinced by the evidence.',
	'This is likely fake.',
	'This is likely real.',
]

let cseq = 1
const comments = []
for (let i = 1; i <= NUM_NEWS; i++) {
	// 70% 的新闻拥有 1-4 条评论
	if (Math.random() < 0.7) {
		const count = rand(1, 4)
		for (let j = 0; j < count; j++) {
			const vote = Math.random() < 0.5 ? 'real' : 'fake'
			comments.push({
				id: `c-${cseq++}`,
				newsId: String(i),
				username: pick(usernames),
				comment: pick(commentTexts),
				createdAt: new Date(Date.now() - rand(1, 7) * 60 * 60 * 1000).toISOString(),
				vote,
				imageUrl: Math.random() < 0.5 ? `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop` : undefined,
			})
		}
	}
}

const db = { news, comments }

fs.writeFileSync(new URL('../db.json', import.meta.url), JSON.stringify(db, null, 2))
console.log('db.json generated with', news.length, 'news and', comments.length, 'comments')


