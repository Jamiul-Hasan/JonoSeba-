package com.jonoseba.users.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @Size(min = 11, max = 14, message = "Phone must be between 11 and 14 characters")
    private String phone;
    
    @Size(max = 500, message = "Address must be at most 500 characters")
    private String address;
}
