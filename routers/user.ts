import { Router } from "https://deno.land/x/oak@v8.0.0/mod.ts";
import { jsonBodyValidation } from "../middleware.ts";

import { UserController } from "../controllers/UserController.ts";
import { MySQLConnector } from "../MySqlConnection.ts";

const router = new Router().prefix("/user");

router.get("/", async (ctx) => {
  const controller = new UserController(await MySQLConnector.connect());
  await controller.getCollection(ctx);
  await controller.client.close();
});

router.get("/:uuid", async (ctx) => {
  const controller = new UserController(await MySQLConnector.connect());
  await controller.getObject(ctx);
  await controller.client.close();
});

router.post("/", jsonBodyValidation, async (ctx) => {
  const controller = new UserController(await MySQLConnector.connect());
  await controller.addObject(ctx);
  await controller.client.close();
});

router.put("/:uuid", jsonBodyValidation, async (ctx) => {
  const controller = new UserController(await MySQLConnector.connect());
  await controller.updateObject(ctx);
  await controller.client.close();
});

router.delete("/:uuid", async (ctx) => {
  const controller = new UserController(await MySQLConnector.connect());
  await controller.removeObject(ctx);
  await controller.client.close();
});

export default router;
