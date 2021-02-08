import React from "react";
import {SCREENS} from "./App";

const levels = require('./levels-setup.json');

function LevelsScreen({onSelectLevel, show, setActiveScreen}) {
    return (
        <div className={`screen levelsScreen ${show && 'show'}`}>
            <h1>Choose Level</h1>

            <div className="levelsBtnsWrapper">
                {levels.map((level, index) => (
                    <button
                        onClick={() => onSelectLevel(index)}
                        className={`levelNumberBtn linkBtn ${index >= 100 ? 'threeDigits' : ''}`}
                        key={index}
                    >{index}</button>
                ))}
            </div>

            <button
                title="Go back"
                className="backBtn btn linkBtn"
                onClick={() => setActiveScreen(SCREENS.game)}
            >
                Go Back
            </button>
        </div>
    );
}

export default LevelsScreen;
