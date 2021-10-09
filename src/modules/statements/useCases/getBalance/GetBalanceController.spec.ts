import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";


import createConnection from '../../../../database'

let connection: Connection

describe("Get account balance", () => {
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

  it("should be able to get the balance", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@gmail.com",
      password: "123456"
    })

    const { token } = responseToken.body

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Depósito para a conta"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.body.statement[0]).toHaveProperty("id")
    expect(response.body.balance).toBe(100)
    expect(response.status).toBe(200)
  })

})
