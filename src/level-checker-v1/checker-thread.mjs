import {findLevelSolutions} from './checker.mjs'
import deepcopy from 'deepcopy'

process.on('message', ({level}) => {

	// const timeout = setTimeout(() => {
	//     console.log('failed', level)
	// }, 5000)

	console.time('solution')
	const info = findLevelSolutions(deepcopy(level))
	console.timeEnd('solution')
	// clearTimeout(timeout)

	if (info.complexitySecond > 0.5) {
		console.log(info)
	} else {
		//console.log(info.complexity)
	}

	process.send(info)

	setTimeout(() => {
		process.exit()
	}, 1000)
})