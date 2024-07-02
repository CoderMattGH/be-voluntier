import request from "supertest";

import { app } from "../../app";
import { db } from "../../db";
import { seed } from "../../db/seeds/seed";
import { testData } from "../../db/data/test-data/";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api", () => {
  test("Returns a valid endpoints object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        // Weakly matches the general pattern of a URL method followed by a path
        const pathPattern = /^(GET|POST|PATCH|DELETE) \/[.]*/;

        for (const [path, pathObj] of Object.entries(body)) {
          expect(pathPattern.test(path)).toBe(true);

          // Contains mandatory key of 'description'
          expect(pathObj).toMatchObject({
            description: expect.any(String),
          });

          // If optional 'queries' key exists, check it is an array
          if (body.queries) expect(Array.isArray(body.queries)).toBe(true);
        }
      });
  });
});
