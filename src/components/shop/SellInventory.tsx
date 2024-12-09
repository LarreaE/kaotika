import React from 'react';
import Droppable from '../Droppable';
import Draggable from '../Draggable';

interface InventoryProps {
  player: any;
  GRID_NUMBER: number;
  selectItem: (item: any) => void;
}

const SellInventory: React.FC<InventoryProps> = ({ player, GRID_NUMBER, selectItem }) => {
  return (
    <>
      {player && (
        <div
          className="grid grid-cols-8 grid-rows-8"
          style={{ width: 'fit-content', height: 'fit-content' }}
        >
          {player?.inventory.helmets.map(helmet => {
            return (
            <div onClick={() => selectItem(helmet)} key={helmet._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={10}  type='inventory' children={<Draggable id={helmet._id} position='bottom' type={[`${helmet.min_lvl <= player.level ? helmet.type : null}`, 'inventory']} element={helmet} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.weapons.map(weapon => {
            return (
            <div onClick={() => selectItem(weapon)} key={weapon._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={20}  type='inventory' children={<Draggable id={weapon._id} position='bottom' type={[`${weapon.min_lvl <= player?.level ? weapon.type : null}`, 'inventory']} element={weapon} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.armors.map(armor => {
            return (
            <div onClick={() => selectItem(armor)} key={armor._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>    
                <Droppable id={30}  type='inventory' children={<Draggable id={armor._id} position='bottom' type={[`${armor.min_lvl <= player?.level ? armor.type : null}`, 'inventory']} element={armor} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>                      
            </div>
            )
        })
        }
        {
        player?.inventory.shields.map(shield => {
            return (
            <div onClick={() => selectItem(shield)} key={shield._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={40}  type='inventory' children={<Draggable id={shield._id} position='bottom' type={[`${shield.min_lvl <= player?.level ? shield.type : null}`, 'inventory']} element={shield} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.artifacts.map(artifact => {
            return (
            <div onClick={() => selectItem(artifact)} key={artifact._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={50}  type='inventory' children={<Draggable id={artifact._id} position='bottom' type={[`${artifact.min_lvl <= player?.level ? artifact.type : null}`, 'inventory']} element={artifact} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.boots.map(boot => {
            return (
            <div onClick={() => selectItem(boot)} key={boot._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={boot._id} position='bottom' type={[`${boot.min_lvl <= player?.level ? boot.type : null}`, 'inventory']} element={boot} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.rings.map(ring => {
            return (
            <div onClick={() => selectItem(ring)} key={ring._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={ring._id} position='bottom' type={[`${ring.min_lvl <= player?.level ? ring.type : null}`, 'inventory']} element={ring} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.healing_potions.map(healing => {
            return (
            <div key={healing._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={healing._id} position='bottom' type={[`${healing.type}`, 'inventory']} element={healing} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.antidote_potions.map(antidote => {
            return (
            <div key={antidote._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={antidote._id} position='bottom' type={[`${antidote.type}`, 'inventory']} element={antidote} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })
        }
        {
        player?.inventory.enhancer_potions.map(enhancer => {
            return (
            <div key={enhancer._id} className="flex justify-center items-center bg-black/30 aspect-square" style={{'border': '3px ridge #000000'}}>
                <Droppable id={1}  type='inventory' children={<Draggable id={enhancer._id} position='bottom' type={[`${enhancer.type}`, 'inventory']} element={enhancer} tooltipClassName="w-full text-4xl mb-4 border-1 rounded-lg border-sepia bg-black/90" className={undefined} width="150px" border="" />}/>
            </div>
            )
        })}
          {Array.from({
            length:
              GRID_NUMBER -
              player.inventory.helmets.length -
              player.inventory.weapons.length -
              player.inventory.armors.length -
              player.inventory.shields.length -
              player.inventory.artifacts.length -
              player.inventory.boots.length -
              player.inventory.rings.length -
              player.inventory.healing_potions.length -
              player.inventory.antidote_potions.length -
              player.inventory.enhancer_potions.length,
          }).map((_, index) => (
            <div
              key={index}
              className="flex justify-center items-center bg-black/30 aspect-square"
              style={{ border: '3px ridge #000000' }}
            >
              <Droppable id={23} type="inventory" children={null} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SellInventory;
