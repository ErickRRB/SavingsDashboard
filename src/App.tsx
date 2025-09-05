import { useEffect, useMemo, useRef, useState } from 'react';
import KPICard from './components/KPICard';
import FixedList from './components/FixedList';
import type { FixedItem } from './components/FixedList';
import MonthTable from './components/MonthTable';
import TodayPanel from './components/TodayPanel';
import { getNumber, setNumber, getJSON, setJSON } from './lib/storage';
import { currentYearMonth, dateKey } from './lib/date';
import { computeMonthMetrics } from './lib/calc';
import type { DayMetric } from './lib/calc';
import type { Currency } from './lib/money';
import { formatMoney } from './lib/money';

import MoneyInput from './components/MoneyInput';


function App() {
  const [currency, setCurrency] = useState<Currency>(() =>
    getJSON('bt.currency', 'ARS'),
  );

  const initialRate = getNumber('bt.rate', 0);
  const [rate, setRate] = useState(initialRate || 1);
  const [rateLoaded, setRateLoaded] = useState(initialRate > 0);
  const [salary, setSalary] = useState(() => getNumber('bt.salary', 0));
  const [desiredSavings, setDesiredSavings] = useState(() =>
    getNumber('bt.desiredSavings', 0),
  );
  const [fixedList, setFixedList] = useState<FixedItem[]>(() =>
    getJSON('bt.fixedList', []),
  );
  const [yearMonth, setYearMonth] = useState(() =>
    getJSON('bt.yearMonth', currentYearMonth()),
  );
  const [spendMap, setSpendMap] = useState<Record<string, number>>(() =>
    getJSON(`bt.spend.${yearMonth}`, {}),
  );

  useEffect(() => setJSON('bt.currency', currency), [currency]);
  useEffect(() => setNumber('bt.salary', salary), [salary]);
  useEffect(() => setNumber('bt.desiredSavings', desiredSavings), [desiredSavings]);
  useEffect(() => setJSON('bt.fixedList', fixedList), [fixedList]);
  useEffect(() => setJSON('bt.yearMonth', yearMonth), [yearMonth]);
  const prevYearMonth = useRef(yearMonth);
  useEffect(() => {
    if (prevYearMonth.current !== yearMonth) {
      prevYearMonth.current = yearMonth;
      return;
    }
    setJSON(`bt.spend.${yearMonth}`, spendMap);
  }, [spendMap, yearMonth]);
  useEffect(() => setNumber('bt.rate', rate), [rate]);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((r) => r.json())
      .then((data) => setRate(data.rates.ARS))
      .catch(() => {})
      .finally(() => setRateLoaded(true));
  }, []);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((r) => r.json())
      .then((data) => setRate(data.rates.ARS))
      .catch(() => setRate(1));
  }, []);

  useEffect(() => {
    setSpendMap(getJSON(`bt.spend.${yearMonth}`, {}));
  }, [yearMonth]);

  const fixedTotal = useMemo(
    () => fixedList.reduce((sum, i) => sum + i.montoARS, 0),
    [fixedList],
  );
  const variableBudget = Math.max(0, salary - fixedTotal - desiredSavings);

  const metrics = computeMonthMetrics(yearMonth, spendMap, variableBudget);
  const variableSpent = metrics.reduce((sum, m) => sum + m.gastoDia, 0);
  const variableRemaining = variableBudget - variableSpent;

  const today = new Date();
  const day = yearMonth === today.toISOString().slice(0, 7) ? today.getDate() : 1;
  const todayInfo: DayMetric | undefined = metrics.find(
    (m) => m.dateKey === dateKey(yearMonth, day),
  );

  const handleSpendChange = (key: string, value: number) => {
    setSpendMap((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    const data = { yearMonth, salary, desiredSavings, fixedList, spendMap };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-tracker.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFile = (file: File) => {
    file.text().then((text) => {
      try {
        const data = JSON.parse(text);
        if (
          typeof data.yearMonth === 'string' &&
          typeof data.salary === 'number' &&
          typeof data.desiredSavings === 'number' &&
          Array.isArray(data.fixedList) &&
          typeof data.spendMap === 'object'
        ) {
          setYearMonth(data.yearMonth);
          setSalary(data.salary);
          setDesiredSavings(data.desiredSavings);
          setFixedList(data.fixedList);
          setSpendMap(data.spendMap);
        } else {
          alert('Archivo inválido');
        }
      } catch {
        alert('Archivo inválido');
      }
    });
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold flex-1">Savings Dashboard</h1>
        <input
          type="month"
          aria-label="Seleccionar mes"
          value={yearMonth}
          onChange={(e) => setYearMonth(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={handleExport}
          className="bg-slate-200 px-3 py-1 rounded"
        >
          Exportar
        </button>
        <label className="bg-slate-200 px-3 py-1 rounded cursor-pointer">
          Importar
          <input
            type="file"
            accept="application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importFile(file);
              e.target.value = '';
            }}
            className="hidden"
          />
        </label>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Config</h2>
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            <label className="flex flex-col min-w-40">
              <span className="text-sm">Moneda</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="border rounded px-2 py-1"
              >
                <option value="ARS">ARS</option>

                <option value="USD" disabled={!rateLoaded && currency !== 'USD'}>
                  USD
                </option>

              </select>
            </label>
            <label className="flex flex-col flex-1 min-w-40">
              <span className="text-sm">Salario mensual ({currency})</span>

              <MoneyInput
                ariaLabel="Salario mensual"
                valueARS={salary}
                onChange={setSalary}
                currency={currency}
                rate={rate}

                className="border rounded px-2 py-1"
                disabled={currency === 'USD' && !rateLoaded}
              />
            </label>
            <label className="flex flex-col flex-1 min-w-40">
              <span className="text-sm">Ahorro deseado ({currency})</span>

              <MoneyInput
                ariaLabel="Ahorro deseado"
                valueARS={desiredSavings}
                onChange={setDesiredSavings}
                currency={currency}
                rate={rate}

                className="border rounded px-2 py-1"
                disabled={currency === 'USD' && !rateLoaded}
              />
            </label>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Gastos fijos</h3>
            <FixedList
              items={fixedList}
              onChange={setFixedList}
              currency={currency}
              rate={rate}

              rateLoaded={rateLoaded}

            />
            <div className="text-sm mt-1">
              Total fijos: {formatMoney(fixedTotal, currency, rate)}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Fijos del mes"
          value={fixedTotal}
          currency={currency}
          rate={rate}
        />
        <KPICard
          label="Variable disponible"
          value={variableBudget}
          currency={currency}
          rate={rate}
        />
        <KPICard
          label="Gastado variable"
          value={variableSpent}
          currency={currency}
          rate={rate}
        />
        <KPICard
          label="Restante variable"
          value={variableRemaining}
          currency={currency}
          rate={rate}
        />
      </section>

      <section>
        <MonthTable
          metrics={metrics}
          onChange={handleSpendChange}
          currency={currency}
          rate={rate}

          rateLoaded={rateLoaded}

        />
      </section>

      <section>
        <TodayPanel info={todayInfo} currency={currency} rate={rate} />
      </section>
    </div>
  );
}

export default App;
