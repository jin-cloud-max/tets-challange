import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";


import createConnection from '../../../../database'

let connection: Connection

describe("Show user profile", () => {
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

  it("should be able to show user profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@gmail.com",
      password: "123456"
    })

    const { token } = responseToken.body

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toEqual("John Doe")
  })

  it("should not be able to show user profile without authentication", async () => {
    const response = await request(app)
      .get("/api/v1/profile")

    expect(response.status).toBe(401)
  })
})
