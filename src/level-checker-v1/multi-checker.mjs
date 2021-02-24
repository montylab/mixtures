import {fork} from 'child_process'
import {cpus} from 'os'

import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const forkedPromise = (level) => {
	const forkPromise = new Promise((rs) => {
		try {
			const process = fork(path.resolve(__dirname, 'checker-thread.mjs'))

			process.on('message', (message) => {
				console.count('process completed')

				forkPromise.isFulfilled = true
				rs(message)
			})


			setTimeout(() => {
				process.send({level})
			}, 500)
		} catch (e) {
		}
	})

	return forkPromise
}

export const multiLevelChecker = async (levels) => {
	const promises = []
	for (let i = 0; i < levels.length; i++) {
		const unfulfilled = promises.filter(p => !p.isFulfilled)
		if (unfulfilled.length >= cpus().length - 1) {
			await Promise.race(unfulfilled)
		}

		promises.push(forkedPromise(levels[i]))
	}

	return Promise.all(promises)
}

