import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to list a statement", async () => {
    const user = await createUserUseCase.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123455'
    })

    const statement = await createStatementUseCase.execute({
      amount: 100,
      description: 'Depósito em conta',
      type: "deposit" as OperationType,
      user_id: user.id!
    })


    const getStatement = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!
    })

    expect(getStatement).toHaveProperty("id")

  })

  it("should not be able to get a statement that does not exists", async () => {
    const user = await createUserUseCase.execute({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password: '123455'
    })

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: '12345'
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it("should not be able to get a statement if user does not exists", async () => {

    await expect(
      getStatementOperationUseCase.execute({
        user_id: '123456',
        statement_id: 'statement.id!'
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })
})
