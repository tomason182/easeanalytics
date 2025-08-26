import { UnitOfWork } from "./UnitOfWork";

type TransactionalMethod = (
  ...args: any[]
) => Promise<any> & { useTransaction?: boolean };

type TransactionalService = {
  [key: string]: TransactionalMethod | any;
};

// Proxy for transactions
export function makeTransactional<T extends TransactionalService>(
  service: T,
  unitOfWork: UnitOfWork
): T {
  return new Proxy(service, {
    get(target, propKey: string | symbol) {
      const originalMethod = (target as any)[propKey];
      if (typeof originalMethod !== "function") {
        return originalMethod;
      }

      const needTransaction = originalMethod.useTransaction === true;

      return async function (...args: any[]) {
        try {
          // 1. get a connection.
          await unitOfWork.getConnection();

          // 2. Start a transaction if required.
          if (needTransaction === true) {
            await unitOfWork.begin();
            console.log(
              `[Transaction]: Transaction started for: ${String(propKey)}`
            );
          }

          // 3. Execute the original method of the service.
          const result = await originalMethod.apply(target, args);

          // 4. If transaction. Commit
          if (needTransaction === true) {
            await unitOfWork.commit();
          }
          return result;
        } catch (err) {
          // 5. Rollback if errors occurs
          if (needTransaction === true) {
            await unitOfWork.rollback();
          }
          throw err;
        } finally {
          // 6. Release the connection.
          await unitOfWork.release();
        }
      };
    },
  });
}
