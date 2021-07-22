import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";

import { BaseRepository } from "./BaseRepository.ts";
import { User } from "../entities/User.ts";
import { UserMapper } from "../mappers/UserMapper.ts";

export class UserRepository implements BaseRepository {
  client;
  mapper;

  constructor(client: Client) {
    this.client = client;
    this.mapper = new UserMapper();
  }

  async getObject(uuid: string) {
    const resultRows = await this.client.query(
      "SELECT HEX(uuid) as uuid, username, hash, firstname, lastname, created, updated FROM users WHERE uuid = UNHEX(REPLACE(?, '-', ''))",
      [uuid],
    );

    if (typeof resultRows === "undefined" || resultRows.length === 0) {
      return null;
    }

    return this.mapper.mapObject(resultRows[0]);
  }

  async addObject(object: User) {
    await this.client.execute(
      "INSERT INTO users (uuid, username, hash, firstname, lastname) VALUES (UNHEX(REPLACE(?, '-', '')), ?, ?, ?, ?)",
      [
        object.uuid,
        object.username,
        object.hash,
        object.firstname,
        object.lastname,
      ],
    );

    const savedUser = await this.getObject(object.uuid);
    return savedUser!;
  }

  async getCollection(offset: number, limit: number) {
    const resultRows = await this.client.query(
      "SELECT HEX(uuid) as uuid, username, hash, firstname, lastname, created, updated FROM users LIMIT ? OFFSET ?",
      [limit, offset],
    );
    const totalRowResult = await this.client.query(
      "SELECT COUNT(uuid) AS total from users",
    );

    return this.mapper.mapCollection(
      resultRows,
      offset,
      limit,
      totalRowResult[0].total,
    );
  }

  async removeObject(uuid: string) {
    const deleteResult = await this.client.execute(
      "DELETE FROM users WHERE uuid = UNHEX(REPLACE(?, '-', ''))",
      [
        uuid,
      ],
    );

    return deleteResult.affectedRows === 0 ? false : true;
  }

  async updateObject(uuid: string, object: Partial<User>) {
    const savedUser = await this.getObject(uuid);

    if (!savedUser) {
      return null;
    }

    const originalUuid = savedUser.uuid;
    const originalCreated = savedUser.created;

    const updatedUser = Object.assign(savedUser, object);
    updatedUser.uuid = originalUuid;
    updatedUser.created = originalCreated;

    await this.client.execute(
      "UPDATE users SET username = ?, hash = ?, firstname = ?, lastname = ? WHERE uuid = UNHEX(REPLACE(?, '-', ''))",
      [
        updatedUser.username,
        updatedUser.hash,
        updatedUser.firstname,
        updatedUser.lastname,
        savedUser.uuid,
      ],
    );
    return await this.getObject(savedUser.uuid);
  }
}
