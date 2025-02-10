import { describe, it } from "node:test";
import { equal } from "node:assert";

import { employeeFixture } from "../bidirectional_fixtures.js";
import { inMemoryDatabase } from "../database.js";
import { fixtureInserter } from "../inserters.js";
import { calculateAverageSalary } from "../salary_calculator.js";

describe("salary_calculator", () => {
  it("calculates the average salary of all employees", () => {
    const db = inMemoryDatabase();

    const insert = fixtureInserter(db);
    const {
      department: { company },
    } = insert(employeeFixture({ salary: 100_000 }));
    insert(
      employeeFixture({
        salary: 200_000,
        department: {
          name: "R&D",
          company,
        },
      })
    );

    const averageSalary = calculateAverageSalary(db);
    equal(averageSalary, 150_000);
  });
});
