import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";


import createConnection from '../../../../database'

let connection: Connection

describe("Make deposit/withdraw", () => {
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

  it("should be able to deposit", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@gmail.com",
      password: "123456"
    })

    const { token } = responseToken.body

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Depósito para a conta"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })

  it("should not be able to make a deposit/withdraw without authenticate", async () => {
    const depositResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Depósito para a conta"
      })

    const depositWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Retirada para da conta"
      })

    expect(depositResponse.status).toBe(401)
    expect(depositWithdraw.status).toBe(401)
  })

  it("should be able to make a withdraw", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@gmail.com",
      password: "123456"
    })

    const { token } = responseToken.body

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Depósito para a conta"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })

})
