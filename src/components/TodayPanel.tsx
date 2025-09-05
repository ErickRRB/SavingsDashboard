import type { DayMetric } from '../lib/calc';
import { formatARS } from '../lib/money';

interface Props {
  info: DayMetric | undefined;
}

const TodayPanel = ({ info }: Props) => {
  if (!info) return null;
  return (
    <div className="p-4 rounded-2xl bg-white shadow-sm">
      <h3 className="font-bold mb-2">Hoy</h3>
      <div className="space-y-1 text-sm">
        <div>Cupo de hoy: {formatARS(info.cupoDeHoy)}</div>
        <div>Gastado hoy: {formatARS(info.gastoDia)}</div>
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
        <div>Restante mes: {formatARS(Math.max(info.presupuestoRestante, 0))}</div>
        <div>Días restantes: {info.diasRestantes}</div>
      </div>
    </div>
  );
};

export default TodayPanel;
