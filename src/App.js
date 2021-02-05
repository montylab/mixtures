import './App.css';
import Tube from "./Tube";
import React, {useState} from "react";
import {checkLevelCompletion, generateLevel, levels} from "./levels";

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
        const level = generateLevel()
        levels.push(level)
        setTubes(level)
        setLevelComplete(false)
        setSelected(-1)
        setCurrentLevelIndex(levels.length - 1)
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

                {1 && levels[currentLevelIndex+1] && <button
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