# Future CRM Backend

TODO:

## Setup

```shell
pnpm add dotenv express
```

### Supabase

Ensure you have the following Supabase credentials in the `.env` file:

```.env
DATABASE_URL=
DIRECT_URL=
```

Then run the following commands to

```shell
pnpm migrate
pnpm dlx prisma db push
```
