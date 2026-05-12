export interface FileUploadResponse {
  success: boolean;
  uploadId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  purpose: string;
  fileUrl: string;
  publicUrl: string;
}
