# Tiny German Quest

Bite-sized German grammar lessons (Nominative and Akkusativ).

## Folder structure

```
learndeutsch/
├── frontend/                    # Pages the learner sees
│   ├── index.html               # Home page that links to each quest
│   ├── nominative-adventure.html
│   └── akkusativ-study.html
├── backend/                     # Node server (no dependencies)
│   ├── server.js                # Serves frontend/ and the /api routes
│   └── package.json
└── package.json                 # Root scripts; Railway runs `npm start`
```

## Run locally

```bash
npm start
```

Then open http://localhost:3000. Use `npm run dev` to restart automatically when `backend/` files change.

## API

| Route              | Returns                          |
| ------------------ | -------------------------------- |
| `GET /api/health`  | `{ "status": "ok" }`             |
| `GET /api/lessons` | The list of quests, in order     |

## Deploy

The site is deployed on Railway (project `tiny-german-quest`). From the project folder:

```bash
railway up
```

Railway sees the root `package.json`, installs Node and runs `npm start`. The server listens on the `PORT` Railway provides.
