import fs from 'fs'
import {Pool} from '../pool/index.mjs'
import {generateRandomLevel} from '../level-generator-v1/levels-node.mjs'

;(async () => {
	const colors = 12
	const levelsCount = 25000

	console.time('finished')
	const levels = (new Array(levelsCount))
		.fill(true)
		.map(() => generateRandomLevel(colors))


	const saveToFile = (args) => {
		let levels = []
		try {
			levels = JSON.parse(fs.readFileSync(`./solved-levels-${colors}.json`).toString('utf-8'))
			levels.sort((a, b) => {
				const first = b.complexityFirst - a.complexityFirst
				return first || b.complexitySecond - a.complexitySecond
			})

			levels.forEach(l => {
				delete l.firstSteps
				if (!l.level.includes(':')) {
					l.level += `:${l.complexityFirst}:${l.complexitySecond}`	
				}
				//

			})
		} catch (e) {
		}

		levels.push(args)
		fs.writeFileSync(`./solved-levels-${colors}.json`, JSON.stringify(levels, null, 2))

		return args
	}


	const pool = new Pool()
	await pool.init()


	const promises = []
	for (let i = 0; i < levels.length; i++) {
		promises.push(
			pool.process({level: levels[i]})
				.then(saveToFile)
		)
	}

	await Promise.all(promises)
	console.timeEnd('finished')

	pool.close()
	process.exit()
})()