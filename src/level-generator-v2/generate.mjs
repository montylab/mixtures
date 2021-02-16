const level = []

const randomMove = (level, clearLastTwoRows = false) => {
    let from
    let to

    if (clearLastTwoRows && level[level.length - 1].length + level[level.length - 2].length === 0) {
        return level
    }

    do {
        from = Math.round(Math.random() * (level.length - 1))
    } while (level[from].length === 0 || (clearLastTwoRows && from < level.length - 2))

    do {
        to = Math.round(Math.random() * (level.length - 1))
    } while (level[to].length === 4 || to === from || (clearLastTwoRows && to > level.length - 3))

    console.log({from, to})

    level[to].push(level[from].pop())

    return level
}

const generate = (colors = 14, shuffleCounts = 100) => {
    const colorsArr = []
    for (let i = 1; i < colors - 1; i++) {
        colorsArr[i] = i
    }

    colorsArr.sort(() => 0.5 - Math.random())

    const level = []
    for (let i = 0; i < colors - 2; i++) {
        level[i] = [colorsArr[i], colorsArr[i], colorsArr[i], colorsArr[i]]
    }

    level.push([], [])

    for (let i = 0; i < shuffleCounts; i++) {
        randomMove(level)
    }

    //clear last two tubes
    // while (level[colors - 1].length) {
    //     randomMove(level, true)
    // }
    console.log('cleaning')

    for (let i=0; i<8; i++) {
        randomMove(level, true)
    }


    return level
}

console.log(generate(11))