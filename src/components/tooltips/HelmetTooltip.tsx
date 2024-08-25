import React from 'react';
import { Helmet } from '@/_common/interfaces/Helmet';

interface Props {
  element: Helmet;
  equiped: Helmet | null;
}

const HelmetTooltip: React.FC<Props> = ({ element, equiped }): React.ReactNode => {
  return (
    <div key={element._id} className='w-full p-4 text-center'>
      <div className="flex flex-row justify-items-center items-center">
        <div className="p-4">
          <h1 className="text-3xl mb-2 text-darkSepia">{element.name}</h1>
          <p className="text-2xl mb-2">{element.description}</p>
          <h1 className="text-3xl mb-2 text-darkSepia">Modifiers</h1>
          {element.modifiers.constitution ? <p className="text-2xl mb-2">Constitution: {element.modifiers.constitution}</p> : null}
          {element.modifiers.charisma ? <p className="text-2xl mb-2">Charisma: {element.modifiers.charisma}</p> : null}
          {element.modifiers.dexterity ? <p className="text-2xl mb-2">Dexterity: {element.modifiers.dexterity}</p> : null}
          {element.modifiers.insanity ? <p className="text-2xl mb-2">Insanity: {element.modifiers.insanity}</p> : null}
          {element.modifiers.intelligence ? <p className="text-2xl mb-2">Intelligence: {element.modifiers.intelligence}</p> : null}
          {element.modifiers.strength ? <p className="text-2xl mb-2">Strength: {element.modifiers.strength}</p> : null} 
        </div>
        {equiped 
        ?
        <div className="p-4">
          <h1 className="text-3xl mb-2 text-orange-500">{equiped.name}</h1>
          <p className="text-2xl mb-2">{equiped.description}</p>
          <h1 className="text-3xl mb-2 text-darkSepia">Modifiers</h1>
          {equiped.modifiers.constitution ? <p className={equiped.modifiers.constitution > element.modifiers.constitution ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Constitution: {equiped.modifiers.constitution}</p> : <p>-</p>}
          {equiped.modifiers.charisma ? <p className={equiped.modifiers.charisma > element.modifiers.charisma ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Charisma: {equiped.modifiers.charisma}</p> : <p>-</p>}
          {equiped.modifiers.dexterity ? <p className={equiped.modifiers.dexterity > element.modifiers.dexterity ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Dexterity: {equiped.modifiers.dexterity}</p> : <p>-</p>}
          {equiped.modifiers.insanity ? <p className={equiped.modifiers.insanity > element.modifiers.insanity ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Insanity: {equiped.modifiers.insanity}</p> : <p>-</p>}
          {equiped.modifiers.intelligence ? <p className={equiped.modifiers.intelligence > element.modifiers.intelligence ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Intelligence: {equiped.modifiers.intelligence}</p> : <p>-</p>}
          {equiped.modifiers.strength ? <p className={equiped.modifiers.strength > element.modifiers.strength ? "text-2xl mb-2 text-green-600" : "text-2xl mb-2 text-red-400"}>Strength: {equiped.modifiers.strength}</p> : <p>-</p>} 
        </div>
        : null } 
      </div>       
    </div>
  )
}

export default HelmetTooltip;