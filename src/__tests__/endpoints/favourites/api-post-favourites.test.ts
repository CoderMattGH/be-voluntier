import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

type FavouriteListing = {
  fav_lists_id: number;
  vol_id: number;
  list_id: number;
};

describe("POST /api/favourites/:list_id", () => {
  test("When given approproate user_id and list_id will post to favourite table", () => {
    const user_id: number = 1;

    return request(app)
      .post("/api/favourites/2")
      .send({ user_id })
      .expect(201)
      .then(({ body }) => {
        expect(body.vol_id).toBe(1);
        expect(body.list_id).toBe(2);
      });
  });

  test("When given invalid user_id, will respond with correct error message", () => {
    const user_id: number = 99999;

    return request(app)
      .post("/api/favourites/2")
      .send({ user_id })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found!");
      });
  });

  test("When given invalid listing_id, will respond with correct error message", () => {
    const user_id: number = 1;

    return request(app)
      .post("/api/favourites/999")
      .send({ user_id })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found!");
      });
  });
});
