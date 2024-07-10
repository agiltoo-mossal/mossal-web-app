import { Component, effect, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  search!: string;
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  showModal = false;
  dataResponseFile!: any;
  constructor(
    private fileUploadService: FileUploadService,
    private formBuilder: FormBuilder
  ) {
    this.uploadForm = this.formBuilder.group({
      file: [''],
    });
    effect(() => {
      this.dataResponseFile = this.fileUploadService.getDataResponse();
      if (this.dataResponseFile) this.showModal = true;
      console.log(this.dataResponseFile);
    });
  }
  onFileSelected(event: Event) {
    const files = event.target as HTMLInputElement;
    if (files) {
      const file: File = (event.target as HTMLInputElement).files[0];
      this.fileUploadService.renderFile(file);
    }
  }
}
