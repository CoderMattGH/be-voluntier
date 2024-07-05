import request from "supertest";
import "jest-extended";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";
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
  list_title: string;
  list_location: string;
  list_longitude: number;
  list_latitude: number;
  list_description: string;
  list_date: Date;
  list_time: Date;
  list_img_id: number | null;
  org_name: string;
};

describe("GET api/applications/vol/:vol_user_id", () => {
  test(
    "Returns the correct array of app objects when vol id for applications matches the user id " +
      "of the volunteer logged in",
    () => {
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
            .get("/api/applications/vol/1")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .then(({ body }) => {
              const applications = body.applications;

              applications.forEach((application: Application) => {
                expect(application).toMatchObject({
                  app_id: expect.any(Number),
                  vol_id: 1,
                  org_id: expect.any(Number),
                  listing_id: expect.any(Number),
                  prov_confirm: expect.any(Boolean),
                  full_conf: expect.any(Boolean),
                  list_title: expect.any(String),
                  list_location: expect.any(String),
                  list_longitude: expect.any(Number),
                  list_latitude: expect.any(Number),
                  list_description: expect.any(String),
                  org_name: expect.any(String),
                  list_img_id: expect.toSatisfy(
                    (value) => typeof value === "number" || value === null
                  ),
                });
                expect(() => new Date(application.list_date)).not.toThrow(
                  Error
                );
                expect(() => new Date(application.list_time)).not.toThrow(
                  Error
                );
              });
            });
        });
    }
  );
  test("Returns a 403 when a volunteer tries to access different volunteer's application", () => {
    const volCredentials = {
      email: "alice.smith@email.com",
      password: "anotherpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { token } = response.body.user;

        return request(app)
          .get("/api/applications/vol/1")
          .set("Authorization", `Bearer ${token}`)
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });
  test("Returns a 400 bad request error when supplied an invalid parametric endpoint", () => {
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
          .get("/api/applications/vol/two")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("vol_user_id is not a number!");
          });
      });
  });
  test(
    "Returns a 404 resource not found error when supplied an id as a parametric endpoint that " +
      "does not exist",
    () => {
      const volCredentials = {
        email: "mattydemail@email.com",
        password: "mybadpassword",
        role: "volunteer",
      };

      return request(app)
        .post("/api/login")
        .send(volCredentials)
        .then((response) => {
          // Get cookie
          const { token } = response.body.user;
          return request(app)
            .get("/api/applications/vol/999")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("No applications found!");
            });
        });
    }
  );
});
