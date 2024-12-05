import { Modifier } from '../_common/interfaces/Modifier';

const isModifier = (value: any): value is Modifier => {
    const modifierKeys = ['intelligence', 'dexterity', 'constitution', 'insanity', 'charisma', 'strength'];
    return modifierKeys.every((key) => key in value);
  };

  export default isModifier;