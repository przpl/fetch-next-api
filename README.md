# fetch-next-api

## Description

A simple wrapper to simplify the use of the `fetch` API. Designed for use in Next.js App Router.

-   TypeScript support
-   Lightweight - no external dependencies
-   SSR support
-   `get()`, `post()`, `put()`, `patch()`, `delete()` methods with native fetch options
-   Access to native-like fetch method

## Requirements

-   Next.js v13 or higher

## Examples

### Client side

```typescript
import { FetchNext } from "fetch-next-api";

const api = new FetchNext({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, credentials: "include" });
const user = await api.get<UserInterface>("/user", { next: { revalidate: false } }); // accepts any options from fetch
```

### Server side

```typescript
import { FetchNext } from "fetch-next-api";
import { cookies } from "next/headers";

const ssrApi = new FetchNext({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, ssr: { getClientCookies: () => cookies().toString() } });
```
