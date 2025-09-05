# Savings Dashboard

Aplicación web de seguimiento de gastos y ahorros sin backend.

## Instalación

```bash
npm install
npm run dev
```

## Build y deploy en Vercel

```bash
npm run build
```
Sube la carpeta `dist` a [Vercel](https://vercel.com/) como proyecto estático.

## Uso rápido
1. Configura salario mensual, ahorro deseado y lista de gastos fijos.
2. Revisa las tarjetas KPI para ver fijos, variable disponible, gastado y restante.
3. Ingresa el gasto diario en la tabla; los cálculos se actualizan al instante.
4. Cambia de mes con el selector para llevar un registro histórico.
5. Exporta un respaldo JSON o importa uno existente desde el encabezado.

## Notas
- No hay backend: toda la información se almacena en `localStorage`.
- Para reiniciar la app borra las claves `bt.*` del `localStorage` del navegador.
- Se incluyen pruebas básicas con `npm test`.
