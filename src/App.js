import './App.css';
import Tube from "./Tube";
import React, {useState} from "react";

const levels = [
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
    ]
]

const checkLevelCompletion = (level) => {
    return level.reduce((acc, tube) => {
        return acc && tube.length % 4 === 0 && tube.every(color => color === tube[0])
    }, true)
}

function App() {
    const [tubes, setTubes] = useState(JSON.parse(JSON.stringify(levels[0])))
    const [selected, setSelected] = useState(-1)
    const [isLevelComplete, setLevelComplete] = useState(false)
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0)

    const manipulateTubes = (index) => {
        if (selected === -1) {
            setSelected(index)
        } else {
            if (index !== selected) {
                const from = tubes[selected]
                const to = tubes[index]

                while (
                    from.length !== 0 && to.length !== 4
                    && (from[from.length - 1] === to[to.length - 1] || to.length === 0)
                    ) {
                    to.push(from.pop())
                }

                setTubes(tubes)
            }

            setSelected(-1)
        }

        if (checkLevelCompletion(tubes)) {
            setLevelComplete(true)
        }
    }

    const setupNextLevel = () => {
        setTubes(JSON.parse(JSON.stringify(levels[currentLevelIndex + 1])))
        setLevelComplete(false)
        setSelected(-1)
        setCurrentLevelIndex(currentLevelIndex + 1)
    }

    const setupRandom = () => {
        const level = []
        const colorsCount = 4 + Math.ceil(Math.random() * 7)
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

        setTubes(level)
        setLevelComplete(false)
        setSelected(-1)
        setCurrentLevelIndex(currentLevelIndex + 1)
    }

    return (
        <div className="App">
            <div className="header">
                <h1>Level: {currentLevelIndex + 1} {isLevelComplete && ' - completed!'}</h1>
                <button
                    onClick={() => setTubes(JSON.parse(JSON.stringify(levels[currentLevelIndex])))}
                    className="restartBtn">
                    Restart Level
                </button>
                <button
                    onClick={setupRandom}
                    className="restartBtn">
                    Setup Random Level
                </button>

                {isLevelComplete && levels[currentLevelIndex+1] && <button
                    onClick={setupNextLevel}
                    className="nextLevelBtn">
                    Next  Level
                </button>}
            </div>
            <div className="level">
                {tubes.map((layers, index) => (
                    <Tube
                        layers={layers}
                        selected={index === selected}
                        onClick={() => manipulateTubes(index)}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;
