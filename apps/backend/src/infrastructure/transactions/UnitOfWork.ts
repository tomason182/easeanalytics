import { Pool, PoolConnection } from "mysql2/promise";

export class UnitOfWork {
  public readonly pool: Pool;
  public connection: PoolConnection | null;

  constructor(pool: Pool) {
    this.pool = pool;
    this.connection = null;
  }

  // 1. Responsabilidad: Asegurar tener conexion
  async getConnection(): Promise<PoolConnection> {
    if (!this.connection) {
      this.connection = await this.pool.getConnection();
    }

    return this.connection;
  }

  // 2. Responsabilidad: Iniciar transacción sobre conexion existente
  async begin(): Promise<void> {
    if (!this.connection) {
      throw new Error(
        "Can not begin a transaction without connection. Call beginConnection() first"
      );
    }

    await this.connection.beginTransaction();
  }

  // 3. Responsabilidad: Realizar commit a la transacción
  async commit() {
    await this.connection?.commit();
  }

  // 4. Responsabilidad: Hacer rollback a la transacción.
  async rollback() {
    await this.connection?.rollback();
  }

  // 5. Responsabilidad: Liberar la conexión.
  release() {
    if (this.connection) {
      this.connection.release();
      this.connection = null;
    }
  }
}
