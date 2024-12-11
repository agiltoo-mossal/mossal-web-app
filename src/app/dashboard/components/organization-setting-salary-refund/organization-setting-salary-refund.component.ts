import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-organization-setting-salary-refund',
  templateUrl: './organization-setting-salary-refund.component.html',
  styleUrl: './organization-setting-salary-refund.component.scss',
})
export class OrganizationSettingSalaryRefundComponent {
  @Input() serviceId: string;
}
