import { describe, it } from "node:test";
import { equal } from "node:assert";

import { inMemoryDatabase } from "../database.js";
import { fixtureInserter } from "../inserters.js";
import { companyFixture } from "../relational_fixtures.js";
import { calculateAverageSalary } from "../salary_calculator.js";

describe("salary_calculator", () => {
  it("calculates the average salary of all employees", () => {
    const db = inMemoryDatabase();

    const insert = fixtureInserter(db);
    insert(
      companyFixture({
        departments: [
          {
            employees: [
              {
                salary: 100_000,
              },
              {
                salary: 200_000,
              },
            ],
          },
        ],
      })
    );

    const averageSalary = calculateAverageSalary(db);
    equal(averageSalary, 150_000);
  });
});
