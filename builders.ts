import { Company, Department, Employee } from "./types.js";

export type IdLess<T> = Omit<T, "id">;

export function builder<T, K extends keyof T = never>(
  defaults: Omit<IdLess<T>, K>
): (overrides: Partial<IdLess<T>> & Pick<T, K>) => IdLess<T> {
  return (overrides) =>
    ({
      ...defaults,
      ...overrides,
    } as IdLess<T>);
}

export const buildCompany = builder<Company>({
  name: "Example Company",
  address: "123 Example St",
  phoneNumber: "555-555-5555",
});

export const buildDepartment = builder<Department, "companyId">({
  name: "Example Department",
});

export const buildEmployee = builder<Employee, "departmentId">({
  firstName: "John",
  lastName: "Doe",
  title: "Software Engineer",
  salary: 75_000,
});
