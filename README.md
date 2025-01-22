## Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run start
```

## Database set up

```bash
docker compose up -d
```

2. Create a `currency-conversion` database.

3. Push migration to the database

```bash
npx drizzle-kit push
```
