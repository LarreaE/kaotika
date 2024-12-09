import { calculateHitPoints } from '../helpers/calculateHitPoints';
import { mockAttributes, mockEmptyAttributes } from '../helpers/mockAttributes';

describe('Calculate HitPoints  CONS + DEX - INS / 2', () => {
  it('should calculate hit points correctly', () => {
    const result = calculateHitPoints(mockAttributes);
    expect(result).toBe(20 + 15 - 10 / 2); 
  });

  it('should handle edge cases correctly', () => {
    const result = calculateHitPoints(mockEmptyAttributes);
    expect(result).toBe(0); 
  });
});