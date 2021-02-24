import {findLevelSolutions as processor} from '../level-checker-v1/checker.mjs'


process.on('message', async ({id, args}) => {
	try {
		console.time('process ' + id)
		const result = await processor(args)
		console.timeEnd('process ' + id)

		process.send({id, result, args})
	} catch (e) {
		process.send({id, error: e, args})
		console.log('process failed', e)
	}
})

process.on('error', async (...args) => {
	console.log(args)
})
