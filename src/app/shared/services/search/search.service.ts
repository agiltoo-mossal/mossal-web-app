import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  BankAccountNumberExistsGQL,
  EmailExistsGQL,
  PhoneNumberExistsGQL,
  UniqueIdentifierExistsGQL,
} from 'src/graphql/generated';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private phoneNumberExistsGQL: PhoneNumberExistsGQL,
    private uniqueIdentifierExistsGQL: UniqueIdentifierExistsGQL,
    private bankAccountNumberExistsGQL: BankAccountNumberExistsGQL,
    private emailExistsGQL: EmailExistsGQL
  ) {}

  async emailExists(email: string, isAdmin = false, userId = null) {
    const result = await lastValueFrom(
      this.emailExistsGQL.fetch({ email, isAdmin, userId })
    );
    return result.data.emailExists;
  }

  async phoneNumberExists(phoneNumber: string, isAdmin = false, userId = null) {
    const result = await lastValueFrom(
      this.phoneNumberExistsGQL.fetch({ phoneNumber, isAdmin, userId })
    );
    return result.data.phoneNumberExists;
  }

  async uniqueIdentifierExists(
    uniqueIdentifier: string,
    isAdmin = false,
    userId = null
  ) {
    const result = await lastValueFrom(
      this.uniqueIdentifierExistsGQL.fetch({
        uniqueIdentifier,
        isAdmin,
        userId,
      })
    );
    return result.data.uniqueIdentifierExists;
  }
}
