"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { useR2Upload } from "@/hooks/use-r2-upload";
import { useToast } from "@/hooks/use-toast";

export function UploadExample() {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const handleUploadComplete = (results: any[]) => {
    const urls = results.map((result) => result.url);
    setUploadedUrls((prev) => [...prev, ...urls]);

    toast({
      title: "Upload Complete",
      description: `${results.length} file(s) uploaded successfully`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File Upload Example</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            endpoint="/api/upload"
            maxFileSize={5 * 1024 * 1024} // 5MB
            allowedTypes={["image/*", "application/pdf"]}
            multiple={true}
            onUploadComplete={handleUploadComplete}
          />
        </CardContent>
      </Card>

      {uploadedUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm truncate">{url}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(url, "_blank")}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Example of using the hook directly
export function DirectUploadExample() {
  const [isUploading, setIsUploading] = useState(false);
  const { uploadFile, progress } = useR2Upload({
    endpoint: "/api/upload",
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/*"],
    onProgress: (progressData) => {
      console.log(`Upload progress: ${progressData.percentage}%`);
    },
    onSuccess: (result) => {
      console.log("Upload successful:", result.url);
      setIsUploading(false);
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      setIsUploading(false);
    },
  });

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const result = await uploadFile(file);
      console.log("Upload result:", result);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Direct Upload Example</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      {isUploading && progress && (
        <div className="mt-4">
          <p>Uploading: {progress.percentage}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
