import './css/App.css';
import Tube from "./Tube";
import React, {useEffect, useState} from "react";
import {checkLevelCompletion} from "./levels.js";
import {throttle} from "throttle-debounce";
import NextScreen from "./NextScreen";
import LevelsScreen from "./LevelsScreen";
import deepcopy from "deepcopy";
import {Header} from "./Header";
import SettingsScreen from "./SettingsScreen";
import {sendAnalyticsEvent} from "./analytics";

export const SCREENS = {
    game: 'game',
    nextLevel: 'nextLevel',
    settings: 'settings',
    levels: 'levels',
}

const partseLevel = (levelString) => {
    const level = []
    for (let i = 0; i < levelString.length / 4; i++) {
        level[i] = [
            parseInt(levelString[i * 4], 32),
            parseInt(levelString[i * 4 + 1], 32),
            parseInt(levelString[i * 4 + 2], 32),
            parseInt(levelString[i * 4 + 3], 32)
        ]
    }

    level.push([], [])

    return level
}
const levels = require('./levels-setup.json').map(partseLevel);

function App() {
    const [tubes, setTubes] = useState(JSON.parse(JSON.stringify(levels[0])))
    const [selected, setSelected] = useState(-1)
    const [arrowPosition, setArrowPosition] = useState(-1)
    const [isLevelComplete, setLevelComplete] = useState(false)
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
    const [activeScreen, setActiveScreenOriginal] = useState('gameScreen')
    const [actionHistory, setActionHistory] = useState([])
    const [levelSetupTimestamp, setLevelSetupTimestamp] = useState(Date.now())

    const setActiveScreen = (value) => {
        setActiveScreenOriginal(value)
        sendAnalyticsEvent('activate_screen-value', {level: currentLevelIndex})
    }

    const setupLevel = (index = currentLevelIndex) => {
        if (levels[index]) {
            setTubes(deepcopy(levels[index]))
            setActionHistory([])
            setLevelComplete(false)
            setActiveScreen(SCREENS.game)


            setSelected(-1)
            setCurrentLevelIndex(index)
            localStorage.setItem('level', index.toString())

            setLevelSetupTimestamp(Date.now())
            sendAnalyticsEvent('setup_level', {level: index})
        }
    }

    const localLevel = parseInt(localStorage.getItem('level'))
    if (!isNaN(localLevel) && localLevel !== currentLevelIndex) {
        setupLevel(localLevel)
    }

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

                setSelected(layersCount ? -1 : index)
            } else {
                setSelected(selected === index ? -1 : index)
            }
        }

        if (checkLevelCompletion(tubes)) {
            setTimeout(() => {
                setLevelComplete(true)

                const prevLastCompletedLevel = parseInt(localStorage.getItem('last-completed-level'))
                localStorage.setItem('last-completed-level', Math.max(currentLevelIndex, prevLastCompletedLevel).toString())
                setActiveScreen(SCREENS.nextLevel)

                sendAnalyticsEvent('level_completed', {
                    level: currentLevelIndex,
                    solution: actionHistory,
                    time: (Date.now() - levelSetupTimestamp) / 1000
                })
            }, 500)
        }
    }

    const keyupHandler = (e) => {
        if (!e) return

        let pos
        if (e.key === 'ArrowRight') {
            pos = arrowPosition + 1
            sendAnalyticsEvent('tube_key-right', {level: currentLevelIndex})
        } else if (e.key === 'ArrowLeft') {
            pos = arrowPosition - 1
            sendAnalyticsEvent('tube_key-left', {level: currentLevelIndex})
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
                sendAnalyticsEvent('tube_keydown', {level: currentLevelIndex})
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
        sendAnalyticsEvent('tube_clicked', {level: currentLevelIndex})
        manipulateTubes(index)
    }

    const undo = () => {
        const lastAction = actionHistory.pop()
        if (lastAction) {
            const updTubes = deepcopy(tubes)
            for (let i = 0; i < lastAction.layers; i++) {
                updTubes[lastAction.from].push(updTubes[lastAction.to].pop())
            }

            setTubes(updTubes)
            setActionHistory(actionHistory)
            sendAnalyticsEvent('tube_left', {level: currentLevelIndex})
        }
    }

    const restartLevel = () => {
        sendAnalyticsEvent('level_restarted', {
            level: currentLevelIndex,
            history: actionHistory,
            time: (Date.now() - levelSetupTimestamp) / 1000
        })

        setupLevel()
    }

    return (
        <div className="App">
            <Header
                undoHandler={undo}
                restartHandler={restartLevel}
                setActiveScreen={setActiveScreen}
            />

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
                show={activeScreen === SCREENS.nextLevel}
                switchToNextLevel={() => setupLevel(currentLevelIndex + 1)}
            />

            <LevelsScreen
                show={activeScreen === SCREENS.levels}
                onSelectLevel={setupLevel}
                setActiveScreen={setActiveScreen}
            />

            <SettingsScreen
                show={activeScreen === SCREENS.settings}
                setActiveScreen={setActiveScreen}
            />
        </div>
    );
}

export default App;