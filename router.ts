import { Application, Router } from "https://deno.land/x/oak@v8.0.0/mod.ts";
import { errorCatcher } from "./middleware.ts";

export class OakInstance {
  private port: number;
  private application: Application;

  constructor(port: number, ...routers: Router[]) {
    this.port = port;

    this.application = new Application().use(errorCatcher);

    for (const router of routers) {
      this.addRouter(router);
    }

    this.application.addEventListener("listen", () => {
      console.log(`Oak is listening on port ${port}`);
    });
  }

  private addRouter(router: Router) {
    this.application.use(router.routes());
    this.application.use(router.allowedMethods());
  }

  public listen() {
    this.application.listen({ port: this.port });
  }
}
