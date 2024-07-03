import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/listings/:listing_id", () => {
  test("Returns the correct listing object", () => {
    return request(app)
      .get("/api/listings/2")
      .expect(200)
      .then(({ body }) => {
        const listing = body.listing;

        expect(listing).toMatchObject({
          list_id: expect.any(Number),
          list_title: expect.any(String),
          list_location: expect.any(String),
          list_longitude: expect.any(Number),
          list_latitude: expect.any(Number),
          list_duration: expect.any(Number),
          list_description: expect.any(String),
          list_org: expect.any(Number),
          org_name: expect.any(String),
        });

        expect(() => new Date(listing.list_date)).not.toThrow(Error);
        expect(() => new Date(listing.list_time)).not.toThrow(Error);

        expect(listing.org_avatar_img_id).toBeDefined();
        expect(listing.list_img_id).toBeDefined();
      });
  });
  test("Returns a 400 bad request error when supplied an invalid parametric endpoint", () => {
    return request(app)
      .get("/api/listings/two")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
  test("Returns a 404 resource not found error when supplied an id as a parametric endpoint that does not exist", () => {
    return request(app)
      .get("/api/listings/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No listing found!");
      });
  });
});
