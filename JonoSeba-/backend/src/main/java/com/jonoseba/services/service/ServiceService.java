package com.jonoseba.services.service;

import com.jonoseba.common.exception.ResourceNotFoundException;
import com.jonoseba.services.dto.ServiceRequest;
import com.jonoseba.services.dto.ServiceResponse;
import com.jonoseba.services.model.Service;
import com.jonoseba.services.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    @Transactional(readOnly = true)
    public List<ServiceResponse> getActiveServices() {
        return serviceRepository.findByActiveTrue()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ServiceResponse createService(ServiceRequest request) {
        Service serviceEntity = Service.builder()
                .name(request.getName())
                .description(request.getDescription())
                .requiredDocsJson(request.getRequiredDocs())
                .active(request.getActive() == null ? Boolean.TRUE : request.getActive())
                .build();

        Service saved = serviceRepository.save(serviceEntity);
        return toResponse(saved);
    }

    @Transactional
    public ServiceResponse updateService(Long id, ServiceRequest request) {
        Service serviceEntity = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));

        serviceEntity.setName(request.getName());
        serviceEntity.setDescription(request.getDescription());
        serviceEntity.setRequiredDocsJson(request.getRequiredDocs());
        if (request.getActive() != null) {
            serviceEntity.setActive(request.getActive());
        }

        Service updated = serviceRepository.save(serviceEntity);
        return toResponse(updated);
    }

    @Transactional
    public void softDeleteService(Long id) {
        Service serviceEntity = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        serviceEntity.setActive(false);
        serviceRepository.save(serviceEntity);
    }

    private ServiceResponse toResponse(Service serviceEntity) {
        return ServiceResponse.builder()
                .id(serviceEntity.getId())
                .name(serviceEntity.getName())
                .description(serviceEntity.getDescription())
                .requiredDocs(serviceEntity.getRequiredDocsJson())
                .active(serviceEntity.getActive())
                .build();
    }
}
