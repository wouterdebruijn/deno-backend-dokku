// deno-lint-ignore-file

import { BaseEntity } from "../entities/BaseEntity.ts";
import { BaseCollection } from "../collections/BaseCollection.ts";

export interface BaseMapper {
  mapObject(row: any): BaseEntity;
  mapArray(row: any[]): BaseEntity[];
  mapCollection(
    row: any[],
    offset: number,
    limit: number,
    total: number,
  ): BaseCollection;
}
