import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { CreateUserError } from "./CreateUserError"


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '12345'
    })

    expect(user).toHaveProperty("id")
  })

  it("should not be able to create a new user with e-mail that already exists", async () => {
    await createUserUseCase.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '12345'
    })

    await expect(
      createUserUseCase.execute({
        email: 'johndoe@gmail.com',
        name: 'John Doe',
        password: '12345'
      })
    ).rejects.toBeInstanceOf(CreateUserError)
  })


})
