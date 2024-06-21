import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { BankAccountNumberExistsGQL, PhoneNumberExistsGQL, UniqueIdentifierExistsGQL } from 'src/graphql/generated';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private phoneNumberExistsGQL: PhoneNumberExistsGQL,
    private uniqueIdentifierExistsGQL: UniqueIdentifierExistsGQL,
    private bankAccountNumberExistsGQL: BankAccountNumberExistsGQL
  ) { }

  async phoneNumberExists(phoneNumber: string) {
    const result = await lastValueFrom(this.phoneNumberExistsGQL.fetch({ phoneNumber }));
    return result.data.phoneNumberExists;
  }

  async uniqueIdentifierExists(uniqueIdentifier: string) {
    const result = await lastValueFrom(this.uniqueIdentifierExistsGQL.fetch({ uniqueIdentifier }));
    return result.data.uniqueIdentifierExists;
  }

  async bankAccountNumberExists(bankAccountNumber: string) {
    const result = await lastValueFrom(this.bankAccountNumberExistsGQL.fetch({ bankAccountNumber }));
    return result.data.bankAccountNumberExists;
  }

}
