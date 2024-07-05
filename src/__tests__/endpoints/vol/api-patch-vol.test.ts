import request from "supertest";
import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";
import { checkPassword } from "../../../auth/auth-utils";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("PATCH /api/vol/:user_id", () => {
  test("updates a user profile when email is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ email: "mattygemail@email.com" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: email changed");

    const userResponse = await db.query(
      "SELECT vol_email FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_email).toBe("mattygemail@email.com");
  });

  test("updates a user profile when password is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ password: "mygoatpassword" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: password changed");

    const userResponse = await db.query(
      "SELECT vol_password FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(checkPassword("mygoatpassword", updatedUser.vol_password)).toBe(
      true
    );
  });
  test("updates a user profile when first name is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "Winston" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: firstName changed");

    const userResponse = await db.query(
      "SELECT vol_first_name FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_first_name).toBe("Winston");
  });
  test("updates a user profile when last name is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ lastName: "Churchill" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: lastName changed");

    const userResponse = await db.query(
      "SELECT vol_last_name FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_last_name).toBe("Churchill");
  });
  test("updates a user profile when contact telephone number is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ contactTel: "98239238928398" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: contactTel changed");

    const userResponse = await db.query(
      "SELECT vol_contact_tel FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_contact_tel).toBe("98239238928398");
  });
  //   TODO: updating avatar image
  test("updates a user profile when bio is included in the request body", async () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(volCredentials);

    const { token } = loginResponse.body.user;

    const patchResponse = await request(app)
      .patch("/api/vol/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "Help, I need somebody, help!" })
      .expect(200);

    const { message } = patchResponse.body;
    expect(message).toBe("Update successful: bio changed");

    const userResponse = await db.query(
      "SELECT vol_bio FROM vol_users WHERE vol_id = 1"
    );
    const updatedUser = userResponse.rows[0];
    expect(updatedUser.vol_bio).toBe("Help, I need somebody, help!");
  });
});
