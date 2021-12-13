export type TimeUnit = 'SEC' | 'MIN' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
export const TIME = {
	SEC: 1000,
	MIN: 1000 * 60,
	HOUR: 1000 * 60 * 60,
	DAY: 1000 * 60 * 60 * 24,
	WEEK: 1000 * 60 * 60 * 24 * 7,
	MONTH: 1000 * 60 * 60 * 24 * 30,
	YEAR: 1000 * 60 * 60 * 24 * 365,
	getMS(n: number, unit: TimeUnit) {
		return n * this[unit]
	},
}
