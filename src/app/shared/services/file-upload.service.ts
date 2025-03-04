import { HttpClient } from '@angular/common/http';
import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { environment } from 'src/environments/environment';
// import { UploadfileGQL } from 'src/graphql/generated';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  endPoint = environment.API_URI;
  constructor(private http: HttpClient) {}
  signalFile: WritableSignal<string | ArrayBuffer> = signal(null);
  signalDataOrganisation: WritableSignal<any> = signal(null);
  signalDataResponse: WritableSignal<any> = signal(null);
  renderFile(file: File, type?: UserRole) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      this.signalFile.set(reader.result);
      this.sendFile(file, type);
    };
  }

  getFile() {
    return this.signalFile();
  }
  getDataResponse() {
    return this.signalDataResponse();
  }

  sendFile(file: any, type: UserRole) {
    const formData: FormData = new FormData();

    formData.append('file', file);

    this.http
      .post(`${this.endPoint}users/upload?type=${type}`, formData)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.signalDataResponse.set(res);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  sendFileEndpoint(file: any, url: string) {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.http.post(`${this.endPoint}/${url}`, formData);
  }
}
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPER_ADMIN_ORG = 'SUPER_ADMIN_ORG',
  COLLABORATOR = 'COLLABORATOR',
}
