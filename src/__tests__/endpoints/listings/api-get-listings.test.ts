import request from "supertest";
import "jest-sorted";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";

beforeEach(() => seed(testData));

afterAll(() => db.end());

type listing = {
  list_id: number;
  list_title: string;
  list_location: string;
  list_longitude: number;
  list_latitude: number;
  list_date: Date;
  list_time: Date;
  list_duration: number;
  list_description: string;
  list_org: number;
  org_name: string;
  org_avatar_img_id: string | null;
  list_img_id: string | null;
};

describe("GET /api/listings", () => {
  test("Returns all the listings", () => {
    return request(app)
      .get("/api/listings")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;

        expect(listings.length).toBe(8);

        listings.forEach((listing: listing) => {
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
          // TODO: Change when sorted image formats
          expect(listing.org_avatar_img_id).toBeDefined();
          expect(listing.list_img_id).toBeDefined();
        });
      });
  });

  test("Returns all the listings in default order of date in ascending order", () => {
    return request(app)
      .get("/api/listings")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;

        expect(listings).toHaveLength(8);
        expect(listings).toBeSorted({ key: "list_date", descending: false });
      });
  });

  test("Returns all the listings by date in descending order", () => {
    return request(app)
      .get("/api/listings?order=desc")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;

        expect(listings).toHaveLength(8);
        expect(listings).toBeSorted({ key: "list_date", descending: true });
      });
  });

  test("Returns all the listings sorted by date in ascending order", () => {
    return request(app)
      .get("/api/listings?sort_by=date")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;

        expect(listings).toHaveLength(8);
        expect(listings).toBeSorted({ key: "list_date", descending: false });
      });
  });

  test("Returns all the listings sorted by date in descending order", () => {
    return request(app)
      .get("/api/listings?sort_by=date&order=desc")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;

        expect(listings).toHaveLength(8);
        expect(listings).toBeSorted({ key: "list_date", descending: true });
      });
  });

  test("Returns all the listings sorted by duration in ascending order", () => {
    return request(app)
      .get("/api/listings?sort_by=duration")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;

        expect(listings).toHaveLength(8);
        expect(listings).toBeSorted({
          key: "list_duration",
          descending: false,
        });
      });
  });

  test("Returns all the listings sorted by duration in descending order", () => {
    return request(app)
      .get("/api/listings?sort_by=duration&order=desc")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;

        expect(listings).toHaveLength(8);
        expect(listings).toBeSorted({
          key: "list_duration",
          descending: true,
        });
      });
  });

  test("Returns 400 status when given invalid sort_by query", () => {
    return request(app)
      .get("/api/listings?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query!");
      });
  });

  test("Returns 400 status when given invalid order query", () => {
    return request(app)
      .get("/api/listings?order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query!");
      });
  });

  test("Returns listings by search term with one word", () => {
    return request(app)
      .get("/api/listings?search=Cleanup")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;
        expect(listings.length).toBe(2);
      });
  });

  test("Returns listings by search term with one word by date descending order", () => {
    return request(app)
      .get("/api/listings?search=Cleanup&order=desc")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;
        expect(listings.length).toBe(2);

        expect(listings).toBeSorted({ key: "list_date", descending: true });
      });
  });

  test("Empty search string returns all results", () => {
    return request(app)
      .get("/api/listings?search=")
      .expect(200)
      .then(({ body }) => {
        const listings = body.listings;
        expect(listings.length).toBe(8);
      });
  });

  test("Returns a 404 when no results", () => {
    return request(app)
      .get("/api/listings?search=youwillnotfindanythinghere")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No listings found!");
      });
  });
});
