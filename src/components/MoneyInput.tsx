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
    const amount = currency === 'ARS' ? valueARS : valueARS / rate;
    if (!amount) {
      setText('');
      return;
    }
    const locale = currency === 'ARS' ? 'es-AR' : 'en-US';
    const decimals = amount % 1 === 0 ? 0 : amount.toString().split('.')[1].length;
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    setText(formatter.format(amount));
  }, [valueARS, currency, rate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.,]/g, '');
    const lastComma = raw.lastIndexOf(',');
    const lastDot = raw.lastIndexOf('.');
    const sepIndex = Math.max(lastComma, lastDot);
    let intPart = raw;
    let decPart = '';
    let trailing = false;
    if (sepIndex >= 0) {
      intPart = raw.slice(0, sepIndex);
      decPart = raw.slice(sepIndex + 1).replace(/[.,]/g, '');
      trailing = sepIndex === raw.length - 1;
    }
    intPart = intPart.replace(/[.,]/g, '');
    decPart = decPart.slice(0, 2);
    const num = Number(intPart + (decPart ? '.' + decPart : ''));
    onChange(currency === 'ARS' ? num : num * rate);
    const locale = currency === 'ARS' ? 'es-AR' : 'en-US';
    const decimalSymbol = currency === 'ARS' ? ',' : '.';
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decPart.length,
      maximumFractionDigits: decPart.length,
    });
    let formatted = intPart === '' && decPart === '' ? '' : formatter.format(num);
    if (trailing && decPart.length === 0) formatted += decimalSymbol;
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
