import { Pool } from "mysql2/promise.js";

export default class Container {
  public readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Aqui van todas las funciones que devuelven un controlador
}
