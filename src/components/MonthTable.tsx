import type { DayMetric } from '../lib/calc';
import type { Currency } from '../lib/money';
import { formatMoney } from '../lib/money';
import MoneyInput from './MoneyInput';

interface Props {
  metrics: DayMetric[];
  onChange: (key: string, value: number) => void;
  currency: Currency;
  rate: number;
  rateLoaded: boolean;
}

const MonthTable = ({ metrics, onChange, currency, rate, rateLoaded }: Props) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="bg-slate-200">
          <th className="p-2">Fecha</th>
          <th className="p-2">Día</th>
          <th className="p-2">Gasto</th>
          <th className="p-2">Acumulado</th>
          <th className="p-2">Días rest.</th>
          <th className="p-2">Presup. rest.</th>
          <th className="p-2">Cupo hoy</th>
          <th className="p-2">Estado</th>
          <th className="p-2">Desvío</th>
        </tr>
      </thead>
      <tbody>
        {metrics.map((m) => {
          const inputColor =
            m.gastoDia === 0
              ? 'bg-yellow-100'
              : m.gastoDia <= m.cupoDeHoy
              ? 'bg-green-100'
              : 'bg-red-100';
          const rowColor = m.presupuestoRestante < 0 ? 'bg-red-50' : '';
          return (
            <tr key={m.dateKey} className={rowColor}>
              <td className="p-2 whitespace-nowrap">{m.dateKey}</td>
              <td className="p-2 capitalize">{m.weekday}</td>
              <td className="p-2">
                <MoneyInput
                  ariaLabel={`Gasto ${m.dateKey}`}
                  valueARS={m.gastoDia}
                  onChange={(v) => onChange(m.dateKey, v)}
                  currency={currency}
                  rate={rate}
                  className={`w-24 px-2 py-1 rounded ${inputColor}`}
                  disabled={currency === 'USD' && !rateLoaded}
                />
              </td>
              <td className="p-2">{formatMoney(m.gastoAcumulado, currency, rate)}</td>
              <td className="p-2">{m.diasRestantes}</td>
              <td className="p-2">
                {formatMoney(Math.max(m.presupuestoRestante, 0), currency, rate)}
              </td>
              <td className="p-2">{formatMoney(m.cupoDeHoy, currency, rate)}</td>
              <td className="p-2">
                {m.estado && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      m.estado === 'BUENO'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {m.estado}
                  </span>
                )}
              </td>
              <td
                className={`p-2 ${
                  m.desvio >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatMoney(m.desvio, currency, rate)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default MonthTable;
