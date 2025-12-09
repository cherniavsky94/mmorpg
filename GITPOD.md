# Gitpod Deployment Guide

## ✅ Проблема решена

Сервер теперь правильно слушает на `0.0.0.0:2567` (IPv4) и доступен через публичные URL Gitpod.

## Что было исправлено

### 1. Привязка к правильному интерфейсу
**Было:** Сервер слушал на `:::2567` (IPv6 only)
**Стало:** Сервер слушает на `0.0.0.0:2567` (IPv4, доступен извне)

### 2. Правильная инициализация HTTP сервера
```typescript
// Создаем HTTP сервер
const httpServer = http.createServer(app);

// Передаем его в Colyseus
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer,
  }),
});

// Запускаем на 0.0.0.0
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Colyseus server listening on 0.0.0.0:${PORT}`);
});
```

### 3. Порядок инициализации
1. Определяем комнаты: `gameServer.define("city", CityRoom)`
2. Запускаем HTTP сервер: `httpServer.listen(PORT, "0.0.0.0")`
3. Colyseus автоматически регистрирует matchmaking routes

## Проверка работы

### Локально
```bash
# Сервер
curl http://localhost:2567/
curl -X POST http://localhost:2567/matchmake/joinOrCreate/city -H "Content-Type: application/json" -d '{}'

# Клиент
open http://localhost:5173/
```

### Gitpod Public URLs

**Сервер:** https://2567--019b03d2-4e60-7251-a151-670a306cc63e.eu-central-1-01.gitpod.dev/

Проверка:
```bash
curl https://2567--019b03d2-4e60-7251-a151-670a306cc63e.eu-central-1-01.gitpod.dev/
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "message": "Colyseus server running",
  "rooms": ["city", "battle"]
}
```

**Клиент:** https://5173--019b03d2-4e60-7251-a151-670a306cc63e.eu-central-1-01.gitpod.dev/

## Настройка переменных окружения

### Для Gitpod (client/.env)
```env
VITE_WS_URL=wss://2567--019b03d2-4e60-7251-a151-670a306cc63e.eu-central-1-01.gitpod.dev
```

### Для локальной разработки (client/.env.local)
```env
VITE_WS_URL=ws://localhost:2567
```

**Важно:** Vite использует `.env.local` в приоритете над `.env`, поэтому для локальной разработки создайте `.env.local`.

## Запуск в Gitpod

### Автоматический запуск (через .gitpod.yml)
При открытии workspace Gitpod автоматически:
1. Установит зависимости: `pnpm install`
2. Запустит dev сервер: `pnpm dev` (concurrently запускает server + client)

### Ручной запуск

**Терминал 1 - Сервер:**
```bash
pnpm dev:server
```

**Терминал 2 - Клиент:**
```bash
pnpm dev:client
```

## Проверка портов

```bash
# Проверить, что сервер слушает на 0.0.0.0
netstat -tlnp | grep 2567
# Должно быть: tcp  0.0.0.0:2567  (не tcp6 :::2567)

# Проверить, что клиент запущен
netstat -tlnp | grep 5173
```

## Troubleshooting

### Сервер недоступен через публичный URL

1. **Проверьте, что сервер слушает на 0.0.0.0:**
   ```bash
   netstat -tlnp | grep 2567
   ```
   Должно быть: `tcp  0.0.0.0:2567`, а не `tcp6 :::2567`

2. **Проверьте порты в Gitpod:**
   - Откройте панель "Ports" в Gitpod
   - Убедитесь, что порты 2567 и 5173 помечены как "public"
   - Если нет, кликните на порт и выберите "Make Public"

3. **Перезапустите сервер:**
   ```bash
   pkill -f "tsx watch"
   pnpm dev:server
   ```

### Клиент не подключается к серверу

1. **Проверьте URL в client/.env:**
   ```env
   VITE_WS_URL=wss://2567--<ваш-workspace-id>.gitpod.dev
   ```

2. **Проверьте консоль браузера (F12):**
   - Должны быть логи подключения
   - Если ошибка CORS - проверьте, что в server/src/index.ts есть `app.use(cors())`

3. **Проверьте, что сервер работает:**
   ```bash
   curl http://localhost:2567/
   ```

### CORS ошибки

Убедитесь, что в `server/src/index.ts` есть:
```typescript
import cors from "cors";
app.use(cors());
```

### Matchmaking endpoint возвращает 404

Это значит, что комнаты не зарегистрированы. Проверьте порядок в `server/src/index.ts`:
```typescript
// 1. Определяем комнаты
gameServer.define("city", CityRoom);
gameServer.define("battle", BattleRoom);

// 2. Запускаем сервер
httpServer.listen(PORT, "0.0.0.0");
```

## Полезные команды

```bash
# Убить все Node процессы
killall -9 node

# Проверить запущенные процессы
ps aux | grep -E "(tsx|vite)"

# Проверить открытые порты
netstat -tlnp | grep -E "(2567|5173)"

# Логи сервера
tail -f /tmp/server.log

# Логи клиента
tail -f /tmp/client.log
```

## Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                         Gitpod                              │
│                                                             │
│  ┌──────────────────┐              ┌──────────────────┐   │
│  │   Client (Vite)  │              │  Server (Node)   │   │
│  │   Port: 5173     │◄────WSS─────►│  Port: 2567      │   │
│  │   0.0.0.0:5173   │              │  0.0.0.0:2567    │   │
│  └──────────────────┘              └──────────────────┘   │
│         │                                    │             │
│         │                                    │             │
│         ▼                                    ▼             │
│  Public URL:                         Public URL:          │
│  https://5173--<id>.gitpod.dev      https://2567--<id>... │
└─────────────────────────────────────────────────────────────┘
                    │                          │
                    │                          │
                    ▼                          ▼
              ┌──────────────────────────────────┐
              │         Browser (User)           │
              │  WebSocket: wss://2567--...      │
              │  HTTP: https://5173--...         │
              └──────────────────────────────────┘
```

## Следующие шаги

1. ✅ Сервер работает на 0.0.0.0:2567
2. ✅ Клиент работает на 0.0.0.0:5173
3. ✅ Matchmaking routes зарегистрированы
4. ✅ CORS настроен
5. ✅ Порты публичные в Gitpod

Теперь можно:
- Открыть клиент в браузере
- Подключиться к комнате "city"
- Начать разработку игровой логики

## Документация

- [START.md](./START.md) - Инструкции по локальному запуску
- [FIXES.md](./FIXES.md) - Описание исправленных проблем
- [README.md](./README.md) - Общая информация о проекте
