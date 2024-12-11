import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-organization-setting-salary',
  templateUrl: './organization-setting-salary.component.html',
  styleUrl: './organization-setting-salary.component.scss',
})
export class OrganizationSettingSalaryComponent {
  @Input() serviceId: string;
}
