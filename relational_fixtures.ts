import { buildCompany, buildDepartment, buildEmployee } from "./builders.js";
import { Database } from "./database.js";
import { Company, Department, Employee } from "./types.js";

type CompanyFixtureProps = Parameters<typeof buildCompany>[0] & {
  departments?: Omit<DepartmentFixtureProps, "companyId">[];
};

export function companyFixture(props?: CompanyFixtureProps) {
  return (db: Database): Company => {
    const { departments: departmentProps = [], ...companyProps } = props ?? {};

    const company = db.table("companies").insert(buildCompany(companyProps));

    departmentProps.map((department) =>
      departmentFixture({ ...department, companyId: company.id })(db)
    );

    return company;
  };
}

type DepartmentFixtureProps = Parameters<typeof buildDepartment>[0] & {
  employees?: Omit<EmployeeFixtureProps, "departmentId">[];
};

export function departmentFixture(props: DepartmentFixtureProps) {
  return (db: Database): Department => {
    const { employees: employeeProps = [], ...departmentProps } = props;

    const department = db
      .table("departments")
      .insert(buildDepartment(departmentProps));

    const employees = employeeProps.map((employee) =>
      employeeFixture({ ...employee, departmentId: department.id })(db)
    );

    return department;
  };
}

type EmployeeFixtureProps = Parameters<typeof buildEmployee>[0];

export function employeeFixture(props: EmployeeFixtureProps) {
  return (db: Database): Employee =>
    db.table("employees").insert(buildEmployee(props));
}
