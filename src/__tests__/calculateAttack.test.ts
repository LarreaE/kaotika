import { calculateAttack } from "../helpers/calculateAttack"
import { mockAttributes, mockEmptyAttributes } from "../helpers/mockAttributes";

describe('Calculate attack STR - INS / 2', () => {
	it('should calculate attack correctly', () => {
		const result = calculateAttack(mockAttributes);
		expect(result).toBe(10 - 10 / 2);
	})
	it('should handle edge cases correctly', () => {
    const result = calculateAttack(mockEmptyAttributes);
    expect(result).toBe(0); 
  });
})