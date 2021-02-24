export const generateRandomLevel = (colors = 12) => {
	const level = []
	const colorsCount = colors
	let levelString = ''
	for (let i = 1; i <= colors; i++) {
		levelString += (i.toString() + '-').repeat(4)
	}
	levelString = levelString.slice(0, levelString.length - 1)


	const levelArray = levelString
		.split('-')
		.map(Number)
		.sort(() => Math.random() - 0.5)

	if (/(\d)\1{3}/im.test(levelArray.join(''))) {
		return generateRandomLevel(colors)
	}

	for (let i = 0; i < colorsCount * 4; i++) {
		const tubeIndex = Math.floor(i / 4)
		level[tubeIndex] = level[tubeIndex] || []
		level[tubeIndex].push(levelArray[i])
	}

	level.push([], [])

	return level
}

// const colors = 10
// const levels = (new Array(25000))
//     .fill(true)
//     .map(() => generateRandomLevel(colors))
//
// ;(async () => {
//     console.time('levels generation multi-thread')
//     const solved = await multiLevelChecker(levels)
//     console.timeEnd('levels generation multi-thread')
//
//     const filtered = solved//.filter(s => s.complexityFirst > 0.25)
//     filtered.sort((a, b) => {
//         const first = b.complexityFirst - a.complexityFirst
//         return first || b.complexitySecond - a.complexitySecond
//
//     })
//
//     fs.writeFileSync(`./solved-levels-${colors}.json`, JSON.stringify(filtered, null, 2))
// })()
