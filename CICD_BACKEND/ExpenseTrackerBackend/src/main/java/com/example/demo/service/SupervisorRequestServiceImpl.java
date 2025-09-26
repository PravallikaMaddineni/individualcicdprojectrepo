package com.example.demo.service;

import com.example.demo.model.SupervisorRequest;
import com.example.demo.repository.SupervisorRequestRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.SupervisorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupervisorRequestServiceImpl implements SupervisorRequestService {

    private final SupervisorRequestRepository repo;
    private final UserRepository userRepo;
    private final SupervisorRepository supervisorRepo;

    public SupervisorRequestServiceImpl(
            SupervisorRequestRepository repo,
            UserRepository userRepo,
            SupervisorRepository supervisorRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.supervisorRepo = supervisorRepo;
    }

    @Override
    public SupervisorRequest sendRequest(SupervisorRequest request) {
        // Fetch existing entities from DB to avoid transient error
        var user = userRepo.findById(request.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        var supervisor = supervisorRepo.findById(request.getSupervisor().getId())
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        request.setUser(user);
        request.setSupervisor(supervisor);
        request.setStatus("PENDING");
        return repo.save(request);
    }

    @Override
    public List<SupervisorRequest> getRequestsByUser(int userId) {
        return repo.findByUser_Id(userId);
    }

    @Override
    public List<SupervisorRequest> getRequestsBySupervisor(int supervisorId) {
        return repo.findBySupervisor_Id(supervisorId);
    }

    @Override
    public SupervisorRequest updateStatus(int requestId, String status) {
        var req = repo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus(status);
        return repo.save(req);
    }
}
