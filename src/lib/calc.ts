import { daysInMonth, dateKey, weekdayLabel } from './date';

export const presupuestoRestante = (variable: number, gastado: number): number => {
  return variable - gastado;
};

export const cupoDeHoy = (
  variable: number,
  gastadoAcumulado: number,
  diasRestantes: number,
): number => {
  return diasRestantes <= 0 ? 0 : (variable - gastadoAcumulado) / diasRestantes;
};

export const desvio = (cupo: number, gastoDia: number): number => {
  return cupo - gastoDia;
};

export interface DayMetric {
  day: number;
  dateKey: string;
  weekday: string;
  gastoDia: number;
  gastoAcumulado: number;
  diasRestantes: number;
  presupuestoRestante: number;
  cupoDeHoy: number;
  estado: '' | 'BUENO' | 'EXCESO';
  desvio: number;
}

export const computeMonthMetrics = (
  yearMonth: string,
  spendMap: Record<string, number>,
  variableBudget: number,
): DayMetric[] => {
  const days = daysInMonth(yearMonth);
  const metrics: DayMetric[] = [];
  let acumulado = 0;
  for (let day = 1; day <= days; day++) {
    const key = dateKey(yearMonth, day);
    const gastoDia = spendMap[key] || 0;
    acumulado += gastoDia;
    const diasRestantes = days - day + 1;
    const presRest = presupuestoRestante(variableBudget, acumulado);
    const cupo = cupoDeHoy(variableBudget, acumulado, diasRestantes);
    const estado = gastoDia === 0 ? '' : gastoDia <= cupo ? 'BUENO' : 'EXCESO';
    const dv = desvio(cupo, gastoDia);
    metrics.push({
      day,
      dateKey: key,
      weekday: weekdayLabel(key),
      gastoDia,
      gastoAcumulado: acumulado,
      diasRestantes,
      presupuestoRestante: presRest,
      cupoDeHoy: cupo,
      estado,
      desvio: dv,
    });
  }
  return metrics;
};
