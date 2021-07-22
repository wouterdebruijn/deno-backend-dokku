import { BaseCollection } from "../collections/BaseCollection.ts";
import { BaseEntity } from "../entities/BaseEntity.ts";

export interface BaseRepository {
  getObject(uuid: string): Promise<BaseEntity | null>;
  getCollection(offset: number, limit: number): Promise<BaseCollection>;
  addObject(object: BaseEntity): Promise<BaseEntity>;
  removeObject(uuid: string): Promise<boolean>;
  updateObject(
    uuid: string,
    object: Partial<BaseEntity>,
  ): Promise<BaseEntity | null>;
}
