import nodemailer from "nodemailer";
import { Pool } from "mysql2/promise.js";
import { config } from "./config/nodemailerConfig";
import { EmailServiceSMTP } from "./infrastructure/email/EmailServiceSMTP";
import { makeTransactional } from "./infrastructure/transactions/transactionalDecorator";
import { UnitOfWork } from "./infrastructure/transactions/UnitOfWork";
//User
import { UserService } from "./application/UserService";
import { UserController } from "./infrastructure/web/controllers/UserController";
import { UserRepositoryMySQL } from "./infrastructure/repositories/UserRepositoryMySQL";

// Website
import { WebsiteService } from "./application/WebsiteService";
import { WebsiteController } from "./infrastructure/web/controllers/websiteController";
import { WebsiteRepositoryMySQL } from "./infrastructure/repositories/WebsiteRepositoryMySQL";

// PageView
import { PageViewController } from "./infrastructure/web/controllers/PageViewController";
import { PageViewsService } from "./application/PageViewService";
import { PageViewsRepositoryMySQL } from "./infrastructure/repositories/PageViewsRepositoryMySQL";
import { SessionCacheRepository } from "./infrastructure/cache/SessionCacheRepository";
import { GeoIPService } from "./infrastructure/geoip/GeoIPService";

export default class Container {
  public readonly pool: Pool;
  public readonly dbPath: string;

  constructor(pool: Pool, dbPath: string) {
    this.pool = pool;
    this.dbPath = dbPath;
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

  getPageViewController = () => {
    const uow = new UnitOfWork(this.pool);
    const pageViewRepository = new PageViewsRepositoryMySQL(uow);
    const websiteRepository = new WebsiteRepositoryMySQL(uow);
    const sessionCacheRepository = new SessionCacheRepository();
    const geoIPService = new GeoIPService(this.dbPath);
    const pageViewService = new PageViewsService(
      pageViewRepository,
      websiteRepository,
      sessionCacheRepository,
      geoIPService
    );
    const pageViewController = new PageViewController(pageViewService);

    return pageViewController;
  };
}
