import { Pipe, PipeTransform } from '@angular/core';
import { DemandeStatus } from 'src/graphql/generated';

@Pipe({
  name: 'demandeStatus',
})
export class DemandeStatusPipe implements PipeTransform {
  private statusMapping: { [key in DemandeStatus]: string } = {
    [DemandeStatus.Cancelled]: 'Annulée',
    [DemandeStatus.InProcess]: 'En cours',
    [DemandeStatus.Payed]: 'Rembousée',
    [DemandeStatus.Pending]: 'En attente',
    [DemandeStatus.Rejected]: 'Rejetée',
    [DemandeStatus.Validated]: 'Validée',
  };

  transform(value: DemandeStatus): string {
    return this.statusMapping[value] || value;
  }
}
