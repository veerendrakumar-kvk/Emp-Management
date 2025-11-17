
package com.example.employeems.service;

import com.example.employeems.model.Employee;
import com.example.employeems.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
    
    public Page<Employee> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }
    
    public Page<Employee> searchEmployees(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return employeeRepository.findAll(pageable);
        }
        return employeeRepository.findByKeyword(keyword.trim(), pageable);
    }
    
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }
    
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }
    
    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        
        employee.setName(employeeDetails.getName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setPosition(employeeDetails.getPosition());
        employee.setSalary(employeeDetails.getSalary());
        employee.setHireDate(employeeDetails.getHireDate());
        
        return employeeRepository.save(employee);
    }
    
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }
    
    public Map<String, Object> getDashboardStats() {
        List<Employee> allEmployees = employeeRepository.findAll();
        
        long totalEmployees = allEmployees.size();
        
        Map<String, Long> departmentCounts = allEmployees.stream()
                .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));
        
        double averageSalary = allEmployees.stream()
                .mapToDouble(Employee::getSalary)
                .average()
                .orElse(0.0);
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalEmployees", totalEmployees);
        result.put("departmentCounts", departmentCounts);
        result.put("averageSalary", averageSalary);
        
        return result;
    }
}
