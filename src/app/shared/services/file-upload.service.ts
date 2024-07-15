import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
// import { UploadfileGQL } from 'src/graphql/generated';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}
  signalFile: WritableSignal<string | ArrayBuffer> = signal(null);
  signalDataResponse: WritableSignal<any> = signal(null);
  renderFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      this.signalFile.set(reader.result);
      this.sendFile(file);
    };
  }

  getFile() {
    return this.signalFile();
  }
  getDataResponse() {
    return this.signalDataResponse();
  }

  sendFile(file: any) {
    const formData: FormData = new FormData();

    formData.append('file', file);
    this.http.post('http://localhost:3003/users/upload', formData).subscribe({
      next: (res) => {
        console.log(res);
        this.signalDataResponse.set(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
