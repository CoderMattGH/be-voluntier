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
  attended: boolean;
  confirm: boolean;
  list_title: string;
  list_location: string;
  list_longitude: number;
  list_latitude: number;
  list_description: string;
  list_date: Date;
  list_time: Date;
  list_img_id: number | null;
  vol_first_name: string;
  vol_last_name: string;
  vol_email: string;
  vol_contact_tel: string;
  vol_avatar_img_id: number | null;
};

describe("GET api/applications/org/:org_user_id", () => {
  test(
    "Returns the correct array of app objects when org id for applications matches the user id " +
      "of the organisation logged in",
    () => {
      const orgCredentials = {
        email: "redcross@email.com ",
        password: "mybadpassword234",
        role: "organisation",
      };
      return request(app)
        .post("/api/login")
        .send(orgCredentials)
        .then((response) => {
          // Get cookie
          const { token } = response.body.user;

          return request(app)
            .get("/api/applications/org/2")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .then(({ body }) => {
              const applications = body.applications;

              applications.forEach((application: Application) => {
                expect(application).toMatchObject({
                  app_id: expect.any(Number),
                  vol_id: expect.any(Number),
                  org_id: 2,
                  listing_id: expect.any(Number),
                  attended: expect.any(Boolean),
                  confirm: expect.any(Boolean),
                  list_title: expect.any(String),
                  list_location: expect.any(String),
                  list_longitude: expect.any(Number),
                  list_latitude: expect.any(Number),
                  list_description: expect.any(String),
                  list_img_id: expect.toSatisfy(
                    (value) => typeof value === "number" || value === null
                  ),
                  vol_first_name: expect.any(String),
                  vol_last_name: expect.any(String),
                  vol_email: expect.any(String),
                  vol_contact_tel: expect.any(String),
                  vol_avatar_img_id: expect.toSatisfy(
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
  test(
    "Returns the correct array of app objects when org id for applications matches the user id " +
      "of the organisation logged in, and a valid query for a listing id filters applications down " +
      "to those whose listing id matches the listing id passed as query",
    () => {
      const orgCredentials = {
        email: "redcross@email.com ",
        password: "mybadpassword234",
        role: "organisation",
      };
      return request(app)
        .post("/api/login")
        .send(orgCredentials)
        .then((response) => {
          const { token } = response.body.user;

          return request(app)
            .get("/api/applications/org/2?listing_id=3")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .then(({ body }) => {
              const applications = body.applications;

              applications.forEach((application: Application) => {
                expect(application).toMatchObject({
                  app_id: expect.any(Number),
                  vol_id: expect.any(Number),
                  org_id: 2,
                  listing_id: 3,
                  attended: expect.any(Boolean),
                  confirm: expect.any(Boolean),
                  list_title: expect.any(String),
                  list_location: expect.any(String),
                  list_longitude: expect.any(Number),
                  list_latitude: expect.any(Number),
                  list_description: expect.any(String),
                  list_img_id: expect.toSatisfy(
                    (value) => typeof value === "number" || value === null
                  ),
                  vol_first_name: expect.any(String),
                  vol_last_name: expect.any(String),
                  vol_email: expect.any(String),
                  vol_contact_tel: expect.any(String),
                  vol_avatar_img_id: expect.toSatisfy(
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
  test("Returns a 400 bad request error when supplied an invalid listing id query", () => {
    const orgCredentials = {
      email: "redcross@email.com ",
      password: "mybadpassword234",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .get("/api/applications/org/2?listing_id=two")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid query for a listing id");
          });
      });
  });

  test(
    "Returns a 404 resource not found error when supplied a listing id that does not " +
      "exist",
    () => {
      const orgCredentials = {
        email: "redcross@email.com ",
        password: "mybadpassword234",
        role: "organisation",
      };

      return request(app)
        .post("/api/login")
        .send(orgCredentials)
        .then((response) => {
          const { token } = response.body.user;
          return request(app)
            .get("/api/applications/org/2?listing_id=999")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("No applications found!");
            });
        });
    }
  );

  test("Returns a 403 when a user tries to access different organisation's application", () => {
    const orgCredentials = {
      email: "redcross@email.com ",
      password: "mybadpassword234",
      role: "organisation",
    };
    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .get("/api/applications/org/1")
          .set("Authorization", `Bearer ${token}`)
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });
  test("Returns a 400 bad request error when supplied an invalid parametric endpoint", () => {
    const orgCredentials = {
      email: "redcross@email.com ",
      password: "mybadpassword234",
      role: "organisation",
    };

    return request(app)
      .post("/api/login")
      .send(orgCredentials)
      .then((response) => {
        const { token } = response.body.user;

        return request(app)
          .get("/api/applications/org/two")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("org_user_id is not a number!");
          });
      });
  });
  test(
    "Returns a 404 resource not found error when supplied an id as a parametric endpoint that " +
      "does not exist",
    () => {
      const orgCredentials = {
        email: "redcross@email.com ",
        password: "mybadpassword234",
        role: "organisation",
      };

      return request(app)
        .post("/api/login")
        .send(orgCredentials)
        .then((response) => {
          const { token } = response.body.user;
          return request(app)
            .get("/api/applications/org/999")
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("No applications found!");
            });
        });
    }
  );
});
