import request from "supertest";
import "jest-extended";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/applications/:app_id", () => {
  test("Returns the correct app object when app id is for an application by the vol user logged in", () => {
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
        const { header } = response;

        return request(app)
          .get("/api/applications/1")
          .set("Cookie", [...header["set-cookie"]])
          .expect(200)
          .then(({ body }) => {
            const application = body.application;

            expect(application).toMatchObject({
              app_id: expect.any(Number),
              vol_id: expect.any(Number),
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

            expect(() => new Date(application.list_date)).not.toThrow(Error);
            expect(() => new Date(application.list_time)).not.toThrow(Error);
          });
      });
  });
  test("Returns the correct app object when app id is for an application by the org user logged in", () => {
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
        const { header } = response;

        return request(app)
          .get("/api/applications/1")
          .set("Cookie", [...header["set-cookie"]])
          .expect(200)
          .then(({ body }) => {
            const application = body.application;

            expect(application).toMatchObject({
              app_id: expect.any(Number),
              vol_id: expect.any(Number),
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

            expect(() => new Date(application.list_date)).not.toThrow(Error);
            expect(() => new Date(application.list_time)).not.toThrow(Error);
          });
      });
  });
  test("Returns a 403 when a volunteer tries to access different user's application", () => {
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
        const { header } = response;

        return request(app)
          .get("/api/applications/1")
          .set("Cookie", [...header["set-cookie"]])
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });
  test("Returns a 403 when an organisation tries to access different user's application", () => {
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
          .get("/api/applications/1")
          .set("Cookie", [...header["set-cookie"]])
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
        // Get cookie
        const { header } = response;

        return request(app)
          .get("/api/applications/two")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("app_id is not a number!");
          });
      });
  });
  test("Returns a 404 resource not found error when supplied an id as a parametric endpoint that does not exist", () => {
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
        const { header } = response;
        return request(app)
          .get("/api/applications/999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No application found!");
          });
      });
  });
});
