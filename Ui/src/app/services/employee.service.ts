import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  Employee,
  PagedResponse,
  DashboardStats,
} from "../models/employee.model";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getEmployees(
    page: number = 0,
    size: number = 10,
    sortBy: string = "id",
    sortDir: string = "asc",
    keyword?: string
  ): Observable<PagedResponse<Employee>> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("size", size.toString())
      .set("sortBy", sortBy)
      .set("sortDir", sortDir);

    if (keyword && keyword.trim()) {
      params = params.set("keyword", keyword.trim());
    }

    return this.http.get<PagedResponse<Employee>>(
      `${environment.apiUrl}/employees`,
      { params }
    );
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${environment.apiUrl}/employees/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(
      `${environment.apiUrl}/employees`,
      employee
    );
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(
      `${environment.apiUrl}/employees/${id}`,
      employee
    );
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/employees/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(
      `${environment.apiUrl}/employees/dashboard/stats`
    );
  }
}
