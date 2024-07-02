import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";

beforeEach(() => seed(testData));

afterAll(() => db.end());

type Skill = {
  skill_id?: number;
  skill_name: string;
};

describe("GET /api/skills", () => {
  test("Returns all skills", () => {
    return request(app)
      .get("/api/skills")
      .expect(200)
      .then(({ body }) => {
        const skills = body.skills;

        expect(skills.length).toBe(16);

        skills.forEach((skill: Skill) => {
          expect(typeof skill).toBe("string");
        });
      });
  });
});
