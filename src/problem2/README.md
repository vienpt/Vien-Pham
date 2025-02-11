# Setup Vite

## Initialize

```bash
npm init -y
```

## Install Vite as a development dependency

```bash
npm install vite --save-dev
```

## Create a `vite.config.js`

```js
import { defineConfig } from 'vite'

export default defineConfig({})
```

## Update your `package.json` scripts section:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Run dev

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview production

```bash
npm run preview
```
