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

For Prisma on Supabase, be aware that `prisma generate` must be ran either either as part of the Supabase `build` command, or added as a `postbuild` script to `package.json` as follows:

```json
{
  // ...
  "scripts": {
    // ...
    "postinstall": "prisma generate"
  }
}
```
