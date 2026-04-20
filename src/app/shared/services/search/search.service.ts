import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  BankAccountNumberExistsGQL,
  EmailExistsGQL,
  OrganizationNameExistsGQL,
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
    private emailExistsGQL: EmailExistsGQL,
    private organizationNameExistsGQL: OrganizationNameExistsGQL,
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

  async organizationNameExists(name: string, organizationId: string = null) {
    const result = await lastValueFrom(
      this.organizationNameExistsGQL.fetch({ name, organizationId })
    );
    return result.data.organizationNameExists;
  }
}
