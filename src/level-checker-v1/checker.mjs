import rfdc from 'rfdc'

const clone = rfdc()

const shrinkLevel = (level) => {
	return level.flat().map(color => color.toString(32)).join('')
}

const checkLevelCompletion = (level) => {
	return level.reduce((acc, tube) => {
		return acc && tube.length % 4 === 0 && tube.every(color => color === tube[0])
	}, true)
}

const getActionIfPossible = (tubes, fromIndex, toIndex) => {
	let layers = 0

	if (fromIndex !== toIndex) {
		const maxLayersToReceive = 4 - tubes[toIndex].length
		const originLastIndex = tubes[fromIndex].length - 1
		let maxLayersToMove = 0

		if (
			(tubes[fromIndex][tubes[fromIndex].length - 1] === tubes[toIndex][tubes[toIndex].length - 1])
			|| tubes[toIndex].length === 0
		) {
			maxLayersToMove = 1
			if (tubes[fromIndex][originLastIndex] === tubes[fromIndex][originLastIndex - 1]) {
				maxLayersToMove = 2
				if (tubes[fromIndex][originLastIndex] === tubes[fromIndex][originLastIndex - 2]) {
					maxLayersToMove = 3
				}
			}
		}

		layers = Math.min(maxLayersToMove, maxLayersToReceive)
	}

	return layers && {from: fromIndex, to: toIndex, layers}
}

const applyActionToLevel = ({from, to, layers}, level) => {
	const updated = clone(level) //JSON.parse(JSON.stringify(level))
	for (let i = 0; i < layers; i++) {
		updated[to].push(updated[from].pop())
	}

	return updated
}

const isActionDumb = (level, {from, to, layers}) => {
	if (!layers) {
		return true
	}

	// from all layers from one to empty tube
	if (level[to].length === 0 && layers === level[from].length) {
		return true
	}

	const color = level[from][level[from].length - 1]

	// move not all layers of same color
	if (level[from][level[from].length - layers - 1] === color) {
		return true
	}

	// if two empties, do not use second
	const emptyTubes = level.filter(tube => tube.length === 0)
	if (emptyTubes[1] === level[to]) {
		return true
	}

	// if action is move layer to empty tube, when exists tube with all layers of the same color
	//const emptyTubes = level.filter(tube => tube.length === 0)
	const sameColorTubes = level.filter(
		tube => tube.length && tube.every(layer => layer === color)
	)
	if (level[to].length === 0 && sameColorTubes.length) {
		return true
	}

	return false
}

const removeUnsuficientTubes = (level) => {
	level = level.filter(
		tube => !(tube.length === 4 && tube[0] === tube[1] && tube[0] === tube[2] && tube[0] === tube[3])
	)

	// const emptyTubesCount = level.filter(tube => tube.length === 0).length
	//
	// if (emptyTubesCount === 1) {
	//     const values = level.map(tube => Array.from(new Set(tube)).sort().join(''))
	//
	//     if (level)
	//
	// console.log(values,level, checkLevelCompletion(level))
	// process.exit(0)
	// }
	//
	// if (level.length - emptyTubes.length - filledTubes.length < 3) {
	//     return true
	// }

	return level
}


// solution limit
// colors: 10 - 10e6

export const findLevelSolutions = ({level, callsLimit = 10e8, solutionsLimit = 800000, timeLimit = 3600}) => {
	let totalCalls = 0
	const solutionsBeginnings = {}
	const startTimestamp = Date.now()
	const stepsCountToCheck = 2


	const findLevelSolutionsRecursive = (level, previousActions = [], innerSolutionsCount = 0) => {
		totalCalls++
		const solutions = []

		if (
			totalCalls > callsLimit
			|| innerSolutionsCount > solutionsLimit
			|| (Date.now() - startTimestamp) / 1000 > timeLimit
		) {
			return []
		}

		const levelLength = level.length
		for (let from = 0; from < levelLength; from++) {
			for (let to = 0; to < levelLength; to++) {
				const action = getActionIfPossible(level, from, to)

				if (!action || isActionDumb(level, action)) {
					continue
				}

				let updatedLevel = applyActionToLevel(action, level)
				updatedLevel = removeUnsuficientTubes(updatedLevel)
				const isComplete = checkLevelCompletion(updatedLevel)
				const actionsQueue = [...previousActions, action]

				const solution32 = actionsQueue.map(({from, to}) => from.toString(32) + to.toString(32)).join('')
				const firstSteps = solution32.slice(0, stepsCountToCheck * 2)

				if (isComplete) {
					solutionsBeginnings[firstSteps] = solutionsBeginnings[firstSteps] || 1
					innerSolutionsCount++

					return solutionsBeginnings
				}

				if (solutionsBeginnings[firstSteps]) {
					solutionsBeginnings[firstSteps]++
					return solutionsBeginnings
				}

				findLevelSolutionsRecursive(updatedLevel, [...previousActions, action], innerSolutionsCount + solutions.length)
			}
		}

		return solutionsBeginnings
	}

	const colors = level.length - 2
	const beginnings = findLevelSolutionsRecursive(level)
	const totalSolutions = Object.values(beginnings)
		.reduce((acc, cnt) => acc + cnt, 0)

	const firstSteps = Object.keys(beginnings)
		.reduce((acc, key) => {
			const firstTwoStep = key.slice(0, 4)
			acc[firstTwoStep] = (acc[firstTwoStep] || 0) + beginnings[key]

			return acc
		}, {})

	const complexitySecond = 1 - Object.keys(firstSteps).length / (colors + 1) ** 2

	let steps = Object.keys(beginnings)
		.reduce((acc, key) => {
			const step = key.slice(0, 2)
			acc[step] = (acc[step] || 0) + beginnings[key]

			return acc
		}, {})

	const complexityFirst = 1 - Object.keys(steps).length / colors


	return {
		complexityFirst,
		complexitySecond,
		firstSteps,
		totalSolutions,
		level: shrinkLevel(level),
		time: (Date.now() - startTimestamp) / 1000
	}
}

