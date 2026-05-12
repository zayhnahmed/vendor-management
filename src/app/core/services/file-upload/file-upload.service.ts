import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileUploadResponse } from '../../models/file-upload-response.model';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private http: HttpClient = inject(HttpClient);

  uploadDocument(file: File): Observable<HttpEvent<FileUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<FileUploadResponse>('/public/upload/registration', formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
