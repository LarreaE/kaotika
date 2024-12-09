import { calculateDefense } from "../helpers/calculateDefense"
import { mockAttributes, mockEmptyAttributes } from "../helpers/mockAttributes";

describe('Calculate defense DEX + CONS + INT / 2', () => {
	it('should calculate defense correctly', () => {
		const result = calculateDefense(mockAttributes);
		expect(result).toBe(15 + 20 + 10 / 2);
	})
	it('should handle edge cases correctly', () => {
    const result = calculateDefense(mockEmptyAttributes);
    expect(result).toBe(0); 
  });
})