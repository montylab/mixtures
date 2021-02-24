import React from 'react'
import {SCREENS} from './App'

function SettingsScreen({setActiveScreen, show}) {
	return (
		<div className={`screen settingsScreen ${show && 'show'}`}>
			<h1>Settings</h1>

			<button
				title="Go back"
				className="backBtn btn linkBtn"
				onClick={() => setActiveScreen(SCREENS.game)}
			>
				Go Back
			</button>
		</div>
	)
}

export default SettingsScreen
