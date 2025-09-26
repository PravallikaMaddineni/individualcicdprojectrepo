package com.example.demo.controller;

import com.example.demo.model.Expense;
import com.example.demo.model.SupervisorRequest;
import com.example.demo.service.ExpenseService;
import com.example.demo.service.SupervisorRequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
@CrossOrigin("*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/add")
    public String addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    @PutMapping("/update")
    public String updateExpense(@RequestBody Expense expense) {
        return expenseService.updateExpense(expense);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteExpense(@PathVariable int id) {
        return expenseService.deleteExpense(id);
    }

    @GetMapping("/{id}")
    public Expense getExpenseById(@PathVariable int id) {
        return expenseService.getExpenseById(id);
    }

    @GetMapping("/all")
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @GetMapping("/user/{userId}")
    public List<Expense> getExpensesByUser(@PathVariable int userId) {
        return expenseService.getExpensesByUser(userId);
    }
    
    
    @Autowired
    private SupervisorRequestService supervisorRequestService;

    @GetMapping("/approved/supervisor/{supervisorId}")
    public List<Expense> getApprovedExpensesBySupervisor(@PathVariable int supervisorId) {
        // 1. Get all approved requests for this supervisor
        List<SupervisorRequest> approvedRequests = supervisorRequestService
                .getRequestsBySupervisor(supervisorId)
                .stream()
                .filter(req -> "Approved".equalsIgnoreCase(req.getStatus()))
                .toList();

        // 2. Get user IDs from approved requests
        List<Integer> approvedUserIds = approvedRequests.stream()
                .map(req -> req.getUser().getId())
                .toList();

        // 3. Get all expenses and filter by approved user IDs
        List<Expense> allExpenses = expenseService.getAllExpenses();
        List<Expense> approvedExpenses = allExpenses.stream()
                .filter(exp -> approvedUserIds.contains(exp.getUser().getId()))
                .toList();

        return approvedExpenses;
    }

}
