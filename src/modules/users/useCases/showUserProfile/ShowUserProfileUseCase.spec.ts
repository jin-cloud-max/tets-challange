import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '12345'
    })

    const user_id = user.id!

    const userProfile = await showUserProfileUseCase.execute(user_id)

    expect(userProfile).toHaveProperty("id")
  })

  it("should not be able to show user profile if user does not exists", async () => {
    await expect(
      showUserProfileUseCase.execute('12345')
    ).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})
