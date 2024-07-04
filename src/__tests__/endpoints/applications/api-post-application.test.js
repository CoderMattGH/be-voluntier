import request from "supertest";
import "jest-extended";

import { app } from "../../../app";
import { db } from "../../../db";
import { seed } from "../../../db/seeds/seed";
import { testData } from "../../../db/data/test-data/";
import * as constants from "../../../constants";

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("POST /api/applications/", () => {});
