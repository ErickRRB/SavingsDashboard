import { useEffect, useState } from 'react';
import type { Currency } from '../lib/money';

interface Props {
  valueARS: number;
  onChange: (valueARS: number) => void;
  currency: Currency;
  rate: number;
  className?: string;
  ariaLabel?: string;
  placeholder?: string;
  disabled?: boolean;
}

const MoneyInput = ({
  valueARS,
  onChange,
  currency,
  rate,
  className,
  ariaLabel,
  placeholder,
  disabled,
}: Props) => {
  const [text, setText] = useState('');

  useEffect(() => {
    const amount = currency === 'ARS' ? valueARS : Math.round(valueARS / rate);
    if (!amount) {
      setText('');
      return;
    }
    const formatter = new Intl.NumberFormat('es-AR', {
      maximumFractionDigits: 0,
    });
    setText(formatter.format(amount));
  }, [valueARS, currency, rate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = Number(raw);
    onChange(currency === 'ARS' ? num : num * rate);
    const formatter = new Intl.NumberFormat('es-AR', {
      maximumFractionDigits: 0,
    });
    const formatted = raw === '' ? '' : formatter.format(num);
    setText(formatted);
  };

  return (
    <input
      type="text"
      value={text}
      onChange={handleChange}
      aria-label={ariaLabel}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};

export default MoneyInput;
