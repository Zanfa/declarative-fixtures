import { buildCompany, buildDepartment, buildEmployee } from "./builders.js";
import { Database } from "./database.js";

export function fixtureInserter(db: Database) {
  return <F>(inserter: (db: Database) => F) => inserter(db);
}

function fixturize<P extends ReadonlyArray<unknown>, F>(
  table: string,
  builder: (...props: P) => F
) {
  return (...props: P) =>
    (db: Database) =>
      db.table(table).insert(builder(...props));
}

export const companyFixture = fixturize("companies", buildCompany);
export const departmentFixture = fixturize("departments", buildDepartment);
export const employeeFixture = fixturize("employees", buildEmployee);
