import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financial_institutions',
  templateUrl: './financial_institutions.component.html',
  styleUrls: ['./financial_institutions.component.scss'],
})
export class FinancialInstitutionsComponent {
  constructor(
    private router: Router
  ) { }

  requests = [{}, {}, {}, {}, {}, {}];

  title: string = "liste des instituts financières"


  addSocity() {
    this.router.navigate(['/dashboard/financial_institutions/create-financial_institutions']);
  }

}
