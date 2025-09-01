import nodemailer from "nodemailer";
import { Pool } from "mysql2/promise.js";
import { config } from "./config/nodemailerConfig";
import { EmailServiceSMTP } from "./infrastructure/email/EmailServiceSMTP";
import { makeTransactional } from "./infrastructure/transactions/transactionalDecorator";
import { UnitOfWork } from "./infrastructure/transactions/UnitOfWork";
//User
import { UserService } from "./application/userService";
import { UserController } from "./infrastructure/web/controllers/UserController";
import { UserRepositoryMySQL } from "./infrastructure/repositories/UserRepositoryMySQL";

// Website
import { WebsiteService } from "./application/websiteService";
import { WebsiteController } from "./infrastructure/web/controllers/websiteController";
import { WebsiteRepositoryMySQL } from "./infrastructure/repositories/WebsiteRepositoryMySQL";

export default class Container {
  public readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  getUserController = () => {
    const uow = new UnitOfWork(this.pool);
    const userRepository = new UserRepositoryMySQL(uow);
    const emailService = new EmailServiceSMTP(config);
    const userService = new UserService(userRepository, emailService);
    const userController = new UserController(userService);

    return userController;
  };

  getWebsiteController = () => {
    const uow = new UnitOfWork(this.pool);
    const websiteRepository = new WebsiteRepositoryMySQL(uow);
    const websiteService = new WebsiteService(websiteRepository);
    const websiteController = new WebsiteController(websiteService);

    return websiteController;
  };
}
