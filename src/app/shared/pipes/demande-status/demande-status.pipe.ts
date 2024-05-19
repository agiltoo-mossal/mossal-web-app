import { Pipe, PipeTransform } from '@angular/core';
import { DemandeStatus } from 'src/graphql/generated';

@Pipe({
  name: 'demandeStatus',
})
export class DemandeStatusPipe implements PipeTransform {
  private statusMapping: { [key in DemandeStatus]: string } = {
    [DemandeStatus.Cancelled]: 'Annulé',
    [DemandeStatus.InProcess]: 'En cours',
    [DemandeStatus.Payed]: 'Payé',
    [DemandeStatus.Pending]: 'En attente',
    [DemandeStatus.Rejected]: 'Rejeté',
    [DemandeStatus.Validated]: 'Validé',
  };

  transform(value: DemandeStatus): string {
    return this.statusMapping[value] || value;
  }
}
