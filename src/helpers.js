export const vibrate = (pattern = 200) => {
	if (window.navigator.vibrate) {
		window.navigator.vibrate(pattern)
	}
}