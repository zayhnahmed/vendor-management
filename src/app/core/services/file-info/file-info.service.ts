import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FileInfo } from '../../models/file-info.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileInfoService {
  private http: HttpClient = inject(HttpClient);

  getFileInfo(id: string) {
    return this.http.get<any>(`/public/files/${id}/info`);
  }

  openFile(fileUrl: string) {
    const url = `${environment.apiBaseURL}${fileUrl}`;
    window.open(url, '_blank');
  }

  downloadFile(fileUrl: string) {
    const url = `${environment.apiBaseURL}${fileUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    link.target = '_blank'; // optional
    link.click();
  }
}
