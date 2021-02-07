import './App.css';
import Tube from "./Tube";
import React, {useState} from "react";
import {checkLevelCompletion} from "./levels.js";
import {throttle} from "throttle-debounce";
import NextScreen from "./NextScreen";
import LevelsScreen from "./LevelsScreen";
import deepcopy from "deepcopy";

const levels = require('./levels-setup.json');

function App() {
    const [tubes, setTubes] = useState(JSON.parse(JSON.stringify(levels[0])))
    const [selected, setSelected] = useState(-1)
    const [arrowPosition, setArrowPosition] = useState(-1)
    const [isLevelComplete, setLevelComplete] = useState(false)
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
    const [activeScreen, setActiveScreen] = useState('gameScreen')
    const [actionHistory, setActionHistory] = useState([])

    const manipulateTubes = (index) => {
        if (selected === -1) {
            setSelected(index)
        } else {
            if (index !== selected) {
                const from = tubes[selected]
                const to = tubes[index]

                let layersCount = 0
                while (
                    from.length !== 0 && to.length !== 4
                    && (from[from.length - 1] === to[to.length - 1] || to.length === 0)
                    ) {
                    to.push(from.pop())
                    layersCount++
                }

                setActionHistory([...actionHistory, {from: selected, to: index, layers: layersCount}])
                setTubes(tubes)
            }

            setSelected(-1)
        }

        if (checkLevelCompletion(tubes)) {

            setTimeout(() => {
                setLevelComplete(true)
                setActiveScreen('nextScreen')
            }, 500)
        }
    }

    const setupLevel = (index) => {
        if (levels[index]) {
            setTubes(deepcopy(levels[index]))
            setActionHistory([])
            setLevelComplete(false)
            setActiveScreen('gameScreen')
            setSelected(-1)
            setCurrentLevelIndex(index)
        }
    }

    const keyupHandler = (e) => {
        if (!e) return

        let pos
        if (e.key === 'ArrowRight') {
            pos = arrowPosition + 1
        } else if (e.key === 'ArrowLeft') {
            pos = arrowPosition - 1
        } else if (e.key === 'Enter') {
            if (activeScreen === 'nextScreen') {
                setupLevel(currentLevelIndex + 1)
                return
            }

            if (selected === -1) {
                setSelected(arrowPosition)
            } else if (arrowPosition === selected) {
                setSelected(-1)
            } else {
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

    // rewrite every render to have binding to setState, call it to prevent new function after reload reload
    window.onkeydown = throttle(100, false, keyupHandler)
    window.onkeydown()

    const clickTubeHandler = (index) => {
        setArrowPosition(-1)
        manipulateTubes(index)
        console.log(index)
    }

    const undo = () => {
        const lastAction = actionHistory.pop()
        if (lastAction) {
            const updTubes = deepcopy(tubes)
            for (let i=0; i<lastAction.layers; i++) {
                updTubes[lastAction.from].push(updTubes[lastAction.to].pop())
            }

            setTubes(updTubes)
            setActionHistory(actionHistory)
        }
    }

    return (
        <div className="App">
            <div className="header">
                <button
                    onClick={() => setActiveScreen('settingsScreen')}
                    className="settingsBtn btn linkBtn"
                    title="Settings"
                >
                    <svg>
                        <use xlinkHref="#icon-settings"/>
                    </svg>
                </button>

                <button
                    onClick={() => setActiveScreen('levelsScreen')}
                    className="levelsBtn btn linkBtn"
                    title="Choose Level"
                >
                    <svg>
                        <use xlinkHref="#icon-levels"/>
                    </svg>
                </button>

                <button
                    onClick={() => setupLevel(currentLevelIndex)}
                    className="restartBtn btn linkBtn"
                    title="Restart Level"
                >
                    <svg>
                        <use xlinkHref="#icon-reload"/>
                    </svg>
                </button>

                <button
                    onClick={undo}
                    className="undoBtn btn linkBtn"
                    title="Undo"
                >
                    <svg>
                        <use xlinkHref="#icon-undo"/>
                    </svg>
                </button>


                {/*{levels[currentLevelIndex + 1] && <button*/}
                {/*    onClick={() => setupLevel(currentLevelIndex + 1)}*/}
                {/*    className="nextLevelBtn">*/}
                {/*    Next Level*/}
                {/*</button>}*/}
            </div>

            <h1 className="levelTitle">Level: {currentLevelIndex + 1} {isLevelComplete && ' - completed!'}</h1>

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

            <NextScreen
                show={activeScreen === 'nextScreen'}
                switchToNextLevel={() => setupLevel(currentLevelIndex + 1)}
            />

            <LevelsScreen
                show={activeScreen === 'levelsScreen'}
                onSelectLevel={setupLevel}
                activateScreen={() => setActiveScreen}
            />
        </div>
    );
}

export default App;