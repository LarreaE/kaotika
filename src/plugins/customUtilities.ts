// src/plugins/customUtilities.ts
const customUtilities = ({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) => {
    addUtilities({
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
      });
  };
  
  export default customUtilities;