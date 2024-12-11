
import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/shop/checkout/[playerEmail]/[items]';
import mongoose from '@/DB/mongoose/config';
import { Player } from '@/DB/mongoose/models/models';
import { transformStringSingular } from '@/helpers/transformString';
import { decreasePurchasedGold } from '@/helpers/decreasePurchaseGold';
import { transferItemToPlayer } from '@/helpers/transferItemToPlayer';

//mock dependencies
jest.mock('@/DB/mongoose/config', () => ({
  models: {},
}));

jest.mock('@/DB/mongoose/models/models', () => ({
  Player: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

jest.mock('@/helpers/transformString', () => ({
  transformStringSingular: jest.fn(),
}));

describe('Checkout API Route - Purchase Multiple Items', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      query: {
        playerEmail: 'test@example.com',
        items: encodeURIComponent(JSON.stringify([          //encoded data
          { type: 'weapon', name: 'Shardblade', value: 500 },
          { type: 'shield', name: 'Wooden Shield', value: 300 },
        ])),
      },
    };

    jsonMock = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPlayer = {
    _id: 'player123',
    email: 'test@example.com',
    gold: 1000,
    inventory: {
      weapons: [],
      shields: [],
    },
  };

  const mockWeapon = { name: 'Shardblade', type: 'weapon', value: 500 };
  const mockShield = { name: 'Wooden Shield', type: 'shield', value: 300 };

  const mockWeaponModel = {
    findOne: jest.fn().mockResolvedValue(mockWeapon),
  };

  const mockShieldModel = {
    findOne: jest.fn().mockResolvedValue(mockShield),
  };

  describe('decreasePurchasedGold', () => {
    it('should deduct item value from player gold', () => {
        //arrange
      const player = { gold: 1000, inventory: {} } as any;
      const item = { value: 200 } as any;

      //act
      decreasePurchasedGold(player, item);

      //assert
      expect(player.gold).toBe(800);
    });
  });

  describe('transferItemToPlayer', () => {
    it('should transfer an item to the player if they have enough gold', async () => {
      //arrange
      (transformStringSingular as jest.Mock).mockReturnValue('weapon');
      (mongoose as any).models.weapon = mockWeaponModel;

      //act
      const updatedPlayer = await transferItemToPlayer(mockPlayer, 'weapon', 'sword');

      //assert
      expect(transformStringSingular).toHaveBeenCalledWith('weapon');
      expect(mockWeaponModel.findOne).toHaveBeenCalledWith({ name: 'sword' });
      expect(updatedPlayer.inventory.weapons).toContain(mockWeapon);
      expect(updatedPlayer.gold).toBe(500); //initial gold (1000) - sword value (500)
    });

    it('should throw an error if the item is not found', async () => {
        //arrange
        (mongoose as any).models.weapon = { findOne: jest.fn().mockResolvedValue(null) };
        
        //assert    act
        await expect(transferItemToPlayer(mockPlayer, 'weapon', 'nonexistent'))
            .rejects.toThrow('Item not found or already sold');
    });

    it('should throw an error if the player has insufficient gold', async () => {
        //arrange
      const poorPlayer = { ...mockPlayer, gold: 100 };
      (transformStringSingular as jest.Mock).mockReturnValue('weapon');
      (mongoose as any).models.weapon = mockWeaponModel;

      //act 
      await transferItemToPlayer(poorPlayer, 'weapon', 'Shardblade');
      //assert      act
      await expect()
        .rejects.toThrow('Insufficient gold');
    });
  });

  describe('API handler', () => {
    it('should return 400 if required parameters are missing', async () => {
        //arrange
      req.query = {};
      //act
      await handler(req as NextApiRequest, res as NextApiResponse);

      //assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Item Id , itemtype or playerEmail is required.',
      });
    });

    it('should handle multiple item purchases', async () => {
      //arrange
      (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
      (Player.findOneAndUpdate as jest.Mock).mockResolvedValue({
        ...mockPlayer,
        gold: 200, // remaining gold
        inventory: {
          weapons: [mockWeapon],
          shields: [mockShield],
        },
      });

      (mongoose as any).models.weapon = mockWeaponModel;
      (mongoose as any).models.shield = mockShieldModel;
      (transformStringSingular as jest.Mock)
        .mockImplementation((type: string) => type);
      //act
      await handler(req as NextApiRequest, res as NextApiResponse);

      //assert
      expect(Player.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockWeaponModel.findOne).toHaveBeenCalledWith({ name: 'Shardblade' });
      expect(mockShieldModel.findOne).toHaveBeenCalledWith({ name: 'Wooden Shield' });
      expect(Player.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'player123' },
        {
          $set: {
            inventory: {
              weapons: [mockWeapon],
              shields: [mockShield],
            },
            gold: 200,
          },
        },
        { returnDocument: 'after' },
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return an error due to the player not having enough money', async () => {
        //arrange
      const unavailableItemModel = { findOne: jest.fn().mockResolvedValue(null) };
      (mongoose as any).models.weapon = mockWeaponModel;
      (mongoose as any).models.shield = unavailableItemModel;

      (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
      (Player.findOneAndUpdate as jest.Mock).mockResolvedValue({
        ...mockPlayer,
        gold: 500,
        inventory: { weapons: [mockWeapon], shields: [] },
      });
      (transformStringSingular as jest.Mock)
        .mockImplementation((type: string) => type);

        //act
      await handler(req as NextApiRequest, res as NextApiResponse);

      //assert
      expect(mockWeaponModel.findOne).toHaveBeenCalledWith({ name: 'Shardblade' });
      expect(unavailableItemModel.findOne).toHaveBeenCalledWith({ name: 'Wooden Shield' });
      expect(Player.findOneAndUpdate).not.toHaveBeenCalledWith();
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
