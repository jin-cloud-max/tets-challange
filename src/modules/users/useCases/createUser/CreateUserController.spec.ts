import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";


import createConnection from '../../../../database'

let connection: Connection

describe("Create user", () => {
  beforeAll(async () => {
    connection = await createConnection()

    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to create a new user", async () => {
    const responseUser = await request(app).post("/api/v1/users").send({
      email: "johndoe@gmail.com",
      name: "John Doe",
      password: "123456"
    })

    expect(responseUser.status).toBe(201)
  })
})
