import type { Currency } from '../lib/money';
import { formatMoney } from '../lib/money';

interface Props {
  label: string;
  value: number;
  currency: Currency;
  rate: number;
}

const KPICard = ({ label, value, currency, rate }: Props) => (
  <div className="p-4 rounded-2xl bg-white shadow-sm flex flex-col">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-xl font-bold">
      {formatMoney(value, currency, rate)}
    </span>
  </div>
);

export default KPICard;
