import { formatARS } from '../lib/money';

interface Props {
  label: string;
  value: number;
}

const KPICard = ({ label, value }: Props) => (
  <div className="p-4 rounded-2xl bg-white shadow-sm flex flex-col">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-xl font-bold">{formatARS(value)}</span>
  </div>
);

export default KPICard;
