import React, { useEffect, useState } from 'react';
import { Weapon } from '../../_common/interfaces/Weapon';
import { Armor } from '../../_common/interfaces/Armor';
import { Boot } from '@/_common/interfaces/Boot';
import { Helmet } from '@/_common/interfaces/Helmet';
import { Artifact } from '@/_common/interfaces/Artifact';
import { Ring } from '@/_common/interfaces/Ring';
import { Shield } from '@/_common/interfaces/Shield';
import { Modifier } from '@/_common/interfaces/Modifier';

type Item = Weapon | Armor | Boot | Helmet | Artifact | Ring | Shield;

interface ItemDetailsModalProps {
  item: Item;
  onClose: () => void;
}

const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({ item, onClose }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50
          transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Contenedor del modal con imagen de fondo */}
      <div
        ref={modalRef}
        className={`relative rounded-lg overflow-hidden transform transition-transform duration-300
            ${showModal ? 'scale-100' : 'scale-90'}`}
        style={{
          backgroundImage: `url('/images/pergamino.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '90%',
          maxWidth: '600px',
        }}
      >
        {/* Botón de cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-800 hover:text-gray-900 text-2xl"
          onClick={handleClose}
        >
          &times;
        </button>
        {/* Contenido del modal con ajuste de colores */}
        <div className="p-6 text-gray-900 bg-white bg-opacity-80">
          {/* Imagen del ítem */}
          <img
            src={item.image || '/placeholder.jpg'}
            alt={item.name || 'Unnamed Item'}
            className="w-full h-48 object-contain mb-4"
          />
          {/* Nombre del ítem */}
          <h2 className="text-3xl font-bold mb-2 text-brown-800 text-center">
            {item.name || 'Unnamed Item'}
          </h2>
          {/* Precio */}
          <div className="text-xl text-yellow-900 mb-2 text-center">
            Precio: ${item.value || 'N/A'}
          </div>
          {/* Descripción */}
          <p className="text-brown-800 mb-4 text-center">
            {item.description || 'No hay descripción disponible'}
          </p>
          {/* Información adicional del ítem */}
          <div className="mb-4">
            {/* Tipo */}
            {item.type && (
              <div className="text-lg text-brown-800 mb-2 text-center">
                Tipo: {item.type}
              </div>
            )}
            {/* Requerimiento de nivel */}
            {item.min_lvl !== undefined && (
              <div className="text-lg text-brown-800 mb-2 text-center">
                Nivel requerido: {item.min_lvl}
              </div>
            )}
          </div>
          {/* Modificadores */}
          {item.modifiers && (
            <div className="mb-4">
              <h3 className="text-2xl font-semibold mb-2 text-brown-800 text-center">
                Modificadores
              </h3>
              <ul className="text-brown-800 text-xl">
                {Object.entries(item.modifiers)
                  .filter(
                    ([key, value]) =>
                      key !== '_id' && value !== 0 && value !== undefined
                  )
                  .map(([key, value]) => (
                    <li
                      key={key}
                      className="flex justify-between px-4 py-2 border-b border-sepia"
                    >
                      <span>{capitalize(key)}</span>
                      <span>{value! > 0 ? `+${value}` : value}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;