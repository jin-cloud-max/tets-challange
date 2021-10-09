import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("List user balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  })

  it("should be able to list user balance", async () => {
    const user = await createUserUseCase.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123455'
    })

    await createStatementUseCase.execute({
      amount: 100,
      description: 'Depósito em conta',
      type: "deposit" as OperationType,
      user_id: user.id!
    })

    const userBalance = await getBalanceUseCase.execute({
      user_id: user.id!
    })

    expect(userBalance.balance).toEqual(100)
    expect(userBalance.statement[0]).toHaveProperty("id")
  })

  it("should not be able to list balance from a user that does not exists", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: '12345'
      })
    ).rejects.toBeInstanceOf(GetBalanceError)
  })
})
