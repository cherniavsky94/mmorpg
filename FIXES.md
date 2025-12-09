# CORS and 504 Timeout Fixes

## Problem
The client was getting CORS errors and 504 timeouts when calling `client.joinOrCreate("city")`. The matchmaking HTTP endpoint at `https://2567--<workspace-id>.gitpod.dev/matchmake/joinOrCreate/city` was not responding.

## Root Causes

### 1. **Incorrect Server Initialization Order** ❌
**Before:**
```typescript
gameServer.listen(PORT);  // ❌ Called BEFORE rooms are defined

gameServer.define("city", CityRoom);
gameServer.define("battle", BattleRoom);
```

**Problem:** When `gameServer.listen()` is called before defining rooms, Colyseus doesn't register the matchmaking HTTP routes (`/matchmake/*`). This caused 504 timeouts because the endpoints didn't exist.

**After:**
```typescript
// Define rooms FIRST
gameServer.define("city", CityRoom);
gameServer.define("battle", BattleRoom);

// THEN start the server
gameServer.listen(PORT);  // ✅ Now matchmaking routes are registered
```

### 2. **Missing CORS Configuration** ❌
**Problem:** Cross-origin requests from Gitpod client URL to server URL were blocked by browser CORS policy.

**Fix:** Added CORS middleware:
```typescript
import cors from "cors";

app.use(cors());  // Enable CORS for all origins
app.use(express.json());
```

### 3. **Inconsistent HTTP Server Variable Names** ⚠️
**Before:**
```typescript
const server = http.createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server }),
});
```

**After:**
```typescript
const httpServer = http.createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});
```

**Reason:** Using `httpServer` is clearer and avoids confusion with `gameServer`.

### 4. **Missing ES Module Extensions** ⚠️
**Before:**
```typescript
import { CityRoom } from "./rooms/CityRoom";
```

**After:**
```typescript
import { CityRoom } from "./rooms/CityRoom.js";
```

**Reason:** With `"type": "module"` in package.json, Node.js requires explicit `.js` extensions for ES module imports.

## Changes Made

### server/src/index.ts
1. ✅ Added `cors` import and middleware
2. ✅ Renamed `server` to `httpServer` for clarity
3. ✅ Moved `gameServer.define()` calls BEFORE `gameServer.listen()`
4. ✅ Added `.js` extensions to imports
5. ✅ Improved logging with emojis and helpful URLs
6. ✅ Changed root endpoint to return JSON with server status

### server/package.json
1. ✅ Added `cors` dependency
2. ✅ Added `@types/cors` dev dependency

## Testing

### 1. Test HTTP Matchmaking Endpoint
```bash
curl -X POST http://localhost:2567/matchmake/joinOrCreate/city \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "room": {
    "clients": 1,
    "locked": false,
    "private": false,
    "maxClients": null,
    "unlisted": false,
    "createdAt": "2025-12-09T17:59:48.633Z",
    "name": "city",
    "processId": "R9sm4uIA-",
    "roomId": "thRfYCyzc"
  },
  "sessionId": "6N2SPKgo0"
}
```

### 2. Test Health Check
```bash
curl http://localhost:2567/
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Colyseus server running",
  "rooms": ["city", "battle"]
}
```

### 3. Test WebSocket Connection
Open `test-connection.html` in a browser or use the Phaser client:

```typescript
const client = new Colyseus.Client("ws://localhost:2567");
const room = await client.joinOrCreate("city");
console.log("Connected:", room.sessionId);
```

## Gitpod Deployment

When running in Gitpod:

1. **Server URL:** `https://2567--<workspace-id>.gitpod.dev`
2. **Client URL:** `https://5173--<workspace-id>.gitpod.dev`
3. **WebSocket URL:** `wss://2567--<workspace-id>.gitpod.dev`

Update `client/.env`:
```env
VITE_WS_URL=wss://2567--<workspace-id>.gitpod.dev
```

## Verification Checklist

- ✅ Server starts without errors
- ✅ `http://localhost:2567/` returns JSON status
- ✅ `POST /matchmake/joinOrCreate/city` returns room info
- ✅ WebSocket connection succeeds
- ✅ CORS headers are present in responses
- ✅ Gitpod ports 2567 and 5173 are public
- ✅ Client can connect from different origin

## Key Takeaways

1. **Always define rooms BEFORE calling `gameServer.listen()`**
2. **Enable CORS for cross-origin requests**
3. **Use explicit `.js` extensions with ES modules**
4. **Test matchmaking HTTP endpoints separately from WebSocket**
5. **Ensure Gitpod ports are marked as public**

## Additional Resources

- [Colyseus Server API](https://docs.colyseus.io/server/api/)
- [Colyseus Matchmaking](https://docs.colyseus.io/server/matchmaker/)
- [CORS in Express](https://expressjs.com/en/resources/middleware/cors.html)
