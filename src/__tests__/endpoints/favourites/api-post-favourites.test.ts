import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("POST /api/favourites/:vol_user_id/listings", () => {
  test("When given appropriate user_id and list_id will post to favourite table", () => {
    const list_id = 5;

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
          .post("/api/favourites/1/listings")
          .set("Authorization", `Bearer ${token}`)
          .send({ list_id })
          .expect(201)
          .then(({ body }) => {
            const { favourite } = body;
            expect(favourite.vol_id).toBe(1);
            expect(favourite.list_id).toBe(list_id);
          });
      });
  });

  // TODO: More user friendly error message
  test("Cannot favourite the same post twice", () => {
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
          .post("/api/favourites/1/listings")
          .set("Authorization", `Bearer ${token}`)
          .send({ list_id })
          .expect(409);
      });
  });

  test("When volunteer user is not logged in returns with error", () => {
    const list_id = 1;

    return request(app)
      .post("/api/favourites/1/listings")
      .send({ list_id })
      .expect(401)
      .then(({ body }) => {
        expect(body.msg).toBe(constants.ERR_MSG_NOT_LOGGED_IN);
      });
  });

  test("list_id must be a number", () => {
    const list_id = "banana";

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
          .post("/api/favourites/1/listings")
          .set("Authorization", `Bearer ${token}`)
          .send({ list_id })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("list_id is not a number!");
          });
      });
  });

  test("list_id cannot be empty", () => {
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
          .post("/api/favourites/1/listings")
          .set("Authorization", `Bearer ${token}`)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("list_id is not a number!");
          });
      });
  });

  test("user_id has to be a number", () => {
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
          .post("/api/favourites/banana/listings")
          .set("Authorization", `Bearer ${token}`)
          .send({ list_id })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("user_id is not a number!");
          });
      });
  });

  test("Listing that doesn't exist returns a 404 error", () => {
    const list_id = 9999;
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
          .post("/api/favourites/1/listings")
          .set("Authorization", `Bearer ${token}`)
          .send({ list_id })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No listing found!");
          });
      });
  });
});
