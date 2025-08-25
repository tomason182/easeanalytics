import mysql, { PoolOptions, Pool } from "mysql2/promise.js";
import { logger } from "../utils/logger";
import "dotenv/config";

export class MySQLConnect {
  private config: PoolOptions;
  private pool: Pool | null = null;
  private isConnected: boolean = false;
  private retryDelay = 5000;
  private maxRetries = 3;

  constructor() {
    const host = process.env.MYSQL_HOST;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE;

    if (!host || !user || !password || !database) {
      throw new Error("Missing MySQL enviroment variables");
    }

    this.config = {
      host,
      user,
      password,
      database,
      timezone: "Z",
      waitForConnections: true,
      connectionLimit: parseInt(process.env.MYSQL_POOL_SIZE || "10", 10),
      queueLimit: parseInt(process.env.MYSQL_QUEUE_LIMIT || "0", 10),
      connectTimeout: parseInt(
        process.env.MYSQL_CONNECT_TIMEOUT_MS || "10000",
        10
      ),
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };
  }

  public async createConnectionPool(retries = this.maxRetries): Promise<void> {
    if (this.isConnected && this.pool) return;

    try {
      this.pool = mysql.createPool(this.config);

      // Verificamos la conexión
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();

      this.isConnected = true;
      logger.info("MySQL pool Connected");

      // @ts-expect-error mysql2 Pool type does define 'error' event
      this.pool.on("error", async (err: any) => {
        logger.error("Unexpected error on idle Mysql client", err);
        if (["PROTOCOL_CONNECTION_LOST", "ECONNREFUSED"].includes(err.code)) {
          logger.info("Attempting to reconnect MySQL pool...");
          this.isConnected = false;
          this.pool = null;
          await this.createConnectionPool();
        }
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`MySQL connection error: ${err.message}`);
      } else {
        logger.error("MySQL connection error: ", err);
      }

      if (retries > 0) {
        logger.info(
          `Retrying connection in ${this.retryDelay}ms. Attempts remaning: ${retries}`
        );
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
        return this.createConnectionPool(retries - 1);
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.pool) {
      logger.info("MySQL is already disconnected");
      return;
    }

    try {
      await this.pool.end();
      this.isConnected = false;
      this.pool = null;
      logger.info("MySQL pool disconnected successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`Error disconnection MySQL pool: ${err.message}`);
      } else {
        logger.error("Error disconnection MySQL pool: ", err);
      }

      throw err;
    }
  }

  public getPool(): Pool {
    if (!this.isConnected || !this.pool) {
      throw new Error("MySQL pool is not connected");
    }

    return this.pool;
  }
}
