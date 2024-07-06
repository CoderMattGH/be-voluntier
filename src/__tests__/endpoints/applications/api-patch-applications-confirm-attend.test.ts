import request from "supertest";
import "jest-extended";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("PATCH /api/applications/:app_id/confirm-attendance", () => {
  test("Successfully confirms application and awards badges", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .expect(200)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .patch("/api/applications/1/confirm-attendance")
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
            const { application } = body;

            expect(application).toMatchObject({
              app_id: 1,
              vol_id: expect.any(Number),
              listing_id: expect.any(Number),
              confirm: true,
              attended: true,
            });
          });
      });
  });

  test("A volunteer user's badges get successfully updated", () => {
    const orgCredentials = {
      email: "wwf@email.com",
      password: "anotherpassword12345",
      role: "organisation",
    };

    const volUserId = 10;
    let numOfBadges: number;

    return request(app)
      .get(`/api/badges/${volUserId}`)
      .expect(200)
      .then(({ body }) => {
        const { badges } = body;

        numOfBadges = badges.length;

        return;
      })
      .then(() => {
        return request(app).post("/api/login").send(orgCredentials).expect(200);
      })
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .patch("/api/applications/8/confirm-attendance")
          .set("Authorization", `Bearer ${token}`)
          .expect(200);
      })
      .then(() => {
        return request(app).get("/api/badges/10").expect(200);
      })
      .then(({ body }) => {
        const { badges } = body;

        const expected = [
          {
            badge_id: 1,
            badge_name: "1 Hour",
            badge_img_path: "./images/badges/01.png",
            badge_points: 100,
            vol_id: 10,
          },
          {
            badge_id: 2,
            badge_name: "10 Hours",
            badge_img_path: "./images/badges/02.png",
            badge_points: 300,
            vol_id: 10,
          },
        ];

        expect(badges).toEqual(expected);
        expect(badges).toHaveLength(numOfBadges + 1);
      });
  });

  test("A volunteer doesn't get any more badges when not over hours breakpoint", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    const volUserId = 1;
    let numOfBadges: number;

    return request(app)
      .get(`/api/badges/${volUserId}`)
      .expect(200)
      .then(({ body }) => {
        const { badges } = body;

        numOfBadges = badges.length;

        return;
      })
      .then(() => {
        return request(app).post("/api/login").send(orgCredentials).expect(200);
      })
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .patch("/api/applications/1/confirm-attendance")
          .set("Authorization", `Bearer ${token}`)
          .expect(200);
      })
      .then(() => {
        return request(app).get("/api/badges/1").expect(200);
      })
      .then(({ body }) => {
        const { badges } = body;

        expect(badges).toHaveLength(numOfBadges);
      });
  });

  test("Application id must be a number", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .expect(200)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .patch("/api/applications/banana/confirm-attendance")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("app_id is not a number!");
          });
      });
  });

  test("Error when application id doesn't exist", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .expect(200)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .patch("/api/applications/999999/confirm-attendance")
          .set("Authorization", `Bearer ${token}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Application not found!");
          });
      });
  });

  test("Error when application id hasn't yet been accepted", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .expect(200)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .patch("/api/applications/2/confirm-attendance")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Application has not yet been confirmed!");
          });
      });
  });

  test("Error when application attendance has already been confirmed!", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .expect(200)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .patch("/api/applications/3/confirm-attendance")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe(
              "Application attendance has already been confirmed!"
            );
          });
      });
  });

  test("401 error when application is not owned by organisation!", () => {
    const orgCredentials = {
      email: "redcross@email.com",
      password: "mybadpassword234",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .expect(200)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .patch("/api/applications/6/confirm-attendance")
          .set("Authorization", `Bearer ${token}`)
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });
});
