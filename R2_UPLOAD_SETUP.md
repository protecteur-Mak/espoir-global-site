# Cloudflare R2 File Upload Setup

This guide explains how to set up file uploads to Cloudflare R2 using the provided hooks and components.

## Prerequisites

1. **Cloudflare R2 Account**: You need a Cloudflare account with R2 storage enabled
2. **AWS SDK**: Install the required AWS SDK packages for S3 compatibility

## Installation

### 1. Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://your-public-domain.com
```

### 3. Cloudflare R2 Setup

1. **Create R2 Bucket**:
   - Go to Cloudflare Dashboard → R2 Object Storage
   - Create a new bucket
   - Note down the bucket name

2. **Create API Token**:
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create a custom token with R2 permissions
   - Note down the Access Key ID and Secret Access Key

3. **Configure Public Access** (Optional):
   - In your R2 bucket settings, configure a custom domain for public access
   - This will be your `CLOUDFLARE_R2_PUBLIC_URL`

## Usage

### Basic Usage with Hook

```tsx
import { useR2Upload } from "@/hooks/use-r2-upload";

function MyComponent() {
  const { uploadFile, isUploading, progress } = useR2Upload({
    endpoint: "/api/upload",
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/*", "application/pdf"],
    onSuccess: (result) => {
      console.log("Upload successful:", result.url);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
    },
  });

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await uploadFile(file);
      console.log("Upload result:", result);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      {isUploading && progress && <div>Uploading: {progress.percentage}%</div>}
    </div>
  );
}
```

### Using the FileUpload Component

```tsx
import { FileUpload } from "@/components/ui/file-upload";

function MyComponent() {
  const handleUploadComplete = (results) => {
    console.log("Uploaded files:", results);
  };

  return (
    <FileUpload
      endpoint="/api/upload"
      maxFileSize={5 * 1024 * 1024} // 5MB
      allowedTypes={["image/*", "application/pdf"]}
      multiple={true}
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

## API Endpoints

### POST /api/upload

Uploads a file to R2 storage.

**Request**:

- `file`: The file to upload
- `fileName`: Optional custom filename

**Response**:

```json
{
  "success": true,
  "url": "https://your-domain.com/filename.jpg",
  "key": "filename.jpg",
  "size": 12345,
  "type": "image/jpeg"
}
```

### GET /api/upload

Generates a presigned URL for direct uploads.

**Query Parameters**:

- `fileName`: The filename for the upload
- `contentType`: The MIME type of the file

**Response**:

```json
{
  "success": true,
  "presignedUrl": "https://...",
  "fileName": "filename.jpg"
}
```

## Features

### Hook Features (`useR2Upload`)

- ✅ **File Validation**: Size and type validation
- ✅ **Progress Tracking**: Real-time upload progress
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **Multiple Files**: Support for uploading multiple files
- ✅ **Custom Callbacks**: Success, error, and progress callbacks
- ✅ **Unique Filenames**: Automatic unique filename generation

### Component Features (`FileUpload`)

- ✅ **Drag & Drop**: Drag and drop file upload
- ✅ **Visual Feedback**: Progress bars and status indicators
- ✅ **File Previews**: Image previews for uploaded files
- ✅ **File Management**: Remove uploaded files
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Accessibility**: Keyboard navigation and screen reader support

### Utility Functions

- `formatFileSize(bytes)`: Format bytes to human-readable size
- `getFileExtension(filename)`: Extract file extension
- `isImageFile(file)`: Check if file is an image
- `createImagePreview(file)`: Create preview URL for images

## Customization

### Custom File Validation

```tsx
const { uploadFile } = useR2Upload({
  endpoint: "/api/upload",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  onError: (error) => {
    // Custom error handling
    if (error.includes("size")) {
      alert("File is too large");
    } else if (error.includes("type")) {
      alert("File type not supported");
    }
  },
});
```

### Custom Upload Component

```tsx
function CustomUpload() {
  const { uploadFile, isUploading } = useR2Upload({
    endpoint: "/api/upload",
  });

  return (
    <div className="custom-upload">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />
      {isUploading && <div>Uploading...</div>}
    </div>
  );
}
```

## Security Considerations

1. **File Type Validation**: Always validate file types on both client and server
2. **File Size Limits**: Set appropriate file size limits
3. **Access Control**: Configure R2 bucket permissions appropriately
4. **Rate Limiting**: Implement rate limiting for upload endpoints
5. **Virus Scanning**: Consider implementing virus scanning for uploaded files

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your R2 bucket has proper CORS configuration
2. **Authentication Errors**: Verify your R2 credentials are correct
3. **File Size Errors**: Check that file size is within limits
4. **Network Errors**: Verify your API endpoint is accessible

### Debug Mode

Enable debug logging by adding console logs to the hook:

```tsx
const { uploadFile } = useR2Upload({
  endpoint: "/api/upload",
  onProgress: (progress) => {
    console.log("Upload progress:", progress);
  },
  onSuccess: (result) => {
    console.log("Upload success:", result);
  },
  onError: (error) => {
    console.error("Upload error:", error);
  },
});
```

## Performance Optimization

1. **Chunked Uploads**: For large files, consider implementing chunked uploads
2. **Image Compression**: Compress images before upload
3. **CDN Integration**: Use Cloudflare's CDN for faster file delivery
4. **Lazy Loading**: Implement lazy loading for file previews

## License

This code is provided as-is for educational and development purposes.
