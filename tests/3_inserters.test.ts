import { describe, it } from "node:test";
import { equal } from "node:assert";

import { inMemoryDatabase } from "../database.js";
import {
  companyFixture,
  departmentFixture,
  employeeFixture,
  fixtureInserter,
} from "../inserters.js";
import { calculateAverageSalary } from "../salary_calculator.js";

describe("salary_calculator", () => {
  it("calculates the average salary of all employees", () => {
    const db = inMemoryDatabase();

    const insert = fixtureInserter(db);
    const google = insert(companyFixture({ name: "Google" }));
    insert(companyFixture({ name: "Microsoft" }));

    const rdDepartment = insert(
      departmentFixture({ name: "R&D", companyId: google.id })
    );

    insert(
      employeeFixture({
        salary: 100_000,
        departmentId: rdDepartment.id,
      })
    );
    insert(
      employeeFixture({
        salary: 200_000,
        departmentId: rdDepartment.id,
      })
    );

    const averageSalary = calculateAverageSalary(db);
    equal(averageSalary, 150_000);
  });
});
