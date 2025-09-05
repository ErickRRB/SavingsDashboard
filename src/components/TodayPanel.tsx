import type { DayMetric } from '../lib/calc';
import type { Currency } from '../lib/money';
import { formatMoney } from '../lib/money';

interface Props {
  info: DayMetric | undefined;
  currency: Currency;
  rate: number;
}

const TodayPanel = ({ info, currency, rate }: Props) => {
  if (!info) return null;
  return (
    <div className="p-4 rounded-2xl bg-white shadow-sm">
      <h3 className="font-bold mb-2">Hoy</h3>
      <div className="space-y-1 text-sm">
        <div>Cupo de hoy: {formatMoney(info.cupoDeHoy, currency, rate)}</div>
        <div>Gastado hoy: {formatMoney(info.gastoDia, currency, rate)}</div>
        <div>
          Estado:{' '}
          {info.estado ? (
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                info.estado === 'BUENO'
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}
            >
              {info.estado}
            </span>
          ) : (
            '—'
          )}
        </div>
        <div>
          Restante mes: {formatMoney(Math.max(info.presupuestoRestante, 0), currency, rate)}
        </div>
        <div>Días restantes: {info.diasRestantes}</div>
      </div>
    </div>
  );
};

export default TodayPanel;
