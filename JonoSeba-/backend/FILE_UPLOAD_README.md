# File Upload Feature Documentation

## Overview
This feature provides file upload support for the JonoSeba application, allowing users to upload images (JPG/PNG) and PDF documents that can be attached to Applications and Complaints.

## Features
- ✅ Secure file upload with authentication
- ✅ UUID-based unique filename generation
- ✅ File validation (size, type, MIME type)
- ✅ Support for images (JPG, JPEG, PNG) and PDFs
- ✅ Configurable file size limits (default: 10MB)
- ✅ Automatic directory creation
- ✅ Static file serving for uploaded content

## Configuration

### application.yml
Multipart upload configuration has been added to `application.yml`:

```yaml
spring:
  servlet:
    multipart:
      max-file-size: ${MAX_FILE_SIZE:10MB}
      max-request-size: ${MAX_REQUEST_SIZE:10MB}
```

You can adjust these values via environment variables or modify them in the config file.

## API Endpoint

### Upload File
**POST** `/api/files/upload` (Authenticated)

**Request:**
- Content-Type: `multipart/form-data`
- Parameter: `file` (MultipartFile)

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "/uploads/550e8400-e29b-41d4-a716-446655440000.jpg",
    "filename": "document.jpg"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "File type not allowed. Allowed types: jpg, jpeg, png, pdf",
  "data": null
}
```

## Allowed File Types
- **Images:** JPG, JPEG, PNG
- **Documents:** PDF

## Maximum File Size
Default: 10MB per file
Configure via `MAX_FILE_SIZE` environment variable

## File Storage
- **Directory:** `./uploads/` (relative to application root)
- **Filename Format:** `{UUID}.{extension}` (e.g., `550e8400-e29b-41d4-a716-446655440000.jpg`)
- **Access:** Files are served at `/uploads/{filename}`

## Integration with Entities

### Application Entity
Applications can store document URLs as a JSON array:

```java
// Example: Store single document
String documentUrl = "/uploads/550e8400-e29b-41d4-a716-446655440000.pdf";
application.setDocumentUrls("[\"" + documentUrl + "\"]");

// Example: Store multiple documents
String documentUrls = "[\"" + url1 + "\", \"" + url2 + "\"]";
application.setDocumentUrls(documentUrls);
```

**DTO Support:**
- `ApplicationCreateRequest.documentUrls` - Optional field for initial upload
- `ApplicationResponse.documentUrls` - Returns stored document URLs

### Complaint Entity
Complaints can store a single photo URL:

```java
complaint.setPhotoUrl("/uploads/550e8400-e29b-41d4-a716-446655440000.jpg");
```

**DTO Support:**
- `ComplaintCreateRequest.photoUrl` - Optional field for photo URL
- `ComplaintResponse.photoUrl` - Returns stored photo URL

## Usage Examples

### Frontend (JavaScript/TypeScript)

**Upload a file:**
```javascript
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: formData
  });

  const result = await response.json();
  if (result.success) {
    return result.data.url; // "/uploads/..."
  }
};
```

**Attach to Application:**
```javascript
const createApplication = async (title, description, files) => {
  let documentUrls = null;
  
  if (files && files.length > 0) {
    const urls = [];
    for (const file of files) {
      const url = await uploadFile(file);
      urls.push(url);
    }
    documentUrls = JSON.stringify(urls);
  }

  const response = await fetch('/api/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      serviceId: 1,
      title,
      description,
      documentUrls
    })
  });
};
```

**Attach to Complaint:**
```javascript
const createComplaint = async (category, description, location, photoFile) => {
  let photoUrl = null;
  
  if (photoFile) {
    photoUrl = await uploadFile(photoFile);
  }

  const response = await fetch('/api/complaints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_JWT_TOKEN'
    },
    body: JSON.stringify({
      category,
      description,
      locationText: location,
      photoUrl
    })
  });
};
```

### Backend (Java)

**Using DocumentUrlHelper:**
```java
import com.jonoseba.files.util.DocumentUrlHelper;

// Convert list to JSON
List<String> urls = Arrays.asList("/uploads/file1.pdf", "/uploads/file2.jpg");
String jsonString = DocumentUrlHelper.toJsonString(urls);
application.setDocumentUrls(jsonString);

// Convert JSON to list
List<String> urls = DocumentUrlHelper.fromJsonString(application.getDocumentUrls());

// Add URL to existing
String updated = DocumentUrlHelper.addUrl(application.getDocumentUrls(), "/uploads/file3.pdf");
application.setDocumentUrls(updated);

// Remove URL from existing
String updated = DocumentUrlHelper.removeUrl(application.getDocumentUrls(), "/uploads/file3.pdf");
application.setDocumentUrls(updated);
```

## File Structure
```
backend/src/main/java/com/jonoseba/files/
├── controller/
│   └── FileController.java          # Upload endpoint
├── service/
│   └── FileStorageService.java      # File storage logic
├── dto/
│   └── FileUploadResponse.java      # Response DTO
└── util/
    └── DocumentUrlHelper.java       # JSON handling utility
```

## Security Considerations

1. **Authentication:** All file upload endpoints require authentication (`@PreAuthorize("isAuthenticated()")`)
2. **File Validation:** 
   - File size limit: 10MB (configurable)
   - Allowed extensions: jpg, jpeg, png, pdf
   - MIME type validation
3. **Filename Safety:** UUID-based naming prevents path traversal attacks
4. **Access Control:** Files are stored outside the web root and served via Spring's resource handler

## Error Handling

| Status | Error Message |
|--------|---------------|
| 400 | File is empty |
| 400 | File size exceeds maximum allowed size of 10MB |
| 400 | Invalid file format |
| 400 | File type not allowed |
| 400 | Invalid file MIME type |
| 500 | Failed to upload file |

## Troubleshooting

**Permission Denied Error:**
- Ensure the application has write permissions to the `./uploads` directory
- On Linux/Mac: `chmod 755 ./uploads`

**File Not Found (404):**
- Check if the file was successfully uploaded (check response URL)
- Verify `WebMvcConfig` is properly configured for static file serving
- Check if file exists in `./uploads` directory

**Upload Size Exceeded:**
- Increase `MAX_FILE_SIZE` in environment variables
- Note: Cannot exceed `max-request-size` setting

## Future Enhancements
- [ ] Image thumbnail generation
- [ ] Virus/malware scanning
- [ ] S3/Cloud storage integration
- [ ] File versioning/history
- [ ] Batch upload support
