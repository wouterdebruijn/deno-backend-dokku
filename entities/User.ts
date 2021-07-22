import { BaseEntity } from "./BaseEntity.ts";

export class User extends BaseEntity {
  username;
  hash;
  firstname;
  lastname;

  constructor(
    username: string,
    hash: string,
    firstname: string,
    lastname: string,
  ) {
    super();
    this.username = username;
    this.hash = hash;
    this.firstname = firstname;
    this.lastname = lastname;
  }
}
