import request from "supertest";
import "jest-extended";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("PATCH /api/applications/:app_id", () => {
  test("Successfully accepts a provisional confirm", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        return request(app)
          .patch("/api/applications/6")
          .set("Cookie", [...header["set-cookie"]])
          .send({ accept: true })
          .expect(200)
          .then(({ body }) => {
            const { application } = body;

            expect(application).toMatchObject({
              app_id: 6,
              vol_id: expect.any(Number),
              listing_id: expect.any(Number),
              prov_confirm: true,
              full_conf: false,
            });
          });
      });
  });

  test("Successfully changes a provisional confirm to false", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        return request(app)
          .patch("/api/applications/6")
          .set("Cookie", [...header["set-cookie"]])
          .send({ accept: false })
          .expect(200)
          .then(({ body }) => {
            const { application } = body;

            expect(application).toMatchObject({
              app_id: 6,
              vol_id: expect.any(Number),
              listing_id: expect.any(Number),
              prov_confirm: false,
              full_conf: false,
            });
          });
      });
  });

  test("Cannot change when the application has been fully confirmed", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        return request(app)
          .patch("/api/applications/5")
          .set("Cookie", [...header["set-cookie"]])
          .send({ accept: false })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "Application has already been fully confirmed!"
            );
          });
      });
  });

  test("app_id has to be a number", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        return request(app)
          .patch("/api/applications/banana")
          .set("Cookie", [...header["set-cookie"]])
          .send({ accept: false })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("app_id is not a number!");
          });
      });
  });

  test("accept has to be a boolean", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        return request(app)
          .patch("/api/applications/6")
          .set("Cookie", [...header["set-cookie"]])
          .send({ accept: "banana" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("accept must be a boolean!");
          });
      });
  });

  test("accept has to be a boolean", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        return request(app)
          .patch("/api/applications/6")
          .set("Cookie", [...header["set-cookie"]])
          .send({ accept: 23 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("accept must be a boolean!");
          });
      });
  });

  test("Organisation user must be logged in", () => {
    return request(app)
      .patch("/api/applications/6")
      .send({ accept: true })
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_NOT_LOGGED_IN);
      });
  });

  test("Organisation user has to own application listing", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        return request(app)
          .patch("/api/applications/4")
          .set("Cookie", [...header["set-cookie"]])
          .send({ accept: false })
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });

  test("Volunteer user cannot accept application", () => {
    const orgCredentials = {
      email: "michael.brown@email.com",
      password: "mybadpassword432",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        return request(app)
          .patch("/api/applications/6")
          .set("Cookie", [...header["set-cookie"]])
          .send({ accept: false })
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });
});
