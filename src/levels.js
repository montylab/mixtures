export const levels = [
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
        [1,3,2,1],
        [6,5,5,4],
        [9,7,5,9],
        [2,3,4,6],
        [5,4,8,2],
        [8,1,3,7],
        [7,1,3,4],
        [7,2,8,9],
        [9,6,6,8],
        [],
        []
    ],
]

export const generateLevel = (colors = 11) => {
    const level = []
    const colorsCount = 4 + Math.ceil(Math.random() * colors - 4)
    let levelString = ''
    for (let i=1; i<=colorsCount; i++) {
        levelString += i.toString().repeat(4)
    }
    const levelArray = levelString
        .split('')
        .sort(() => Math.random() - 0.5)

    for (let i=0; i<colorsCount*4; i++) {
        const tubeIndex = Math.floor(i/4)
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
        const from = [...tubes[fromIndex]]
        const to = [...tubes[toIndex]]

        while (
            from.length !== 0 && to.length !== 4
            && (from[from.length - 1] === to[to.length - 1] || to.length === 0)
            ) {
            to.push(from.pop())
            layers++
        }
    }

    return layers && {from: fromIndex, to: toIndex, layers}
}

const applyActionToLevel = ({from, to, layers}, level) => {
    const updated = JSON.parse(JSON.stringify(level))
    for (let i=0; i<layers; i++) {
        updated[to].push(updated[from].pop())
    }
    return updated
}

export const findLevelSolution = (level, previousActions = []) => {
    if (previousActions.length === 10) {
        //console.log('not found:', JSON.stringify(previousActions))
        //console.count('not found')
        return {isSolution: false}
    }

    const solutions = []

    const levelLength = level.length
    for (let from=0; from<levelLength; from++) {
        for (let to=0; to<levelLength; to++) {
            const action = getActionIfPossible(level, from, to)
            if (
                action
                && !(level[to].length === 0 && action.layers === level[from].length) // forbid meaningless move
                && !(level[from][level[from].length - action.layers - 1] === level[from][level[from].length - 1]) // forbid meaningless move
            ) {
                const updatedLevel = applyActionToLevel(action, level)
                const isComplete = checkLevelCompletion(updatedLevel)
                const actionsQueue = [...previousActions, action]

                if (isComplete) {
                    solutions.push(actionsQueue)

                    // return {
                    //     isSolution: true,
                    //     actions: [...previousActions, action]
                    // }
                }

                const childSolutions = findLevelSolution(updatedLevel, [...previousActions, action])
                solutions.push(...childSolutions)

                // const result =
                // if (result.isSolution) {
                //     return result
                // }

                // if (from === 0 && to === 4) return
            }
        }
    }

    return solutions
}


console.time()
console.log( findLevelSolution(levels[0]))
console.timeEnd()