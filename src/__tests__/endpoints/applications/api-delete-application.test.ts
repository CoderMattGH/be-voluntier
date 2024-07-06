import request from "supertest";
import "jest-extended";

import * as constants from "../../../constants";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("DELETE /api/applications/", () => {
  test("The correct volunteer user can successfully deletes application", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        const token = response.body.user.token;

        return request(app)
          .delete("/api/applications/1")
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
            const application = body.application;

            expect(application).toMatchObject({
              app_id: 1,
              vol_id: 1,
              listing_id: expect.any(Number),
              attended: expect.any(Boolean),
              confirm: expect.any(Boolean),
            });
          });
      });
  });

  test("The correct organisation user can successfully delete an application", () => {
    const volCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .delete("/api/applications/6")
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
            const application = body.application;

            expect(application).toMatchObject({
              app_id: expect.any(Number),
              vol_id: expect.any(Number),
              listing_id: 1,
              attended: expect.any(Boolean),
              confirm: expect.any(Boolean),
            });
          });
      });
  });

  test("The wrong organisation user cannot successfully delete an application", () => {
    const volCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .delete("/api/applications/1")
          .set("Authorization", `Bearer ${token}`)
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });

  test("Volunteer user has to be logged in", () => {
    return request(app)
      .delete("/api/applications/1")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_NOT_LOGGED_IN);
      });
  });

  test("App_id must be a number", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .delete("/api/applications/banana")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("app_id is not a number!");
          });
      });
  });

  test("App_id must exist", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .delete("/api/applications/9999")
          .set("Authorization", `Bearer ${token}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No application found!");
          });
      });
  });

  test("Application must belong to the logged in volunteer user", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .delete("/api/applications/2")
          .set("Authorization", `Bearer ${token}`)
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });
});
