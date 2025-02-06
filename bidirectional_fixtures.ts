import { buildCompany, buildDepartment, buildEmployee } from "./builders.js";
import { Database } from "./database.js";
import { Company, Department, Employee } from "./types.js";

type Row = { id: number };
function exists<T extends object>(row?: T | Row): row is Row {
  return row !== undefined && "id" in row;
}

type OmitDependencies<
  F extends (...args: any) => any,
  K extends keyof Parameters<F>[0] = never
> = Omit<Parameters<F>[0], K>;

type CompanyFixtureProps = OmitDependencies<typeof buildCompany> & {
  departments?: Omit<DepartmentFixtureProps, "companyId">[];
};

type CompanyFixture = Company & {
  departments: DepartmentFixture[];
};

export function companyFixture(props?: CompanyFixtureProps | Company) {
  return (db: Database): CompanyFixture => {
    if (exists(props)) {
      return props as CompanyFixture;
    }

    const { departments: departmentProps = [], ...companyProps } = props ?? {};

    const company = db.table("companies").insert(buildCompany(companyProps));

    const departments = departmentProps.map((department) =>
      departmentFixture({ ...department, company })(db)
    );

    return { ...company, departments };
  };
}

type DepartmentFixtureProps = OmitDependencies<
  typeof buildDepartment,
  "companyId"
> & {
  employees?: Omit<EmployeeFixtureProps, "departmentId">[];
  company?: CompanyFixtureProps | Company;
};

type DepartmentFixture = Department & {
  employees: EmployeeFixture[];
  company: CompanyFixture;
};

export function departmentFixture(props?: DepartmentFixtureProps | Department) {
  return (db: Database): DepartmentFixture => {
    if (exists(props)) {
      return props as DepartmentFixture;
    }

    const {
      employees: employeeProps = [],
      company: companyProps = {},
      ...departmentProps
    } = props ?? {};

    const company = companyFixture(companyProps)(db);

    const department = db
      .table("departments")
      .insert(buildDepartment({ ...departmentProps, companyId: company.id }));

    const employees = employeeProps.map((employee) =>
      employeeFixture({ ...employee, department })(db)
    );

    return { ...department, employees, company };
  };
}

type EmployeeFixtureProps = OmitDependencies<
  typeof buildEmployee,
  "departmentId"
> & {
  department?: DepartmentFixtureProps | Department;
};
type EmployeeFixture = Employee & {
  department: DepartmentFixture;
};

export function employeeFixture(props?: EmployeeFixtureProps | Employee) {
  return (db: Database): EmployeeFixture => {
    if (exists(props)) {
      return props as EmployeeFixture;
    }

    const { department: departmentProps = {}, ...employeeProps } = props ?? {};

    const department = departmentFixture(departmentProps)(db);
    const employee = db
      .table("employees")
      .insert(buildEmployee({ ...employeeProps, departmentId: department.id }));

    return {
      ...employee,
      department,
    };
  };
}
