
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  loading = false;
  error = '';
  success = '';

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', [Validators.required, Validators.minLength(2)]],
      salary: ['', [Validators.required, Validators.min(0)]],
      hireDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = +params['id'];
        this.loadEmployee();
      }
    });
  }

  loadEmployee() {
    if (this.employeeId) {
      this.loading = true;
      this.employeeService.getEmployee(this.employeeId).subscribe({
        next: (employee) => {
          this.employeeForm.patchValue({
            name: employee.name,
            email: employee.email,
            department: employee.department,
            position: employee.position,
            salary: employee.salary,
            hireDate: employee.hireDate
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading employee:', error);
          this.error = 'Error loading employee data.';
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const employeeData: Employee = this.employeeForm.value;

    const operation = this.isEditMode 
      ? this.employeeService.updateEmployee(this.employeeId!, employeeData)
      : this.employeeService.createEmployee(employeeData);

    operation.subscribe({
      next: (response) => {
        this.success = this.isEditMode 
          ? 'Employee updated successfully!' 
          : 'Employee added successfully!';
        this.loading = false;
        
        setTimeout(() => {
          this.navigateToList();
        }, 1500);
      },
      error: (error) => {
        console.error('Error saving employee:', error);
        this.error = 'Error saving employee. Please try again.';
        this.loading = false;
      }
    });
  }

  markFormGroupTouched() {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  navigateToList() {
    this.router.navigate(['/employees']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
