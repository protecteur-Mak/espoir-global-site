"use client";

import { useState, useCallback } from "react";

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

interface UseR2UploadOptions {
  endpoint: string;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
}

interface UseR2UploadReturn {
  uploadFile: (file: File) => Promise<UploadResult>;
  uploadMultipleFiles: (files: File[]) => Promise<UploadResult[]>;
  isUploading: boolean;
  progress: UploadProgress | null;
  resetProgress: () => void;
}

export function useR2Upload({
  endpoint,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedTypes = ["image/*", "application/pdf", "text/*"],
  onProgress,
  onSuccess,
  onError,
}: UseR2UploadOptions): UseR2UploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  // Validate file before upload
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxFileSize) {
        return `File size exceeds maximum allowed size of ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`;
      }

      // Check file type
      const isValidType = allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
          const baseType = type.replace("/*", "");
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`;
      }

      return null;
    },
    [maxFileSize, allowedTypes]
  );

  // Generate unique filename
  const generateFileName = useCallback((file: File): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    return `${timestamp}-${randomString}.${extension}`;
  }, []);

  // Upload single file
  const uploadFile = useCallback(
    async (file: File): Promise<UploadResult> => {
      try {
        setIsUploading(true);
        setProgress({ loaded: 0, total: file.size, percentage: 0 });

        // Validate file
        const validationError = validateFile(file);
        if (validationError) {
          const error = `Validation failed: ${validationError}`;
          onError?.(error);
          return { success: false, error };
        }

        // Generate unique filename
        const fileName = generateFileName(file);

        // Create FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);

        // Upload to R2 via your API endpoint
        const xhr = new XMLHttpRequest();

        return new Promise((resolve) => {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const progressData = {
                loaded: event.loaded,
                total: event.total,
                percentage: Math.round((event.loaded / event.total) * 100),
              };
              setProgress(progressData);
              onProgress?.(progressData);
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              try {
                const response = JSON.parse(xhr.responseText);
                const result: UploadResult = {
                  success: true,
                  url: response.url,
                  key: response.key,
                };
                onSuccess?.(result);
                resolve(result);
              } catch (error) {
                const errorMsg = "Failed to parse upload response";
                onError?.(errorMsg);
                resolve({ success: false, error: errorMsg });
              }
            } else {
              const errorMsg = `Upload failed with status ${xhr.status}: ${xhr.statusText}`;
              onError?.(errorMsg);
              resolve({ success: false, error: errorMsg });
            }
          });

          xhr.addEventListener("error", () => {
            const errorMsg = "Network error during upload";
            onError?.(errorMsg);
            resolve({ success: false, error: errorMsg });
          });

          xhr.addEventListener("abort", () => {
            const errorMsg = "Upload was aborted";
            onError?.(errorMsg);
            resolve({ success: false, error: errorMsg });
          });

          xhr.open("POST", endpoint);
          xhr.send(formData);
        });
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown upload error";
        onError?.(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsUploading(false);
      }
    },
    [endpoint, validateFile, generateFileName, onProgress, onSuccess, onError]
  );

  // Upload multiple files
  const uploadMultipleFiles = useCallback(
    async (files: File[]): Promise<UploadResult[]> => {
      const results: UploadResult[] = [];

      for (const file of files) {
        const result = await uploadFile(file);
        results.push(result);

        // If any upload fails, you might want to stop or continue based on your requirements
        if (!result.success) {
          // You can choose to continue or break here
          // break;
        }
      }

      return results;
    },
    [uploadFile]
  );

  // Reset progress
  const resetProgress = useCallback(() => {
    setProgress(null);
  }, []);

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    progress,
    resetProgress,
  };
}

// Hook for drag and drop functionality
export function useFileDrop(onFilesSelected: (files: File[]) => void) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  return {
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}

// Utility function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Utility function to get file extension
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

// Utility function to check if file is an image
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

// Utility function to create preview URL for images
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}
