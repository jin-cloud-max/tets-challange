import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to authenticate user", async () => {
    await createUserUseCase.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '12345'
    })

    const authenticateUser = await authenticateUserUseCase.execute({
      email: 'johndoe@gmail.com',
      password: '12345'
    })

    expect(authenticateUser).toHaveProperty("token")
    expect(authenticateUser).toHaveProperty("user")
  })

  it("should not be able to authenticate a user that does not exists", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'johndoe@gmail.com',
        password: '12345'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate a user with wrong password", async () => {
    await createUserUseCase.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '12345'
    })

    await expect(
      authenticateUserUseCase.execute({
        email: 'johndoe@gmail.com',
        password: '123'
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
