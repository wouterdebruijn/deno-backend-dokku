import { BaseController } from "./BaseController.ts";
import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { RouterContext } from "https://deno.land/x/oak@v8.0.0/mod.ts";
import { ExistenceError, PropertyError, TypeError } from "../errors.ts";
import { isPassword, isShortString, isUuid } from "../utilities.ts";
import { User } from "../entities/User.ts";

import { hash } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export class UserController implements BaseController {
  client;
  private repository;

  constructor(client: Client) {
    this.client = client;
    this.repository = new UserRepository(client);
  }

  async addObject({ request, response }: RouterContext) {
    const body = await request.body({ type: "json" }).value;

    // Question existence of properties.
    if (typeof body.username === "undefined") {
      throw new PropertyError("missing", "username");
    }

    if (typeof body.password === "undefined") {
      throw new PropertyError("missing", "password");
    }

    if (typeof body.firstname === "undefined") {
      throw new PropertyError("missing", "firstname");
    }

    if (typeof body.lastname === "undefined") {
      throw new PropertyError("missing", "lastname");
    }

    // Question types of properties.
    if (typeof body.username !== "string") {
      throw new TypeError("string", "username");
    }

    if (typeof body.password !== "string") {
      throw new TypeError("string", "password");
    }

    if (typeof body.firstname !== "string") {
      throw new TypeError("string", "firstname");
    }

    if (typeof body.lastname !== "string") {
      throw new TypeError("string", "lastname");
    }

    // Validate properties.
    if (!isShortString(body.username)) {
      throw new PropertyError(
        "length",
        "username",
        "Property must be between 1 and 32 characters long.",
      );
    }

    if (!isPassword(body.password)) {
      throw new PropertyError("password", "password");
    }

    if (!isShortString(body.firstname)) {
      throw new PropertyError(
        "length",
        "firstname",
        "Property must be between 1 and 32 characters long.",
      );
    }

    if (!isShortString(body.lastname)) {
      throw new PropertyError(
        "length",
        "lastname",
        "Property must be between 1 and 32 characters long.",
      );
    }

    const user = await this.repository.addObject(
      new User(
        body.username,
        await hash(body.password),
        body.firstname,
        body.lastname,
      ),
    );

    response.body = {
      uuid: user.uuid,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      created: user.created,
      updated: user.updated,
    };
  }

  async getObject({ params, response }: RouterContext) {
    if (typeof params.uuid === "undefined") {
      throw new PropertyError("missing", "uuid");
    }

    if (!isUuid(params.uuid)) {
      throw new PropertyError("uuid", "uuid");
    }

    response.body = await this.repository.getObject(params.uuid);
  }

  async removeObject({ params, response }: RouterContext) {
    if (typeof params.uuid === "undefined") {
      throw new PropertyError("missing", "uuid");
    }

    if (!isUuid(params.uuid)) {
      throw new PropertyError("uuid", "uuid");
    }

    response.body = await this.repository.removeObject(params.uuid);
  }

  async getCollection({ request, response }: RouterContext) {
    const limitParam = request.url.searchParams.get("limit");
    const offsetParam = request.url.searchParams.get("offset");

    const limit = limitParam ? parseInt(limitParam) : 5;
    const offset = offsetParam ? parseInt(offsetParam) : 0;

    if (isNaN(limit)) {
      throw new TypeError("number", "limit");
    }

    if (isNaN(offset)) {
      throw new TypeError("number", "offset");
    }

    response.body = await this.repository.getCollection(offset, limit);
  }

  async updateObject({ request, response, params }: RouterContext) {
    const body = await request.body({ type: "json" }).value;

    // Question types of properties.
    if (typeof body.username !== "undefined") {
      if (!isShortString(body.username)) {
        throw new PropertyError(
          "length",
          "username",
          "Property must be between 1 and 32 characters long.",
        );
      }
    }

    if (typeof body.password !== "undefined") {
      if (!isPassword(body.password)) {
        throw new PropertyError("password", "password");
      }
    }

    if (typeof body.firstname !== "undefined") {
      if (!isShortString(body.firstname)) {
        throw new PropertyError(
          "length",
          "firstname",
          "Property must be between 1 and 32 characters long.",
        );
      }
    }

    if (typeof body.lastname !== "undefined") {
      if (!isShortString(body.lastname)) {
        throw new PropertyError(
          "length",
          "lastname",
          "Property must be between 1 and 32 characters long.",
        );
      }
    }

    if (typeof params.uuid === "undefined") {
      throw new PropertyError("missing", "uuid");
    }

    if (!isUuid(params.uuid)) {
      throw new PropertyError("uuid", "uuid");
    }

    const updatedUser = await this.repository.updateObject(params.uuid, body);
    if (updatedUser === null) {
      throw new ExistenceError("user");
    }

    response.body = updatedUser;
  }
}
