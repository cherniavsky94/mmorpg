# MMORPG Game Project

A complete multiplayer game built with modern web technologies.

## Tech Stack

- **Frontend**: Phaser 3, Vite, TypeScript, Zustand
- **Backend**: Colyseus, Node.js, TypeScript, Zustand
- **Database**: Prisma ORM, Supabase PostgreSQL
- **Monorepo**: pnpm workspaces
- **Development**: Gitpod

## Project Structure

```
game/
├── client/          # Phaser 3 game client
│   ├── src/
│   │   ├── scenes/  # Game scenes
│   │   ├── state/   # Zustand state management
│   │   └── main.ts  # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   └── .env
├── server/          # Colyseus game server
│   ├── src/
│   │   ├── rooms/   # Game rooms
│   │   ├── store/   # Zustand stores
│   │   └── index.ts # Server entry
│   ├── tsconfig.json
│   └── .env
├── prisma/          # Database schema and migrations
│   ├── schema.prisma
│   └── .env
├── pnpm-workspace.yaml
├── .gitpod.yml
└── .gitpod.Dockerfile
```

## Getting Started

### Local Development

1. Install pnpm:
```bash
npm install -g pnpm
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
   - Update `client/.env` with your WebSocket URL
   - Update `server/.env` with your database URL
   - Update `prisma/.env` with your database URL

4. Run Prisma migrations:
```bash
pnpm -C prisma migrate
```

5. Start the server:
```bash
pnpm -C server dev
```

6. Start the client (in a new terminal):
```bash
pnpm -C client dev
```

### Gitpod Development

Click the button below to open this project in Gitpod:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/cherniavsky94/mmorpg)

The Gitpod environment will automatically:
- Install pnpm
- Install all dependencies
- Start the Colyseus server on port 2567 (public)
- Start the Vite client on port 5173 (public)
- Run Prisma migrations

## Environment Variables

### Client (.env)
```
VITE_WS_URL=ws://localhost:2567
```

For Gitpod, update to:
```
VITE_WS_URL=wss://2567-<workspace-id>.gitpod.io
```

### Server (.env)
```
PORT=2567
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

### Prisma (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

For Supabase, use your connection string:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

## Available Scripts

### Root
- `pnpm dev:client` - Start client dev server
- `pnpm dev:server` - Start server dev server
- `pnpm build:client` - Build client for production
- `pnpm build:server` - Build server for production
- `pnpm prisma:migrate` - Run Prisma migrations
- `pnpm prisma:generate` - Generate Prisma client

### Client
- `pnpm -C client dev` - Start Vite dev server
- `pnpm -C client build` - Build for production
- `pnpm -C client preview` - Preview production build

### Server
- `pnpm -C server dev` - Start server with hot reload
- `pnpm -C server build` - Build TypeScript
- `pnpm -C server start` - Start production server

### Prisma
- `pnpm -C prisma migrate` - Run migrations
- `pnpm -C prisma generate` - Generate Prisma client

## Features

- Real-time multiplayer using Colyseus
- State management with Zustand (client + server)
- Type-safe database access with Prisma
- Hot module replacement for fast development
- Public ports for easy testing and sharing
- Monorepo structure for organized code

## Architecture

### Client
- **Phaser 3**: Game rendering and scene management
- **Zustand**: Client-side state management
- **Colyseus.js**: WebSocket connection to game server
- **Vite**: Fast development and optimized builds

### Server
- **Colyseus**: Room-based multiplayer server
- **Zustand**: Server-side state management
- **Express**: HTTP server
- **Prisma**: Database ORM

### Database
- **Prisma**: Type-safe database client
- **Supabase**: PostgreSQL hosting
- **Migrations**: Version-controlled schema changes

## Next Steps

1. Update database URLs in `.env` files to use Supabase
2. Customize the Prisma schema for your game data
3. Add game logic to `BaseRoom` in the server
4. Create additional Phaser scenes for different game states
5. Implement player movement and interactions
6. Add authentication using Prisma User model

## License

MIT
