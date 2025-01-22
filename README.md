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

5. Request a conversion (get token from jwt.io with user_id claim)

```bash
curl -X GET "http://localhost:3000/convert?from=USD&to=BTC&amount=100" -H "Authorization: Bearer <token>"
```

6. Run tests

```bash
npm run test
```
