import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";


import createConnection from '../../../../database'

let connection: Connection

describe("Authenticate user", () => {
  beforeAll(async () => {
    connection = await createConnection()

    await connection.runMigrations()

    await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456"
    })

  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to authenticate user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@gmail.com",
      password: "123456"
    })

    expect(responseToken.status).toBe(200)
    expect(responseToken.body).toHaveProperty("token")
  })

  it("should be able to authenticate user with wrong credentials", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@wrong.com",
      password: "wrong"
    })

    expect(responseToken.status).toBe(401)
  })
})
