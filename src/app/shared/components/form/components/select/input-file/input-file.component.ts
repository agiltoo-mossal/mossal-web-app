import { DomSanitizer } from '@angular/platform-browser';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss']
})
export class InputFileComponent implements OnInit {
  @Input() name: string;
  @Input() placeholder: string;
  @Input() maxSize: string;
  @Input() type: string;
  @Input() format: string;
  @Input() formData: FormData;
  @Input() background: string;
  @Input() filename: string;
  @Input() isRequired: boolean = false;
  file: File;
  errorMessage: string;
  @Input() path: string;
  acceptedFormats: string;
  selectedFileType: string;
  touched: boolean = false;

  @Output() change: EventEmitter<File> = new EventEmitter();
  constructor(
    private ref: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.acceptedFormats = this.format
      .split(',')
      .map(format => {
        return `${this.type}/${format.trim()}`;
      })
      .join(', ');
    this.ref.detectChanges();
  }

  handleFile(files: FileList) {
    this.path = null;
    this.errorMessage = null;
    this.file = files.item(0);
    if (this.filename) {
      this.formData.set(this.name, this.file, this.filename);
    } else {
      this.formData.set(this.name, this.file);
    }
    this.selectedFileType = this.file ? this.file.type : null;
    if (files.length === 0) {
      this.formData.delete(this.name);
      return;
    }
    // const mimeType = files[0].type;
    // // if (mimeType.match(/video\/mp4/) == null) {
    // //   this.errorMessage = 'Only video/mp4 are supported.';
    // //   return;
    // // }
    // const fileSize = files[0].size;
    // if (fileSize > 200839) {
    //   this.message = 'Maximum upload file size 200 kb.';
    //   return ;
    // }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.path = reader.result as string;
      this.fileChange();
      this.ref.detectChanges();
    };
  }

  openFile(id: string) {
    document.getElementById(id).click();
    this.touched = true;
  }

  getVideoPath(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getSafePath(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  fileChange() {
    this.change.emit(this.file);
  }

  get valid(): boolean {
    if(this.isRequired && !this.formData.get(this.name)) {
      return false;
    }
    return true;
  }
}
