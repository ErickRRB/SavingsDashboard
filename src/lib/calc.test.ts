import { describe, it, expect } from 'vitest';
import { cupoDeHoy, desvio, presupuestoRestante } from './calc';

describe('calc helpers', () => {
  it('presupuestoRestante', () => {
    expect(presupuestoRestante(1000, 200)).toBe(800);
  });
  it('cupoDeHoy', () => {
    expect(cupoDeHoy(1000, 200, 4)).toBe(200);
    expect(cupoDeHoy(1000, 1000, 0)).toBe(0);
  });
  it('desvio', () => {
    expect(desvio(100, 50)).toBe(50);
    expect(desvio(100, 150)).toBe(-50);
  });
});
