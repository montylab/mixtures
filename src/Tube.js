import React from "react";

function Tube({layers = [], selected = false, onClick}) {
    const withEmpties = [...layers]
    while (withEmpties.length < 4) {
        withEmpties.push(0)
    }
    return (
        <div
            className={`tube ${selected ? 'selected' : ''}`}
            onClick={onClick}
        >
            {withEmpties.map((color, index) => <div className={'layer color-' + color} key={index}/>)}
        </div>
    );
}

export default Tube;
