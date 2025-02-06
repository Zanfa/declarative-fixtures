import { describe, it } from "node:test";
import { equal } from "node:assert";

import { inMemoryDatabase } from "../database.js";
import { buildCompany, buildDepartment, buildEmployee } from "../builders.js";
import { calculateAverageSalary } from "../salary_calculator.js";

describe("salary_calculator", () => {
  it("calculates the average salary of all employees", () => {
    const db = inMemoryDatabase();
    const google = db.table("companies").insert(
      buildCompany({
        name: "Google",
      })
    );

    const rdDepartment = db
      .table("departments")
      .insert(buildDepartment({ name: "R&D", companyId: google.id }));

    db.table("employees").insert(
      buildEmployee({
        salary: 100_000,
        departmentId: rdDepartment.id,
      })
    );

    db.table("employees").insert(
      buildEmployee({
        salary: 200_000,
        departmentId: rdDepartment.id,
      })
    );

    const averageSalary = calculateAverageSalary(db);
    equal(averageSalary, 150_000);
  });
});
