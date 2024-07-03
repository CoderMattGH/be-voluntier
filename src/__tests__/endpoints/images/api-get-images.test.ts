import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/images/:img_id", () => {
  test("Returns the valid image object with data", () => {
    return request(app)
      .get("/api/images/1")
      .expect(200)
      .then(({ body }) => {
        const image = body.image;

        expect(image).toMatchObject({
          img_id: expect.any(Number),
          img_b64_data: expect.any(String),
        });
      });
  });

  test("Returns a 404 when image not found", () => {
    return request(app)
      .get("/api/images/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No image found!");
      });
  });

  test("Returns a 400 when img_id is not a number", () => {
    return request(app)
      .get("/api/images/abanana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("img_id is not a number!");
      });
  });
});
