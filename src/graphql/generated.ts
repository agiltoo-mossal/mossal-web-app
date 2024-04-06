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
  Refused = 'REFUSED',
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
  createOrganization: Organization;
  finalizeForgotPassword: Scalars['Boolean']['output'];
  inviteCollaborator: Scalars['Boolean']['output'];
  resetAdminPassword: Scalars['Boolean']['output'];
  resetCollaboratorPassword: Scalars['Boolean']['output'];
  startForgotPassword: Scalars['Boolean']['output'];
  updateDemande: Scalars['Boolean']['output'];
  updateMyBankAccount: Scalars['Boolean']['output'];
  updateOrganization: Scalars['Boolean']['output'];
};


export type MutationAddDemandeArgs = {
  demandeInput: DemandeInput;
};


export type MutationCancelDemandeArgs = {
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


export type MutationResetAdminPasswordArgs = {
  resetPasswordInput: ResetPasswordInput;
};


export type MutationResetCollaboratorPasswordArgs = {
  resetPasswordInput: ResetPasswordInput;
};


export type MutationStartForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateDemandeArgs = {
  demandeId: Scalars['ID']['input'];
  demandeInput: DemandeUpdateInput;
};


export type MutationUpdateMyBankAccountArgs = {
  bankAccountNumber: Scalars['String']['input'];
};


export type MutationUpdateOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
  organizationInput: OrganizationUpdateInput;
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
  fetchMyDemande: Demande;
  fetchMyDemandes: Array<Demande>;
  fetchMyDemandesMetrics: Array<DemandeMetric>;
  fetchOrganization: Organization;
  fetchOrganizationCollaborators: Array<User>;
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

export type User = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']['output']>;
  balance?: Maybe<Scalars['Float']['output']>;
  bankAccountNumber?: Maybe<Scalars['String']['output']>;
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
  wizallAccountNumber?: Maybe<Scalars['String']['output']>;
};

export type FetchOrganizationCollaboratorsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchOrganizationCollaboratorsQuery = { __typename?: 'Query', fetchOrganizationCollaborators: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, uniqueIdentifier?: string | null, address?: string | null, salary?: number | null, wizallAccountNumber?: string | null, bankAccountNumber?: string | null, position?: string | null, organization: { __typename?: 'Organization', name: string } }> };

export type InviteCollaboratorMutationVariables = Exact<{
  collaboratorInput: InviteCollaboratorInput;
}>;


export type InviteCollaboratorMutation = { __typename?: 'Mutation', inviteCollaborator: boolean };

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
    wizallAccountNumber
    bankAccountNumber
    position
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