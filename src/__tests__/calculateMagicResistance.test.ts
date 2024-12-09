import { calculateMagicResistance } from "../helpers/calculateMagicResistance"
import { mockAttributes, mockEmptyAttributes } from "../helpers/mockAttributes"

describe('Calculate Magic Resistance INT + CHAR', () => {
	it('should calculate magic resistance correctly', () => {
		const result = calculateMagicResistance(mockAttributes);
		expect(result).toBe(10 + 10);
	})
	it('should handle edge cases correctly', () => {
		const result = calculateMagicResistance(mockEmptyAttributes);
		expect(result).toBe(0);
	})
})