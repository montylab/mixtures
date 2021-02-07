import './App.css';
import Tube from "./Tube";
import React, {useEffect, useState} from "react";
import {checkLevelCompletion, generateLevel} from "./levels.js";
import {throttle} from "throttle-debounce";

const levels = require('./levels-setup.json');

function App() {
    const [tubes, setTubes] = useState(JSON.parse(JSON.stringify(levels[0])))
    const [selected, setSelected] = useState(-1)
    const [arrowPosition, setArrowPosition] = useState(-1)
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

    const keyupHandler = (e) => {
        if (!e) return

        let pos
        if (e.key === 'ArrowRight') {
            pos = arrowPosition + 1
        } else if (e.key === 'ArrowLeft') {
            pos = arrowPosition - 1
        } else if (e.key === 'Enter') {
            if (selected === -1) {
                setSelected(arrowPosition)
            } else if (arrowPosition === selected) {
                setSelected(-1)
            } else {
                console.log('helloy')
                manipulateTubes(arrowPosition)
            }

            return
        }

        if (pos > tubes.length - 1) {
            pos = 0
        } else if (pos < 0) {
            pos = tubes.length - 1
        }

        setArrowPosition(!isNaN(pos) ? pos : -1)
    }

    // rewrite every render to have binding to setState
    window.onkeydown = throttle(100, false, keyupHandler)
    window.onkeydown()

    const clickTubeHandler = (index) => {
        setArrowPosition(-1)
        manipulateTubes(index)
        console.log(index)
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
                        hovered={index === arrowPosition}
                        onClick={() => clickTubeHandler(index)}
                        key={index}
                    />
                ))}
            </div>

            {arrowPosition} - {selected}
        </div>
    );
}

export default App;