import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-organization-balance',
  templateUrl: './organization-balance.component.html',
  styleUrl: './organization-balance.component.scss'
})
export class OrganizationBalanceComponent {
  @Input() organization: any;
  // balanceData = {
  //   path: "./assets/img/balance-amount.svg",
  //   style: "#40B139",
  // }

  getBalanceClass(): string {
    if (!this.organization) return '';

    const balance = this.organization.balance;
    const maxDemandeAmount = this.organization.maxDemandeAmount;
    const threshold = maxDemandeAmount * 1.5;

    if (balance < maxDemandeAmount) {
      return 'balance-red';
    } else if (balance <= threshold) {
      return 'balance-orange';
    } else {
      return 'balance-green';
    }
  }

}
