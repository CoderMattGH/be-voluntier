import request from "supertest";
import "jest-sorted";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";

beforeEach(() => seed(testData));

afterAll(() => db.end());

type leaderboardEntry = {
  vol_first_name: string;
  vol_last_name: string;
  vol_avatar_img_id: null;
  points: string;
};

describe("GET /api/leaderboard", () => {
  test("Returns all entries of the leaderboard, with each object of correct shape", () => {
    return request(app)
      .get("/api/leaderboard")
      .expect(200)
      .then(({ body }) => {
        const leaderboard = body.leaderboard;

        expect(leaderboard.length).toBe(10);

        leaderboard.forEach((leaderboardEntry: leaderboardEntry) => {
          expect(leaderboardEntry).toMatchObject({
            vol_first_name: expect.any(String),
            vol_last_name: expect.any(String),
            points: expect.any(String),
          });

          expect(leaderboardEntry.vol_avatar_img_id).toBeDefined();
        });
      });
  });
  test("Returns the leaderboard in descending order of badge points for users", () => {
    return request(app)
      .get("/api/leaderboard")
      .expect(200)
      .then(({ body }) => {
        const leaderboard = body.leaderboard.map((entry: leaderboardEntry) => ({
          ...entry,
          points: parseInt(entry.points, 10),
        }));

        expect(leaderboard).toHaveLength(10);
        expect(leaderboard).toBeSorted({ key: "points", descending: true });
      });
  });
});
