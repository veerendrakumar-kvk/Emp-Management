
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee, PagedResponse } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  pagedResponse: PagedResponse<Employee> | null = null;
  loading = false;
  searchKeyword = '';
  currentPage = 0;
  pageSize = 10;
  sortBy = 'id';
  sortDirection = 'asc';
  Math = Math;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getEmployees(
      this.currentPage, 
      this.pageSize, 
      this.sortBy, 
      this.sortDirection, 
      this.searchKeyword
    ).subscribe({
      next: (response) => {
        this.pagedResponse = response;
        this.employees = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.loading = false;
      }
    });
  }

  search() {
    this.currentPage = 0;
    this.loadEmployees();
  }

  clearSearch() {
    this.searchKeyword = '';
    this.currentPage = 0;
    this.loadEmployees();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadEmployees();
  }

  changePageSize() {
    this.currentPage = 0;
    this.loadEmployees();
  }

  editEmployee(id: number) {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: number, name: string) {
    if (confirm(`Are you sure you want to delete employee "${name}"?`)) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          alert('Error deleting employee. Please try again.');
        }
      });
    }
  }

  navigateToAdd() {
    this.router.navigate(['/employees/add']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
