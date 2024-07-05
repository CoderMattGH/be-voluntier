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

describe("GET /api/skills/:list_id", () => {
  test("Returns all skills for a listing id", () => {
    return request(app)
      .get("/api/skills/6")
      .expect(200)
      .then(({ body }) => {
        const skills = body.skills;

        expect(skills.length).toBe(2);

        skills.forEach((skill: Skill) => {
          expect(skill).toMatchObject({
            skill_id: expect.any(Number),
            skill_name: expect.any(String),
          });
        });
      });
  });

  test("Returns 404 when no skills found", () => {
    return request(app)
      .get("/api/skills/99")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No skills found!");
      });
  });

  test("Returns a 400 when list_id is not a number", () => {
    return request(app)
      .get("/api/skills/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("list_id is not a number!");
      });
  });
});
