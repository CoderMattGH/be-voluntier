import request from "supertest";
import "jest-extended";

import * as constants from "../../../constants";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("POST /api/applications/", () => {
  test("Application successfully posted", () => {
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
          .post("/api/applications/")
          .set("Authorization", `Bearer ${token}`)
          .send({ listing_id: 1, vol_user_id: 1 })
          .expect(200)
          .then(({ body }) => {
            const application = body.application;

            expect(application).toMatchObject({
              app_id: expect.any(Number),
              vol_id: 1,
              listing_id: 1,
              confirm: false,
              attended: false,
            });
          });
      });
  });

  test("Volunteer user must be logged in", () => {
    return request(app)
      .post("/api/applications/")
      .send({ listing_id: 1, vol_user_id: 1 })
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_NOT_LOGGED_IN);
      });
  });

  test("Volunteer user cannot provide different user_id", () => {
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
          .post("/api/applications/")
          .set("Authorization", `Bearer ${token}`)
          .send({ listing_id: 1, vol_user_id: 2 })
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });

  test("Volunteer user cannot apply for same listing twice", () => {
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
          .post("/api/applications/")
          .set("Authorization", `Bearer ${token}`)
          .send({ listing_id: 3, vol_user_id: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Application already exists!");
          });
      });
  });

  test("User has to be a volunteer", () => {
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
          .post("/api/applications/")
          .set("Authorization", `Bearer ${token}`)
          .send({ listing_id: 1, vol_user_id: 1 })
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });

  test("Listing_id cannot be undefined", () => {
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
          .post("/api/applications/")
          .set("Authorization", `Bearer ${token}`)
          .send({ vol_user_id: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("listing_id is not a number!");
          });
      });
  });

  test("Listing_id must be a number", () => {
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
          .post("/api/applications/")
          .set("Authorization", `Bearer ${token}`)
          .send({ listing_id: "banana", vol_user_id: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("listing_id is not a number!");
          });
      });
  });

  test("vol_user_id cannot be undefined", () => {
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
          .post("/api/applications/")
          .set("Authorization", `Bearer ${token}`)
          .send({ listing_id: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("vol_user_id is not a number!");
          });
      });
  });

  test("vol_user_id must be a number", () => {
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
          .post("/api/applications/")
          .set("Authorization", `Bearer ${token}`)
          .send({ listing_id: 1, vol_user_id: "bananan" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("vol_user_id is not a number!");
          });
      });
  });
});
