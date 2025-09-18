import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './edit-admin-mossall.component.html',
  styleUrl: './edit-admin-mossall.component.scss'
})
export class EditAdminMossallComponent {
  collaboratorId: string;
  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.collaboratorId = params.get('id');
      console.log('collaboratorId ID:', this.collaboratorId);
    });
  }
}
