import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { urlParse } from "https://deno.land/x/url_parse@1.0.0/mod.ts";

const parsedUrl = urlParse(
  Deno.env.get("DATABASE_URL") ?? Deno.env.get("DEV_DATABASE_URL"),
);
const clientConfig = {
  hostname: parsedUrl.hostname,
  username: parsedUrl.username,
  db: parsedUrl.pathname.substr(1),
  password: parsedUrl.password,
};

export class MySQLConnector {
  /**
     * Creates a new MySQL connection.
     *
     * @return {Prmise<Client>} Returns a MySQL client that is connected.
     * @throws {*} Throws an error on connection failure.
     */
  static connect() {
    return new Client().connect(clientConfig);
  }
}
