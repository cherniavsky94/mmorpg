FROM gitpod/workspace-node

RUN npm install -g pnpm
RUN corepack enable
