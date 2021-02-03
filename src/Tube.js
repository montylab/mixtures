import React from "react";

function Tube({layers = [], selected = false, onClick}) {
    console.count('tubeRender')
    return (
        <div
            className={`tube ${selected ? 'selected' : ''}`}
            onClick={onClick}
        >
            {layers.map((color, index) => <div className={'layer color-' + color} key={index}/>)}
        </div>
    );
}

export default Tube;
