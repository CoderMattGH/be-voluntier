import request from "supertest";

import { app } from "../../app";
import { db } from "../../db";
import { seed } from "../../db/seeds/seed";
import { testData } from "../../db/data/test-data/";

beforeEach(() => seed(testData));

afterAll(() => db.end());

type OrgType = {
  type_id?: number;
  type_title: string;
};

describe("GET /api/org-types", () => {
  test("Returns an array of all types of charitable organisations", () => {
    return request(app)
      .get("/api/org-types")
      .expect(200)
      .then(({ body }) => {
        const orgTypes = body.orgTypes;

        expect(orgTypes.length).toBe(11);

        orgTypes.forEach((orgType: OrgType) => {
          expect(typeof orgType).toBe("string");
        });
      });
  });
});
