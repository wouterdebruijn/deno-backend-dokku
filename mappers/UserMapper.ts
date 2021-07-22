import { User } from "../entities/User.ts";
import { UserCollection } from "../collections/UserCollection.ts";
import { cleanHex } from "../utilities.ts";
import { BaseMapper } from "./BaseMapper.ts";

export class UserMapper implements BaseMapper {
  mapObject(row: Record<string, never>): User {
    const user = new User(
      row.username,
      row.hash,
      row.firstname,
      row.lastname,
    );

    user.uuid = cleanHex(row.uuid);
    user.created = new Date(row.created);
    user.updated = new Date(row.updated);

    return user;
  }

  mapArray(rows: Record<string, never>[]): User[] {
    const users = rows.map((row) => this.mapObject(row));
    return users;
  }

  mapCollection(
    rows: Record<string, never>[],
    offset: number,
    limit: number,
    total: number,
  ): UserCollection {
    const users = rows.map((row) => this.mapObject(row));
    return {
      total,
      limit,
      offset,
      users,
    };
  }
}
