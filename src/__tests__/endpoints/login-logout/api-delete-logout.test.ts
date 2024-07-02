import request from "supertest";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("DELETE /api/logout", () => {
  test("Logouts the user successfully", () => {
    const volCredentials = {
      email: "mattydemail@email.com",
      password: "mybadpassword",
      role: "volunteer",
    };

    return request(app)
      .post("/api/login")
      .send(volCredentials)
      .then((response) => {
        // Get cookie
        const { header } = response;

        // Make logout request
        return request(app)
          .delete("/api/logout")
          .set("Cookie", [...header["set-cookie"]])
          .send({})
          .expect(200);
      });
  });

  test("Error when logout is called when user is not logged in", () => {
    return request(app)
      .delete("/api/logout")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("User not logged in!");
      });
  });
});
