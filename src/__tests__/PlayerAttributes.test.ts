import { calculateAllAttributes } from '../helpers/PlayerAttributes';
import player from '../data/player.json'

describe('calculateAllAttributes', () => {
  it('Should calculate player attributes correctly', async () => {
    
    const mockPlayer = player;

    const mockSetCurrentAttributes = jest.fn();

    await calculateAllAttributes(mockPlayer, mockSetCurrentAttributes);

    expect(mockSetCurrentAttributes).toHaveBeenCalledWith({
      charisma: 102,
      constitution: 240,
      dexterity: 174,
      insanity: 117,
      intelligence: 142,
      strength: 253,
    });
  
  });
});