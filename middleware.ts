import { Middleware } from "https://deno.land/x/oak@v8.0.0/mod.ts";
import { BaseError, BodyError, InternalServerError } from "./errors.ts";

export const jsonBodyValidation: Middleware = async ({ request }, next) => {
  if (!request.hasBody) throw new BodyError("missing");
  const body = request.body({ type: "json" });
  await body.value.catch(() => {
    throw new BodyError("invalid");
  });

  await next();
};

export const errorCatcher: Middleware = async ({ response }, next) => {
  await next().catch((error: Error | BaseError) => {
    let extenedError: BaseError;

    if (!(error instanceof BaseError)) {
      extenedError = new InternalServerError(error);
    } else {
      extenedError = error;
    }

    response.body = extenedError.masked();
    response.status = extenedError.httpCode;

    console.error("Error on oak request:", {
      name: extenedError.name,
      message: extenedError.message,
      stack: extenedError.stack,
      logLevel: extenedError.logLevel,
      httpCode: extenedError.httpCode,
      adminData: extenedError.adminData,
      description: extenedError.description,
    });
  });
};
