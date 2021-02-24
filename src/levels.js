const clone = require('rfdc')()

export const levels = [
	[
		[1, 2, 6, 9], [12, 5, 11, 5],
		[12, 12, 7, 3], [8, 11, 10, 10],
		[7, 11, 4, 4], [1, 11, 2, 4],
		[9, 4, 8, 8], [5, 9, 5, 10],
		[6, 1, 7, 6], [7, 3, 6, 9],
		[2, 3, 8, 12], [3, 1, 10, 2],
		[], []
	],
	[
		[9, 4, 12, 12], [5, 11, 1, 3],
		[3, 9, 10, 2], [9, 1, 9, 5],
		[6, 7, 8, 7], [11, 1, 4, 2],
		[4, 6, 5, 7], [7, 4, 3, 2],
		[12, 2, 5, 8], [6, 8, 1, 10],
		[10, 11, 6, 10], [12, 3, 11, 8],
		[], []
	],
	[
		[5, 1, 11, 5], [1, 2, 1, 10],
		[4, 8, 11, 6], [7, 5, 11, 7],
		[10, 3, 9, 6], [5, 11, 8, 10],
		[3, 7, 9, 4], [4, 7, 2, 9],
		[6, 8, 2, 6], [3, 10, 8, 3],
		[1, 4, 9, 2], [],
		[]
	],
	[
		[1, 1, 1, 4],
		[4, 4, 4, 1],
		[2, 2, 2, 2],
		[3, 3, 3, 3],
		[],
		[]
	],
	[
		[1, 2, 3, 4],
		[1, 2, 3, 4],
		[1, 2, 3, 4],
		[1, 2, 3, 4],
		[],
		[]
	],
	[
		[],
		[1],
		[2, 1, 1, 1],
		[2, 2, 2],
		[3, 3, 3, 3],
		[4, 4, 4, 4]
	],
	[
		[1, 2, 3, 4],
		[1, 2, 3, 4],
		[1, 2, 3, 4],
		[1, 2, 3, 4],
		[5, 6, 6, 5],
		[6, 6, 5, 5],
		[],
		[]
	],
	[
		[1, 3, 2, 1],
		[6, 5, 5, 4],
		[9, 7, 5, 9],
		[2, 3, 4, 6],
		[5, 4, 8, 2],
		[8, 1, 3, 7],
		[7, 1, 3, 4],
		[7, 2, 8, 9],
		[9, 6, 6, 8],
		[],
		[]
	],
]

export const generateLevel = (colors = 11) => {
	const level = []
	const colorsCount = 4 + Math.ceil(Math.random() * colors - 4)
	let levelString = ''
	for (let i = 1; i <= colorsCount; i++) {
		levelString += i.toString().repeat(4)
	}
	const levelArray = levelString
		.split('')
		.sort(() => Math.random() - 0.5)

	for (let i = 0; i < colorsCount * 4; i++) {
		const tubeIndex = Math.floor(i / 4)
		level[tubeIndex] = level[tubeIndex] || []
		level[tubeIndex].push(levelArray[i])
	}

	level.push([], [])

	return level
}

export const checkLevelCompletion = (level) => {
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

		//tubes[fromIndex].join('').

		// const from = [...tubes[fromIndex]]
		// const to = [...tubes[toIndex]]
		//
		// while (
		//     from.length !== 0 && to.length !== 4
		//     && (from[from.length - 1] === to[to.length - 1] || to.length === 0)
		//     ) {
		//     to.push(from.pop())
		//     layers++
		// }
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

let totalCalls = 0
export const findLevelSolution = (level, previousActions = []) => {
	totalCalls++
	if (previousActions.length === 30) {
		//console.log(JSON.stringify(previousActions))
		//console.count('not found')

		if (totalCalls % 1000000 === 0) {
			console.log(JSON.stringify(previousActions))
		}

		return []
	}

	const solutions = []

	const levelLength = level.length
	for (let from = 0; from < levelLength; from++) {
		for (let to = 0; to < levelLength; to++) {
			const action = getActionIfPossible(level, from, to)

			if (!action || isActionDumb(level, action)) {
				continue
			}
			const updatedLevel = applyActionToLevel(action, level)
			const isComplete = checkLevelCompletion(updatedLevel)
			const actionsQueue = [...previousActions, action]

			if (isComplete) {
				solutions.push(actionsQueue)
				if (solutions.length > 1000) {
					return solutions
				}
			}

			const childSolutions = findLevelSolution(updatedLevel, [...previousActions, action])
			solutions.push(...childSolutions)
		}
	}

	return solutions
}


console.time()
// const solutions = findLevelSolution(levels[4])
// console.log(solutions, totalCalls)
console.timeEnd()