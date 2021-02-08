import React from "react";

function NextScreen({switchToNextLevel, show}) {
    return (
        <div className={`screen nextScreen ${show && 'show'}`} >
            <h1>Great Job!</h1>

            <button
               title="Next level"
               className="nextLevelBtn btn linkBtn"
               onClick={switchToNextLevel}
            >
                Next Level
            </button>
        </div>
    );
}

export default NextScreen;
