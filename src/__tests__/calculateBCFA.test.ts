import { calculateBCFA } from "../helpers/calculateBCFA"
import { mockAttributes, mockEmptyAttributes } from "../helpers/mockAttributes"

describe('Calculate BCFA STR + INS', () => {
	it('should calculate BCFA correctly', () => {
		const result =  calculateBCFA(mockAttributes);
		expect(result).toBe(10 + 10);
	})
	it('should handle edge cases correctly', () => {
    const result = calculateBCFA(mockEmptyAttributes);
    expect(result).toBe(0); 
  });
})