import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type Demande = {
  __typename?: 'Demande';
  amount: Scalars['Float']['output'];
  collaborator: User;
  createdAt: Scalars['DateTime']['output'];
  fees: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  number: Scalars['Float']['output'];
  status: DemandeStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type DemandeInput = {
  amount: Scalars['Float']['input'];
};

export type DemandeMetric = {
  __typename?: 'DemandeMetric';
  month: Scalars['Float']['output'];
  value: Scalars['Float']['output'];
};

export type DemandeMetricFilter = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};

export enum DemandeStatus {
  Cancelled = 'CANCELLED',
  InProcess = 'IN_PROCESS',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Validated = 'VALIDATED'
}

export type DemandeUpdateInput = {
  amount: Scalars['Float']['input'];
};

export type FinalizeForgotPasswordInput = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type InviteCollaboratorInput = {
  address: Scalars['String']['input'];
  bankAccountNumber?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  position: Scalars['String']['input'];
  salary?: InputMaybe<Scalars['Float']['input']>;
  uniqueIdentifier: Scalars['String']['input'];
  wizallAccountNumber?: InputMaybe<Scalars['String']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addDemande: Demande;
  cancelDemande: Scalars['Boolean']['output'];
  cancelDemandeByAdmin: Scalars['Boolean']['output'];
  createOrganization: Organization;
  finalizeForgotPassword: Scalars['Boolean']['output'];
  inviteCollaborator: Scalars['Boolean']['output'];
  rejectDemandeByAdmin: Scalars['Boolean']['output'];
  resetAdminPassword: Scalars['Boolean']['output'];
  resetCollaboratorPassword: Scalars['Boolean']['output'];
  startForgotPassword: Scalars['Boolean']['output'];
  updateCollaborator: Scalars['Boolean']['output'];
  updateDemande: Scalars['Boolean']['output'];
  updateMyAdminPassword: Scalars['Boolean']['output'];
  updateMyAdminProfile: Scalars['Boolean']['output'];
  updateMyBankAccount: Scalars['Boolean']['output'];
  updateOrganization: Scalars['Boolean']['output'];
  validateDemande: Scalars['Boolean']['output'];
};


export type MutationAddDemandeArgs = {
  demandeInput: DemandeInput;
};


export type MutationCancelDemandeArgs = {
  demandeId: Scalars['ID']['input'];
};


export type MutationCancelDemandeByAdminArgs = {
  demandeId: Scalars['ID']['input'];
};


export type MutationCreateOrganizationArgs = {
  organizationInput: OrganizationInput;
};


export type MutationFinalizeForgotPasswordArgs = {
  finalizeForgotPasswordInput: FinalizeForgotPasswordInput;
};


export type MutationInviteCollaboratorArgs = {
  collaborator: InviteCollaboratorInput;
};


export type MutationRejectDemandeByAdminArgs = {
  demandeId: Scalars['ID']['input'];
  rejectedReason: Scalars['String']['input'];
};


export type MutationResetAdminPasswordArgs = {
  resetPasswordInput: ResetPasswordInput;
};


export type MutationResetCollaboratorPasswordArgs = {
  resetPasswordInput: ResetPasswordInput;
};


export type MutationStartForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateCollaboratorArgs = {
  collaborator: UpdateCollaboratorInput;
  collaboratorId: Scalars['String']['input'];
};


export type MutationUpdateDemandeArgs = {
  demandeId: Scalars['ID']['input'];
  demandeInput: DemandeUpdateInput;
};


export type MutationUpdateMyAdminPasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationUpdateMyAdminProfileArgs = {
  userInput: UpdateMyAdminProfileInput;
};


export type MutationUpdateMyBankAccountArgs = {
  bankAccountNumber: Scalars['String']['input'];
};


export type MutationUpdateOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
  organizationInput: OrganizationUpdateInput;
};


export type MutationValidateDemandeArgs = {
  demandeId: Scalars['ID']['input'];
};

export type Organization = {
  __typename?: 'Organization';
  id: Scalars['ID']['output'];
  /** Nom de l'organisation */
  name: Scalars['String']['output'];
  /** Email de l'utilisateur racine ou admin */
  rootEmail: Scalars['String']['output'];
};

export type OrganizationInput = {
  /** Nom de l'organisation */
  name: Scalars['String']['input'];
  /** Email de l'utilisateur racine ou admin */
  rootEmail: Scalars['String']['input'];
  /** Prénom de l'utilisateur racine */
  rootFirstname: Scalars['String']['input'];
  /** Nom de l'utilisateur racine */
  rootLastname: Scalars['String']['input'];
};

export type OrganizationUpdateInput = {
  /** Nom de l'organisation */
  name: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  checkMyBalance: Scalars['Float']['output'];
  checkMyDemandeFees: Scalars['Float']['output'];
  fetchCurrentAdmin: User;
  fetchMyDemande: Demande;
  fetchMyDemandes: Array<Demande>;
  fetchMyDemandesMetrics: Array<DemandeMetric>;
  fetchOrganization: Organization;
  fetchOrganizationCollaborator: User;
  fetchOrganizationCollaborators: Array<User>;
  fetchOrganizationDemandes: Array<Demande>;
  fetchOrganizations: Array<Organization>;
  loginAdmin: Session;
  loginCollaborator: Session;
  refreshCollaboratorToken: Session;
  /** Token to call reset password endpoint */
  requestResetCollaboratorPassword: Scalars['String']['output'];
};


export type QueryCheckMyDemandeFeesArgs = {
  demandeAmount: Scalars['Float']['input'];
};


export type QueryFetchMyDemandeArgs = {
  demandeId: Scalars['ID']['input'];
};


export type QueryFetchMyDemandesMetricsArgs = {
  metricsFilter: DemandeMetricFilter;
};


export type QueryFetchOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};


export type QueryFetchOrganizationCollaboratorArgs = {
  collaboratorId: Scalars['String']['input'];
};


export type QueryLoginAdminArgs = {
  loginInput: LoginInput;
};


export type QueryLoginCollaboratorArgs = {
  loginInput: LoginInput;
};


export type QueryRefreshCollaboratorTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type QueryRequestResetCollaboratorPasswordArgs = {
  oldPassword: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Session = {
  __typename?: 'Session';
  /** Null if user must reset his password */
  access_token?: Maybe<Scalars['String']['output']>;
  /** False if user must reset his password */
  enabled: Scalars['Boolean']['output'];
  /** Null if user must reset his password */
  expires_in?: Maybe<Scalars['Float']['output']>;
  /** Null if user must reset his password */
  refresh_expires_in?: Maybe<Scalars['Float']['output']>;
  /** Null if user must reset his password */
  refresh_token?: Maybe<Scalars['String']['output']>;
  /** Null if user must reset his password */
  scope?: Maybe<Scalars['String']['output']>;
  /** Null if user must reset his password */
  session_state?: Maybe<Scalars['String']['output']>;
  /** Not null if user must reset his password. Null other cases */
  token?: Maybe<Scalars['String']['output']>;
  /** Null if user must reset his password */
  token_type?: Maybe<Scalars['String']['output']>;
  /** Null if user must reset his password */
  user?: Maybe<User>;
};

export type UpdateCollaboratorInput = {
  address: Scalars['String']['input'];
  bankAccountNumber?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  position: Scalars['String']['input'];
  salary?: InputMaybe<Scalars['Float']['input']>;
  uniqueIdentifier: Scalars['String']['input'];
  wizallAccountNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMyAdminProfileInput = {
  address: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']['output']>;
  authorizedAdvance: Scalars['Int']['output'];
  balance?: Maybe<Scalars['Float']['output']>;
  bankAccountNumber?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  organization: Organization;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  uniqueIdentifier?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  wizallAccountNumber?: Maybe<Scalars['String']['output']>;
};

export type FetchOrganizationCollaboratorsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchOrganizationCollaboratorsQuery = { __typename?: 'Query', fetchOrganizationCollaborators: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, uniqueIdentifier?: string | null, address?: string | null, salary?: number | null, balance?: number | null, wizallAccountNumber?: string | null, bankAccountNumber?: string | null, position?: string | null, authorizedAdvance: number, createdAt: any, updatedAt: any, organization: { __typename?: 'Organization', name: string } }> };

export type InviteCollaboratorMutationVariables = Exact<{
  collaboratorInput: InviteCollaboratorInput;
}>;


export type InviteCollaboratorMutation = { __typename?: 'Mutation', inviteCollaborator: boolean };

export type FetchOrganizationCollaboratorQueryVariables = Exact<{
  collaboratorId: Scalars['String']['input'];
}>;


export type FetchOrganizationCollaboratorQuery = { __typename?: 'Query', fetchOrganizationCollaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, uniqueIdentifier?: string | null, address?: string | null, salary?: number | null, wizallAccountNumber?: string | null, bankAccountNumber?: string | null, position?: string | null, authorizedAdvance: number, organization: { __typename?: 'Organization', name: string } } };

export type UpdateCollaboratorMutationVariables = Exact<{
  collaboratorInput: UpdateCollaboratorInput;
  collaboratorId: Scalars['String']['input'];
}>;


export type UpdateCollaboratorMutation = { __typename?: 'Mutation', updateCollaborator: boolean };

export type FetchOrganizationDemandesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchOrganizationDemandesQuery = { __typename?: 'Query', fetchOrganizationDemandes: Array<{ __typename?: 'Demande', id: string, amount: number, status: DemandeStatus, number: number, fees: number, createdAt: any, updatedAt: any, collaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, balance?: number | null, salary?: number | null, authorizedAdvance: number, bankAccountNumber?: string | null, organization: { __typename?: 'Organization', name: string } } }> };

export type ValidateDemandeMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
}>;


export type ValidateDemandeMutation = { __typename?: 'Mutation', validateDemande: boolean };

export type CancelDemandeByAdminMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
}>;


export type CancelDemandeByAdminMutation = { __typename?: 'Mutation', cancelDemandeByAdmin: boolean };

export type RejectDemandeByAdminMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
  rejectedReason: Scalars['String']['input'];
}>;


export type RejectDemandeByAdminMutation = { __typename?: 'Mutation', rejectDemandeByAdmin: boolean };

export type UpdateMyAdminPasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type UpdateMyAdminPasswordMutation = { __typename?: 'Mutation', updateMyAdminPassword: boolean };

export type FetchCurrentAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCurrentAdminQuery = { __typename?: 'Query', fetchCurrentAdmin: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, address?: string | null } };

export type UpdateMyAdminProfileMutationVariables = Exact<{
  userInput: UpdateMyAdminProfileInput;
}>;


export type UpdateMyAdminProfileMutation = { __typename?: 'Mutation', updateMyAdminProfile: boolean };

export const FetchOrganizationCollaboratorsDocument = gql`
    query FetchOrganizationCollaborators {
  fetchOrganizationCollaborators {
    id
    firstName
    lastName
    email
    phoneNumber
    uniqueIdentifier
    address
    salary
    balance
    wizallAccountNumber
    bankAccountNumber
    position
    authorizedAdvance
    createdAt
    updatedAt
    organization {
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOrganizationCollaboratorsGQL extends Apollo.Query<FetchOrganizationCollaboratorsQuery, FetchOrganizationCollaboratorsQueryVariables> {
    document = FetchOrganizationCollaboratorsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InviteCollaboratorDocument = gql`
    mutation InviteCollaborator($collaboratorInput: InviteCollaboratorInput!) {
  inviteCollaborator(collaborator: $collaboratorInput)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class InviteCollaboratorGQL extends Apollo.Mutation<InviteCollaboratorMutation, InviteCollaboratorMutationVariables> {
    document = InviteCollaboratorDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOrganizationCollaboratorDocument = gql`
    query FetchOrganizationCollaborator($collaboratorId: String!) {
  fetchOrganizationCollaborator(collaboratorId: $collaboratorId) {
    id
    firstName
    lastName
    email
    phoneNumber
    uniqueIdentifier
    address
    salary
    wizallAccountNumber
    bankAccountNumber
    position
    authorizedAdvance
    organization {
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOrganizationCollaboratorGQL extends Apollo.Query<FetchOrganizationCollaboratorQuery, FetchOrganizationCollaboratorQueryVariables> {
    document = FetchOrganizationCollaboratorDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateCollaboratorDocument = gql`
    mutation UpdateCollaborator($collaboratorInput: UpdateCollaboratorInput!, $collaboratorId: String!) {
  updateCollaborator(
    collaborator: $collaboratorInput
    collaboratorId: $collaboratorId
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCollaboratorGQL extends Apollo.Mutation<UpdateCollaboratorMutation, UpdateCollaboratorMutationVariables> {
    document = UpdateCollaboratorDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOrganizationDemandesDocument = gql`
    query FetchOrganizationDemandes {
  fetchOrganizationDemandes {
    id
    amount
    status
    number
    fees
    collaborator {
      id
      firstName
      lastName
      balance
      salary
      authorizedAdvance
      bankAccountNumber
      organization {
        name
      }
    }
    createdAt
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOrganizationDemandesGQL extends Apollo.Query<FetchOrganizationDemandesQuery, FetchOrganizationDemandesQueryVariables> {
    document = FetchOrganizationDemandesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ValidateDemandeDocument = gql`
    mutation ValidateDemande($demandeId: ID!) {
  validateDemande(demandeId: $demandeId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ValidateDemandeGQL extends Apollo.Mutation<ValidateDemandeMutation, ValidateDemandeMutationVariables> {
    document = ValidateDemandeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CancelDemandeByAdminDocument = gql`
    mutation CancelDemandeByAdmin($demandeId: ID!) {
  cancelDemandeByAdmin(demandeId: $demandeId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CancelDemandeByAdminGQL extends Apollo.Mutation<CancelDemandeByAdminMutation, CancelDemandeByAdminMutationVariables> {
    document = CancelDemandeByAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RejectDemandeByAdminDocument = gql`
    mutation RejectDemandeByAdmin($demandeId: ID!, $rejectedReason: String!) {
  rejectDemandeByAdmin(demandeId: $demandeId, rejectedReason: $rejectedReason)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RejectDemandeByAdminGQL extends Apollo.Mutation<RejectDemandeByAdminMutation, RejectDemandeByAdminMutationVariables> {
    document = RejectDemandeByAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateMyAdminPasswordDocument = gql`
    mutation UpdateMyAdminPassword($oldPassword: String!, $newPassword: String!) {
  updateMyAdminPassword(oldPassword: $oldPassword, newPassword: $newPassword)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateMyAdminPasswordGQL extends Apollo.Mutation<UpdateMyAdminPasswordMutation, UpdateMyAdminPasswordMutationVariables> {
    document = UpdateMyAdminPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchCurrentAdminDocument = gql`
    query FetchCurrentAdmin {
  fetchCurrentAdmin {
    id
    firstName
    lastName
    email
    phoneNumber
    address
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchCurrentAdminGQL extends Apollo.Query<FetchCurrentAdminQuery, FetchCurrentAdminQueryVariables> {
    document = FetchCurrentAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateMyAdminProfileDocument = gql`
    mutation UpdateMyAdminProfile($userInput: UpdateMyAdminProfileInput!) {
  updateMyAdminProfile(userInput: $userInput)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateMyAdminProfileGQL extends Apollo.Mutation<UpdateMyAdminProfileMutation, UpdateMyAdminProfileMutationVariables> {
    document = UpdateMyAdminProfileDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }