export class BaseEntity {
  uuid;
  created;
  updated;

  constructor() {
    this.uuid = globalThis.crypto.randomUUID();
    this.created = new Date();
    this.updated = new Date();
  }
}
