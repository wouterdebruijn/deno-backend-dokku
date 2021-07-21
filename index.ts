import "https://deno.land/x/dotenv@v2.0.0/load.ts";
import { OakInstance } from "./router.ts";

import UserRouter from "./routers/user.ts";

const oakInstance = new OakInstance(
  parseInt(Deno.env.get("PORT") ?? "5000"),
  UserRouter,
);
oakInstance.listen();
