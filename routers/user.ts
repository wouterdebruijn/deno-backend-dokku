import { Router } from "https://deno.land/x/oak@v8.0.0/mod.ts";

import { PropertyError } from "../errors.ts";

import { jsonBodyValidation } from "../middleware.ts";

const router = new Router().prefix("/user");

router.get("/", ({ response }) => {
  response.body = "Hello World";
});

router.post("/a", jsonBodyValidation, () => {
  throw new PropertyError("missing", "key");
});

export default router;
