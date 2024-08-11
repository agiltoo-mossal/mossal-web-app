import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-organization-file',
  templateUrl: './organization-file.component.html',
  styleUrl: './organization-file.component.scss',
})
export class OrganizationFileComponent implements OnInit {
  constructor(private fileService: FileUploadService) {}

  ngOnInit(): void {}
  async uploadDemande(event: Event) {
    const files = event.target as HTMLInputElement;
    if (files) {
      const file: File = (event.target as HTMLInputElement).files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result);
        console.log(file);
        this.fileService.sendFileEndpoint(file, `demande/upload`).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (error) => console.log(error),
        });
      };
    }
  }

  downloadDemande() {}
}
