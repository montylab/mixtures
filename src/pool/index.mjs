import {fork} from 'child_process'
import {cpus} from 'os'

import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class Pool {
	processor = () => {}
	promiseQueue = []
	taskQueue = []
	processes = []
	processesLimit = 1
	loopTimeout = 0
	tasksCount = 0

	startTimestamp = Date.now()
	finishedTimestamps = []

	constructor(processor, processesLimit = cpus().length - 1) {
		this.processor = processor
		this.processesLimit = processesLimit
	}

	async init() {
		for (let i = 0; i <= this.processesLimit; i++) {
			const process = fork(path.resolve(__dirname, 'process.mjs'))
			process.isFree = true
			process.on('message', ({result, args, id}) => {
				this.promiseQueue[id].resolve(result)
				process.isFree = true
				process.id = i

				this.finishedTimestamps.push(Date.now())
				const opsCount = Math.min(this.finishedTimestamps.length, 1000)
				const starter = this.finishedTimestamps.length - opsCount
				let sum = 0
				for (let i=starter; i<this.finishedTimestamps.length; i++) {
					sum += this.finishedTimestamps[i]
				}

				const averageTimeSec = (Date.now() - sum / opsCount) / 1000

				console.clear()
				console.log(id + ' out of ' + this.tasksCount)
				console.log((opsCount / averageTimeSec).toFixed(2) + ' per second')
			})

			process.on('error', async (...args) => {
				console.log(args)
			})

			this.processes.push(process)
		}

		return new Promise(rs => {
			setTimeout(rs, 500)
		})
	}

	loop() {
		clearTimeout(this.loopTimeout)
		this.loopTimeout = setTimeout(() => this.loop(), 15)

		const freeProcess = this.processes.find(process => process.isFree)
		if (!freeProcess) {
			return
		}

		const task = this.taskQueue.shift()

		if (task) {
			this.promiseQueue[task.id] = {
				id: task.id,
				args: task.args,
				promise: task.promise,
				resolve: task.resolve
			}

			freeProcess.isFree = false
			freeProcess.send({id: task.id, args: task.args})

			this.loop()
		}
	}

	async process(args) {
		let resolve
		const promise = new Promise(rs => resolve = rs)

		const id = this.tasksCount + '_' + Math.random().toString(32).slice(3, 11)
		const task = {
			id,
			args,
			promise,
			resolve
		}

		// queueMicrotask(() => task.resolve = resolve)


		this.taskQueue.push(task)
		this.loop()

		this.tasksCount++
		return promise
	}

	close() {
		this.promiseQueue = []
		this.processes.map(process => process.kill())
	}
}