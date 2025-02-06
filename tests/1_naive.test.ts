import { describe, it } from "node:test";
import { equal } from "node:assert";

import { inMemoryDatabase } from "../database.js";
import { calculateAverageSalary } from "../salary_calculator.js";

describe("salary_calculator", () => {
  it("calculates the average salary of all employees", () => {
    const db = inMemoryDatabase();

    const google = db.table("companies").insert({
      name: "Google",
      address: "123 Example St",
      phoneNumber: "555-555-5555",
    });
    const rdDepartment = db.table("departments").insert({
      name: "R&D",
      companyId: google.id,
    });
    db.table("employees").insert({
      firstName: "John",
      lastName: "Doe",
      title: "Software Engineer",
      salary: 100_000,
      departmentId: rdDepartment.id,
    });
    db.table("employees").insert({
      firstName: "Jane",
      lastName: "Doe",
      title: "Senior Software Engineer",
      salary: 200_000,
      departmentId: rdDepartment.id,
    });

    const averageSalary = calculateAverageSalary(db);
    equal(averageSalary, 150_000);
  });
});
