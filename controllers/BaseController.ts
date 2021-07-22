import { RouterContext } from "https://deno.land/x/oak@v8.0.0/mod.ts";

export interface BaseController {
  getObject(ctx: RouterContext): void;
  getCollection(ctx: RouterContext): void;
  updateObject(ctx: RouterContext): void;
  addObject(ctx: RouterContext): void;
  removeObject(ctx: RouterContext): void;
}
