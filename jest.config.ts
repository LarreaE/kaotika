import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  
  testMatch: ['**/*.test.ts', '**/*.test.tsx'], // Patrones para encontrar archivos de test
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Entorno simulado para pruebas en navegador
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Transforma archivos JS, JSX, TS y TSX con Babel
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy', // Mock para estilos
    '^@/(.*)$': '<rootDir>/src/$1', // Ajusta si usas alias de rutas
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'], // Configuración de jest-dom
};

export default config;
