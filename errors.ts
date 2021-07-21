export enum LogLevel {
  "not classified",
  "information",
  "warning",
  "average",
  "high",
  "disaster",
}

export class BaseError extends Error {
  logLevel;
  httpCode;
  adminData;
  description;

  constructor(
    message: string,
    logLevel: LogLevel,
    httpCode?: number,
    description?: string,
    adminData?: unknown,
  ) {
    super(message);

    this.logLevel = logLevel;
    this.httpCode = httpCode ?? 500;
    this.description = description;
    this.adminData = adminData;
  }

  public masked() {
    if (this.httpCode !== 500) {
      return {
        message: this.message,
        description: this.description,
      };
    } else {
      const internalError = new InternalServerError(this);

      return {
        message: internalError.message,
        description: internalError.description,
      };
    }
  }
}

export class BodyError extends BaseError {
  constructor(type: "missing" | "invalid") {
    if (type === "missing") {
      super("Request is missing a JSON body", LogLevel.information, 400);
      return;
    }

    super(
      "Request body has to be valid JSON",
      LogLevel.information,
      400,
    );
  }
}

export class InternalServerError extends BaseError {
  constructor(error: Error) {
    super(
      "Error while processing request, this incident has been reported.",
      LogLevel.high,
      500,
      undefined,
      { error },
    );
  }
}

export class PropertyError extends BaseError {
  constructor(
    type: "missing" | "length" | "email" | "password",
    property: string,
  ) {
    if (type === "missing") {
      super(
        `Property ${property} is missing from request`,
        LogLevel.information,
        400,
      );
      return;
    }

    super(
      `Property ${property} fails on ${type} validation`,
      LogLevel.information,
      400,
    );
  }
}
