import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("DELETE /api/favourites/:vol_user_id/listings", () => {
  test("Deletes an extant favourite successfully", () => {
    const list_id = 1;

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

        // Fetch favourites
        return request(app)
          .delete("/api/favourites/1/listings")
          .set("Authorization", `Bearer ${token}`)
          .send({ list_id })
          .expect(200)
          .then(({ body }) => {
            const { favourite_listing: favourite } = body;

            expect(favourite.vol_id).toBe(1);
            expect(favourite.list_id).toBe(list_id);
          });
      });
  });

  test("Must be correct user", () => {
    const list_id = 1;

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

        // Fetch favourites
        return request(app)
          .delete("/api/favourites/2/listings")
          .set("Authorization", `Bearer ${token}`)
          .send({ list_id })
          .expect(403)
          .then(({ body }) => {
            expect(body.msg).toBe(constants.ERR_MSG_PERMISSION_DENIED);
          });
      });
  });

  test("User id must be a number", () => {
    const list_id = 1;

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

        // Fetch favourites
        return request(app)
          .delete("/api/favourites/banan/listings")
          .set("Authorization", `Bearer ${token}`)
          .send({ list_id })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("user_id is not a number!");
          });
      });
  });

  test("If entry doesn't exist then 404 error", () => {
    const list_id = 999;

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

        // Fetch favourites
        return request(app)
          .delete("/api/favourites/1/listings")
          .set("Authorization", `Bearer ${token}`)
          .send({ list_id })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Favourite listing not found!");
          });
      });
  });
});
