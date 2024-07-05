import request from "supertest";
import "jest-extended";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

type Application = {
  app_id: number;
  vol_id: number;
  org_id: number;
  listing_id: number;
  prov_confirm: boolean;
  full_conf: boolean;
  vol_contact_tel: string;
  vol_email: string;
  list_title: string;
  list_location: string;
  list_date: Date;
  list_time: Date;
  list_img_id: number | null;
};

describe("GET api/applications/?list_id=", () => {
  test("Successfully returns a listings applications for the organisation user", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        //Get cookie
        const { token } = response.body.user;

        return request(app)
          .get("/api/applications/?list_id=1")
          .set("Authorization", `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
            const applications = body.applications;

            applications.forEach((application: Application) => {
              expect(application).toMatchObject({
                app_id: expect.any(Number),
                vol_id: expect.any(Number),
                org_id: expect.any(Number),
                listing_id: expect.any(Number),
                prov_confirm: expect.any(Boolean),
                full_conf: expect.any(Boolean),
                list_title: expect.any(String),
                list_location: expect.any(String),
                list_img_id: expect.toSatisfy(
                  (value) => typeof value === "number" || value === null
                ),
                vol_email: expect.any(String),
                vol_contact_tel: expect.toSatisfy(
                  (value) => typeof value === "string" || value === null
                ),
              });

              expect(() => new Date(application.list_date)).not.toThrow(Error);
              expect(() => new Date(application.list_time)).not.toThrow(Error);
            });
          });
      });
  });

  test("Returns an 401 error when the organisation user is not signed in", () => {
    return request(app)
      .get("/api/applications/?list_id=1")
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_NOT_LOGGED_IN);
      });
  });

  test("Returns an error when the listing doesn't belong to the organisation", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .get("/api/applications/?list_id=2")
          .set("Authorization", `Bearer ${token}`)
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });

  test("Returns an error when the listing id isn't a number", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        //Get cookie
        const { token } = response.body.user;

        return request(app)
          .get("/api/applications/?list_id=banana")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("list_id is not a number!");
          });
      });
  });

  test("Returns an error when the listing id isn't specified", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        //Get cookie
        const { token } = response.body.user;

        return request(app)
          .get("/api/applications/")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("list_id is not set!");
          });
      });
  });

  test("Returns an error when the listing doesn't exist", () => {
    const orgCredentials = {
      email: "oxfam@email.com",
      password: "mybadpassword",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .get("/api/applications/?list_id=9999")
          .set("Authorization", `Bearer ${token}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No listing found!");
          });
      });
  });
});
