# 🐌 SnailBet

Sistema web de apuestas en carreras de caracoles con autenticación simulada y pasarela de pago SnailPay.

## Stack

| Layer     | Tecnología                |
|-----------|--------------------------|
| Frontend  | React + TypeScript + Vite |
| Backend   | Express + TypeScript      |
| Charts    | Recharts                  |
| Testing   | Jest + Supertest / Vitest |

## Estructura

```
snailbet/
├── backend/       Express API (SnailPay gateway)
├── frontend/      React + Vite SPA
└── package.json   Scripts raíz
```

## Instalación

```bash
# Instalar todas las dependencias
npm run install:all

# O manualmente:
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Ejecución

```bash
# Levantar backend (port 3001) + frontend (port 5173) en paralelo
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## Testing

```bash
# Todos los tests (backend + frontend)
npm run test

# Solo backend
cd backend && npm test

# Solo frontend
cd frontend && npm test
```

## Credenciales de Prueba SnailPay

| Campo          | Valor              |
|----------------|--------------------|
| Número         | 1234123412341234   |
| Vencimiento    | 12/26              |
| CVV            | 543                |
| Monto          | Cualquier > $0     |

Para simular **error del sistema**: activar el checkbox "Simular error del sistema (dev)" en el modal de recarga.

## Seguridad

- Las contraseñas se almacenan como SHA-256 hash con salt aleatorio (nunca en texto plano).
- El número de tarjeta y CVV **nunca** se incluyen en las respuestas del API ni en localStorage.
- Namespacing `snailbet:*` en localStorage para evitar colisiones.
