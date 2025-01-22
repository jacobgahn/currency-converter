## Getting Started

Install dependencies

```bash
npm i
```

## Database set up

```bash
docker compose up -d
```

3. Push migration to the database

```bash
npx drizzle-kit push
```

4. Run the development server:

```bash
npm run dev
```

5. Request a conversion

```bash
curl -X GET "http://localhost:3000/convert?from=USD&to=BTC&amount=100" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.HqfBqMQXjCge8RyIepyGkT2arZPD62bIGwD36lKiUWk"
```

6. Run tests

```bash
npm run test
```
