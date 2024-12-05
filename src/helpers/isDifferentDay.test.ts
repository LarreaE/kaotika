import { isDifferentDay } from "./isDifferentDay";

const d1 = new Date('2024-11-29T09:33:05.932+00:00');
const d2 = new Date('2024-11-30T09:33:05.932+00:00');

const s1 = new Date('2024-11-29T09:33:05.932+00:00');
const s2 = new Date('2024-11-29T11:33:05.932+00:00');

describe('Check if two dates have different Day', () => {
	it('should return the days are the same', () => {
		const result = isDifferentDay(s1,s2);
		expect(result).toBe(false);
	})
    
	it('should return true, the days are different', () => {
		const result = isDifferentDay(d1,d2);
		expect(result).toBe(true);
	})
})