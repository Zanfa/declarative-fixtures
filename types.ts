export type Company = {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
};

export type Department = {
  id: number;
  name: string;

  companyId: number;
};

export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  salary: number;

  departmentId: number;
};
