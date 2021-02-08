import React from "react";
import {SCREENS} from "./App";

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
    </div>
}