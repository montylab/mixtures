import React from "react";
import {SCREENS} from "./App";


const requestFunction = document.body.requestFullscreen || document.body.webkitRequestFullscreen  || (() => {})
const exitFunction = document.exitFullscreen || document.webkitExitFullscreen || (() => {})
const toggleFullscreen = () => {
    const fullScreenState = document.fullscreenElement || document.webkitIsFullScreen || false

    if (fullScreenState) {
        exitFunction.call(document)
    } else {
        requestFunction.call(document.body)
    }

    if (window.navigator.vibrate) {
        window.navigator.vibrate(200);
    }
}


export const Header = ({setActiveScreen, restartHandler, undoHandler}) => {

    return <div className="header">
        <button
            onClick={() => setActiveScreen(SCREENS.settings)}
            className="settingsBtn btn linkBtn"
            title="Settings"
        >
            <svg>
                <use xlinkHref="#icon-settings"/>
            </svg>
        </button>

        <button
            onClick={() => setActiveScreen(SCREENS.levels)}
            className="levelsBtn btn linkBtn"
            title="Choose Level"
        >
            <svg>
                <use xlinkHref="#icon-levels"/>
            </svg>
        </button>

        <button
            onClick={restartHandler}
            className="restartBtn btn linkBtn"
            title="Restart Level"
        >
            <svg>
                <use xlinkHref="#icon-reload"/>
            </svg>
        </button>

        <button
            onClick={undoHandler}
            className="undoBtn btn linkBtn"
            title="Undo"
        >
            <svg>
                <use xlinkHref="#icon-undo"/>
            </svg>
        </button>

        <button
            onClick={toggleFullscreen}
            className="fullscreenBtn btn"
            title="Switch To Full Screen"
        >
            Fullscreen
        </button>


    </div>
}