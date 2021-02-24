export const sendAnalyticsEvent = (eventName: string, args: any) => {
	// @ts-ignore
	window.gtag('event', eventName, args)
}