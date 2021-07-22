import { BaseCollection } from "./BaseCollection.ts";
import { User } from "../entities/User.ts";

export class UserCollection extends BaseCollection {
  users: User[] = [];
}
