import rfdc from "rfdc";
import * as fs from "fs";
// import {levelsWithFiveTubes} from "./predefined-levels.mjs";

const clone = rfdc()

export const levels = [
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
    [
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [],
        [],
    ],
]


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

    for (let i = 0; i < colorsCount * 4; i++) {
        const tubeIndex = Math.floor(i / 4)
        level[tubeIndex] = level[tubeIndex] || []
        level[tubeIndex].push(levelArray[i])
    }

    level.push([], [])


    return level
}

export const checkLevelCompletion = (level) => {
    // hack to check is it not complete, but might be
    // let's assume that if we have 1 empty and all except 3 filled full
    // const emptyTubes = level.filter(tube => tube.length === 0)
    // const filledTubes = level.filter(t => t[0] === t[1] && t[0] === t[2] && t[0] === t[3])

    // if (level.length - emptyTubes.length - filledTubes.length < 3) {
    //     return true
    // }

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

let showFirst = 20
let totalCalls = 0
export const findLevelSolution = (level, previousActions = []) => {
    totalCalls++
    if (previousActions.length === 40 || totalCalls > 100000) {

        //console.log(JSON.stringify(previousActions))
        //console.count('not found')

        // if (totalCalls % 10000 === 0 ) {
        //     console.log(JSON.stringify(previousActions))
        // }

        return []
    }

    const solutions = []

    const possibleActions = []
    const levelLength = level.length
    for (let from = 0; from < levelLength; from++) {
        for (let to = 0; to < levelLength; to++) {
            const action = getActionIfPossible(level, from, to)

            if (!action || isActionDumb(level, action)) {
                continue
            }

            possibleActions.push(action)

            let updatedLevel = applyActionToLevel(action, level)
            updatedLevel = removeUnsuficientTubes(updatedLevel)
            const isComplete = checkLevelCompletion(updatedLevel)
            const actionsQueue = [...previousActions, action]

            if (isComplete) {
                // solutions.push(actionsQueue)
                solutions.push(actionsQueue.map(({from, to}) => `${from}-${to}`).join(' '))
            }

            const childSolutions = findLevelSolution(updatedLevel, [...previousActions, action])
            solutions.push(...childSolutions)

            // if (solutions.length && solutions.length % 100000 < 10) {
                // console.log(1, solutions[solutions.length - 1])
            // }

            if (solutions.length > 1000) {
                // console.log({possibleActions: possibleActions.length})
                // console.log({possibleActions: possibleActions.length, actions: previousActions.length})
                return solutions
            }
        }
    }

    //console.log({possibleActions: possibleActions.length, actions: previousActions.length})

    return solutions
}

console.time()
// const levelsToCheck = levelsWithFiveTubes
// const unsolved = []
// console.log('count: ' + levelsToCheck.length)
//
// for (let i = 0; i < 1; i++){
//     let level = levelsToCheck[i];
//     const solutions = findLevelSolution(level)
//
//     if (solutions.length === 0) {
//         console.log(i + ' failed')
//         console.log(level);
//         unsolved.push(level)
//         console.count()
//     } else {
//         //console.log('cracked')
//     }
// }


const solutions = findLevelSolution(levels[0])
console.log({solutions: solutions.length, totalFuncCalls: totalCalls})
console.log(solutions.pop())
console.timeEnd()

const generatedLevels = []
while (generatedLevels.length < 100) {
    const level = generateRandomLevel(4 + Math.floor(generatedLevels.length / 10))
    totalCalls = 0
    console.log(level)
    if (findLevelSolution(level).length > 1) {
        generatedLevels.push(level)
        console.log('level generated: ' + generatedLevels.length)
    }
}
fs.writeFileSync('./levels.json', JSON.stringify(generatedLevels, null,2))