// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter as uploadRouter } from "./upload";
import { authRouter } from "./auth";
import { filesRouter } from "./files";
import { poolRouter } from "./pools";
import { binRouter } from "./bin";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("upload.", uploadRouter)
  .merge("auth.", authRouter)
  .merge("files.", filesRouter)
  .merge("pools.", poolRouter)
  .merge("bin.", binRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
