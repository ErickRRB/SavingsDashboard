import { useState } from 'react';
import type { Currency } from '../lib/money';
import { formatMoney } from '../lib/money';

export interface FixedItem {
  id: string;
  nombre: string;
  montoARS: number;
}

interface Props {
  items: FixedItem[];
  onChange: (items: FixedItem[]) => void;
  currency: Currency;
  rate: number;
}

const FixedList = ({ items, onChange, currency, rate }: Props) => {
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');

  const addItem = () => {
    if (!nombre || !monto) return;
    const newItem: FixedItem = {
      id: crypto.randomUUID(),
      nombre,
      montoARS: Number(monto) * (currency === 'ARS' ? 1 : rate),
    };
    onChange([...items, newItem]);
    setNombre('');
    setMonto('');
  };

  const remove = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-2">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <span className="flex-1">{item.nombre}</span>
            <span>{formatMoney(item.montoARS, currency, rate)}</span>
            <button
              onClick={() => remove(item.id)}
              aria-label="Eliminar gasto fijo"
              className="text-red-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          aria-label="Nombre gasto fijo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Nombre"
        />
        <input
          aria-label="Monto gasto fijo"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="border rounded px-2 py-1 w-28"
          placeholder={currency}
        />
        <button
          onClick={addItem}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default FixedList;
