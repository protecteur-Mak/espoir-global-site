"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, Upload, File, Image, FileText } from "lucide-react";
import {
  useR2Upload,
  useFileDrop,
  formatFileSize,
  isImageFile,
  createImagePreview,
} from "@/hooks/use-r2-upload";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  endpoint?: string;
  maxFileSize?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  onUploadComplete?: (results: any[]) => void;
  className?: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  result?: any;
  error?: string;
}

export function FileUpload({
  endpoint = "/api/upload",
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ["image/*", "application/pdf", "text/*"],
  multiple = false,
  onUploadComplete,
  className = "",
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    progress,
    resetProgress,
  } = useR2Upload({
    endpoint,
    maxFileSize,
    allowedTypes,
    onProgress: (progressData) => {
      // Update progress for the current file
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.status === "uploading"
            ? { ...file, progress: progressData.percentage }
            : file
        )
      );
    },
    onSuccess: (result) => {
      // Update file status to success
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.status === "uploading"
            ? { ...file, status: "success" as const, result }
            : file
        )
      );
      toast({
        title: "Upload successful",
        description: "File uploaded successfully",
      });
    },
    onError: (error) => {
      // Update file status to error
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.status === "uploading"
            ? { ...file, status: "error" as const, error }
            : file
        )
      );
      toast({
        title: "Upload failed",
        description: error,
        variant: "destructive",
      });
    },
  });

  const handleFilesSelected = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: isImageFile(file) ? createImagePreview(file) : undefined,
      progress: 0,
      status: "pending" as const,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Upload files
    for (const newFile of newFiles) {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === newFile.id
            ? { ...file, status: "uploading" as const }
            : file
        )
      );

      const result = await uploadFile(newFile.file);

      if (result.success) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === newFile.id
              ? { ...file, status: "success" as const, result }
              : file
          )
        );
      } else {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === newFile.id
              ? { ...file, status: "error" as const, error: result.error }
              : file
          )
        );
      }
    }

    // Call completion callback
    const successfulUploads = newFiles.filter(
      (file) =>
        uploadedFiles.find((uf) => uf.id === file.id)?.status === "success"
    );
    if (onUploadComplete && successfulUploads.length > 0) {
      onUploadComplete(successfulUploads.map((file) => file.result));
    }
  };

  const { isDragOver, handleDragOver, handleDragLeave, handleDrop } =
    useFileDrop(handleFilesSelected);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFilesSelected(files);
    }
    // Reset input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const getFileIcon = (file: File) => {
    if (isImageFile(file)) {
      return <Image className="w-4 h-4" />;
    }
    if (file.type.includes("pdf")) {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const getStatusColor = (status: UploadedFile["status"]) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "uploading":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isDragOver ? "Drop files here" : "Upload files"}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop files here, or click to select files
          </p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Max file size: {formatFileSize(maxFileSize)}</p>
            <p>Allowed types: {allowedTypes.join(", ")}</p>
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Select Files"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={allowedTypes.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && progress && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-sm text-gray-500">
                {progress.percentage}%
              </span>
            </div>
            <Progress value={progress.percentage} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <Card key={file.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        {getFileIcon(file.file)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.file.size)}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`text-xs ${getStatusColor(file.status)}`}
                        >
                          {file.status === "pending" && "Pending"}
                          {file.status === "uploading" && "Uploading..."}
                          {file.status === "success" && "Success"}
                          {file.status === "error" && "Error"}
                        </span>
                        {file.status === "uploading" && (
                          <Progress
                            value={file.progress}
                            className="w-20 h-1"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {file.error && (
                  <p className="text-xs text-red-600 mt-2">{file.error}</p>
                )}
                {file.result?.url && (
                  <div className="mt-2">
                    <a
                      href={file.result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View uploaded file
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
