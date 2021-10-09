import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Deposit/Withdraw", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to make a deposit", async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'John Doe',
      password: '12345'
    })

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: "teste",
      type: "deposit" as OperationType,
      user_id: user.id!
    })

    expect(statement).toHaveProperty("id")
  })

  it("should not be able to make a withdraw with insufficient funds", async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'John Doe',
      password: '12345'
    })


    await expect(createStatementUseCase.execute({
      amount: 100,
      description: "teste",
      type: "withdraw" as OperationType,
      user_id: user.id!
    })).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it("should be able to make a withdraw", async () => {
    const user = await createUserUseCase.execute({
      email: 'teste@teste.com',
      name: 'John Doe',
      password: '12345'
    })

    await createStatementUseCase.execute({
      amount: 100,
      description: "teste",
      type: "deposit" as OperationType,
      user_id: user.id!
    })

    const withdraw = await createStatementUseCase.execute({
      amount: 100,
      description: "teste",
      type: "withdraw" as OperationType,
      user_id: user.id!
    })

    expect(withdraw).toHaveProperty("id")
  })
})
