const chunkArray = (array, chunk) => {
	const newArray = []
	for (let i = 0; i < array.length; i += chunk) {
		newArray.push(array.slice(i, i + chunk))
	}

	return newArray
}

function generateLevelsWithSettings({colored, empty}) {
	let checkerComparisonString = ''
	for (let i = 0; i < colored; i++) {
		checkerComparisonString += i.toString().repeat(4)
	}

	let levels = []
	for (let i = 0; i < colored ** (4 * colored); i++) {
		if (i % 1000000 === 0) {
			console.count('millions')
		}

		let string = (i).toString(colored)
		while (string.length < 4 * colored) {
			string = '0' + string
		}

		let arr = string.split('').map(Number)
		const comparableString = string.split('').map(Number).sort().join('')
		if (comparableString === checkerComparisonString) {
			arr = arr.map(number => number || colored)
			const level = chunkArray(arr, 4)
			for (let k = 0; k < empty; k++) {
				level.push([])
			}

			levels.push(level)

			if (level.length % 100 === 0) {
				console.count('level hundreds')
			}
		}
	}

	return levels
}

// export const levelsWithThreeTubes = generateLevelsWithSettings({colored: 2, empty: 1})
// export const levelsWithFourTubes = generateLevelsWithSettings({colored: 3, empty: 1})
export const levelsWithFiveTubes = generateLevelsWithSettings({colored: 3, empty: 2})
// export const levelsWithSixTubes = generateLevelsWithSettings({colored: 4, empty: 2})

