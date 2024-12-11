import { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/shop/[playerEmail]/[merchantId]/[itemId]';
import mongoose from '@/DB/mongoose/config';
import { Player, Weapon, Shield, Alchemist, Weaponsmith } from '@/DB/mongoose/models/models';
import { transformStringSingular } from '@/helpers/transformString';

// Mock dependencies
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

describe('API Route - Instant buy item', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;

  beforeEach(() => {

    req = {
      query: {
        playerEmail: 'test@example.com',
        merchantId: 'weaponsmith',
        itemId: 'sword',
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

  it('should return 400 if parameters are missing', async () => {
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

  it('should check if the player has enough money in server side', async () => {
    //arrange
    req = {
        query: {
          playerEmail: 'test@example.com',
          merchantId: 'weaponsmith',
          itemId: 'blocka',
        },
      };

    const mockPlayer = {
        _id: 'player123',
        email: 'test@example.com',
        gold: 100, //less money
        inventory: {
          shields: [],
        },
      };
  
    const mockItem = {
    name: 'blocka',
    type: 'shield',
    value: 500,
    };

    const mockModel = {
    aggregate: jest.fn().mockResolvedValue([mockItem]),
    };
  
    (mongoose as any).models = { shield: mockModel };
    (transformStringSingular as jest.Mock).mockReturnValue('shield');
    
    (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
    (Player.findOneAndUpdate as jest.Mock).mockResolvedValue({
    ...mockPlayer,
    gold: 500,
    inventory: { shields: [mockItem] },
    });

    //act
    await handler(req as NextApiRequest, res as NextApiResponse);

    //assert
    expect(transformStringSingular).toHaveBeenCalledWith('weaponsmith');
    expect(Player.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
    expect(Player.findOneAndUpdate).not.toHaveBeenCalled(); //no update
    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
        error: 'Insufficient gold',
    });
  });

  it('should transfer item to the player (weapon)', async () => {

    //arrange
    const mockPlayer = {
      _id: 'player123',
      email: 'test@example.com',
      gold: 1000,
      inventory: {
        weapons: [],
      },
    };

    const mockItem = {
      name: 'sword',
      type: 'weapon',
      value: 500,
    };

    const mockModel = {
      aggregate: jest.fn().mockResolvedValue([mockItem]),
    };

    (mongoose as any).models = { weapon: mockModel };
    (transformStringSingular as jest.Mock).mockReturnValue('weapon');
    
    (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
    (Player.findOneAndUpdate as jest.Mock).mockResolvedValue({
    ...mockPlayer,
    gold: 500,
    inventory: { weapons: [mockItem] },
    });

    //act
    await handler(req as NextApiRequest, res as NextApiResponse);

    //assert
    expect(transformStringSingular).toHaveBeenCalledWith('weaponsmith');
    expect(Player.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
    expect(Player.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'player123' },
      {
        $set: { inventory: { weapons: [mockItem] } },
        $inc: { gold: -500 },
      },
      { returnDocument: 'after' },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      ...mockPlayer,
      gold: 500,
      inventory: { weapons: [mockItem] },
    });
  });

  it('should transfer item to the player (boots)', async () => {
    //arange
    req = {
        query: {
          playerEmail: 'test@example.com',
          merchantId: 'armorsmith',
          itemId: 'super boots',
        },
      };

    const mockPlayer = {
      _id: 'player123',
      email: 'test@example.com',
      gold: 1000,
      inventory: {
        boots: [],
      },
    };

    const mockItem = {
      name: 'super boots',
      type: 'boot',
      value: 500,
    };

    const mockModel = {
      aggregate: jest.fn().mockResolvedValue([mockItem]),
    };

    (mongoose as any).models = { boot: mockModel };
    (transformStringSingular as jest.Mock).mockReturnValue('boot');
    (Player.findOne as jest.Mock).mockResolvedValue(mockPlayer);
    (Player.findOneAndUpdate as jest.Mock).mockResolvedValue({
      ...mockPlayer,
      gold: 500,
      inventory: { boots: [mockItem] },
    });

    //act
    await handler(req as NextApiRequest, res as NextApiResponse);

    //assert
    expect(transformStringSingular).toHaveBeenCalledWith('armorsmith');
    expect(Player.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(mockModel.aggregate).toHaveBeenCalledWith(expect.any(Array));
    expect(Player.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: 'player123' },
      {
        $set: { inventory: { boots: [mockItem] } },
        $inc: { gold: -500 },
      },
      { returnDocument: 'after' },
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      ...mockPlayer,
      gold: 500,
      inventory: { boots: [mockItem] },
    });
  });
});
