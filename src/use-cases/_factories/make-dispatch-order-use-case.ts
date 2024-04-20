import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository";
import { DispatchOrderUseCase } from "@/use-cases/orders/dispatch-order";

export function makeDispatchOrderUseCase(): DispatchOrderUseCase {
  const ordersRepository = new DrizzleOrdersRepository()
  const dispatchOrdersUseCase = new DispatchOrderUseCase(ordersRepository)

  return dispatchOrdersUseCase
}