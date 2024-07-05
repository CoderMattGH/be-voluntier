import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("POST /api/login", () => {
  test("Logs in the volunteer and returns a volunteer object", () => {
    const loginObj = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(loginObj)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user).toMatchObject({
          vol_id: expect.any(Number),
          vol_email: expect.any(String),
          vol_first_name: expect.any(String),
          vol_last_name: expect.any(String),
          vol_bio: expect.any(String),
          vol_hours: expect.any(Number),
          role: expect.any(String),
          token: expect.any(String),
        });

        expect(user.vol_avatar_img_id).toBeDefined();
      });
  });

  test("Logs in the organisation and returns a organisation object", () => {
    const loginObj = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(loginObj)
      .expect(200)
      .then(({ body }) => {
        const { user } = body;

        expect(user).toMatchObject({
          org_id: expect.any(Number),
          org_email: expect.any(String),
          org_type: expect.any(Number),
          org_bio: expect.any(String),
          org_verified: expect.any(Boolean),
          role: expect.any(String),
          token: expect.any(String),
        });

        expect(user.org_avatar_img_id).toBeDefined();
      });
  });

  test("403 when given invalid password", () => {
    const loginObj = {
      email: "mattydemail@email.com",
      password: "mybadpasDsword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(loginObj)
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid email or password!");
      });
  });

  test("404 when given correct email and password, but wrong role", () => {
    const loginObj = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(loginObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("org_user not found!");
      });
  });

  test("404 when given non-extant email", () => {
    const loginObj = {
      email: "nouser@nouser.com",
      password: "mybadpasDsword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(loginObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("vol_user not found!");
      });
  });

  test("400 when given empty username", () => {
    const loginObj = {
      email: "",
      password: "mybadpasDsword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(loginObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Email cannot be empty!");
      });
  });

  test("400 when given an empty password", () => {
    const loginObj = {
      email: "test@test.com",
      password: " ",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(loginObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Password cannot be empty!");
      });
  });

  test("400 when given an empty role", () => {
    const loginObj = {
      email: "test@test.com",
      password: "asdasd",
      role: "",
    };

    return request(app)
      .post("/api/login")
      .send(loginObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid role provided!");
      });
  });

  test("400 when given an invalid role", () => {
    const loginObj = {
      email: "test@test.com",
      password: "asdasd",
      role: "banana",
    };

    return request(app)
      .post("/api/login")
      .send(loginObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid role provided!");
      });
  });
});
