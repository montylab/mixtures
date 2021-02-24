import fs from 'fs'

const count = 30;
const colors = 12


let levels = JSON.parse(fs.readFileSync(`./solved-levels-${colors}.json`).toString('utf-8'))
levels = levels.sort((a, b) => {
	const first = b.complexityFirst - a.complexityFirst
	return first || b.complexitySecond - a.complexitySecond
}).filter((l) => l.complexitySecond !== 1)

const filtered = []
let i = count
for (let i=0; i<count; i++) {
	const level = levels.shift()
	filtered.push(level.level)
}

filtered.reverse()


fs.writeFileSync(`./filtered-levels-${colors}.json`, JSON.stringify(filtered, null, 2))

