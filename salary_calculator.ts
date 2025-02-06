import { Database } from "./database.js";
import { Employee } from "./types.js";

export function calculateAverageSalary(db: Database) {
  const employees = db.tables["employees"];
  const totalSalary = employees.reduce(
    (sum: number, employee: Employee) => sum + employee.salary,
    0
  );
  return totalSalary / employees.length;
}
