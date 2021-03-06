import React from 'react'

const areas = 'abcdefghijklmn'

function Tube({layers = [], selected = false, hovered = false, onClick, index}) {
	const withEmpties = [...layers]
	while (withEmpties.length < 4) {
		withEmpties.push(0)
	}
	return (
		<div
			className={`tubeWrapper ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
			style={{gridArea: areas[index]}}>
			<div
				className={`tube tube-type-1`}
				onClick={onClick}
			>
				{withEmpties.map((color, index) => <div className={'layer color-' + color} key={index}/>)}
			</div>
			<div className="arrow"/>
		</div>
	)
}

export default Tube
