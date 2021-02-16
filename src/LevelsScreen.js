import React from "react";
import {SCREENS} from "./App";

const levels = require('./levels-setup.json');

function LevelsScreen({onSelectLevel, show, setActiveScreen}) {
    const levelThreshold = (parseInt(localStorage.getItem('last-completed-level')) || 0) + 1

    return (
        <div className={`screen levelsScreen ${show && 'show'}`}>
            <h1>Choose Level</h1>

            {show && <>
                <div className="levelsBtnsWrapper">
                    {levels.map((level, index) => (
                        <button
                            onClick={() => index <= levelThreshold && onSelectLevel(index)}
                            className={`levelNumberBtn linkBtn ${index >= 100 ? 'threeDigits' : ''}  ${index > levelThreshold ? 'disabledLevel' : ''}`}
                            key={index}
                        >{index + 1}</button>
                    ))}
                </div>

                <button
                    title="Go back"
                    className="backBtn btn linkBtn"
                    onClick={() => setActiveScreen(SCREENS.game)}
                >
                    Go Back
                </button>
            </>}
        </div>
    );
}

export default LevelsScreen;
