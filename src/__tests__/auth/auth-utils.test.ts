import authUtils from "../../auth/auth-utils";
const {hashPassword, checkPassword} = authUtils;

describe("hashPassword()", () => {
  test("Hashes an empty string", () => {
    const actual: string = hashPassword("");

    console.log(actual);

    expect(actual).toBe("");
  });
});