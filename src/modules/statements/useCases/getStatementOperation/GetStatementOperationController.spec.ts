import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from '../../../../database'

let connection: Connection

describe("Get statement operation", () => {
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

  it("should be able to get the deposit statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@gmail.com",
      password: "123456"
    })

    const { token } = responseToken.body

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Depósito para a conta"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.body.type).toBe("deposit")
    expect(response.status).toBe(200)

  })

  it("should be able to get the withdraw statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@gmail.com",
      password: "123456"
    })

    const { token } = responseToken.body

    const statement = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Retirada de recursos"
      })
      .set({
        Authorization: `Bearer ${token}`
      })

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.body.type).toBe("withdraw")
    expect(response.status).toBe(200)

  })

})
