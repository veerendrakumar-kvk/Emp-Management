
export interface Employee {
  id?: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface DashboardStats {
  totalEmployees: number;
  departmentCounts: { [key: string]: number };
  averageSalary: number;
}
