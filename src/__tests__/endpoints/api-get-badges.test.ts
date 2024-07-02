import request from "supertest";

import { app } from "../../app";
import { db } from "../../db";
import { seed } from "../../db/seeds/seed";
import { testData } from "../../db/data/test-data/";

beforeEach(() => seed(testData));

afterAll(() => db.end());

type Badge = {
  badge_id?: number;
  badge_name: string;
  badge_img_path: string;
  badge_points: number;
};

describe("GET /api/badges", () => {
  test("Returns all badges", () => {
    return request(app)
      .get("/api/badges")
      .expect(200)
      .then(({ body }) => {
        const badges = body.badges;

        expect(badges.length).toBe(18);

        badges.forEach((badge: Badge) => {
          expect(badge).toMatchObject({
            badge_id: expect.any(Number),
            badge_name: expect.any(String),
            badge_img_path: expect.any(String),
            badge_points: expect.any(Number),
          });
        });
      });
  });
});
