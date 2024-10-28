import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** Any type */
  Any: { input: any; output: any };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
  _Any: { input: any; output: any };
  federation__FieldSet: { input: any; output: any };
  link__Import: { input: any; output: any };
};

export type Activity = {
  __typename?: 'Activity';
  createdAt: Scalars['DateTime']['output'];
  currentValue?: Maybe<Scalars['Any']['output']>;
  id: Scalars['ID']['output'];
  initialValue?: Maybe<Scalars['Any']['output']>;
  message: Scalars['String']['output'];
  meta?: Maybe<Scalars['Any']['output']>;
  organization: Organization;
  scope: ActivityScope;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

/** Possible activities */
export enum ActivityScope {
  Authentification = 'authentification',
  Collaborateur = 'collaborateur',
  Demande = 'demande',
  Organisation = 'organisation',
}

export type CountStatusDemande = {
  __typename?: 'CountStatusDemande';
  payed: Scalars['Float']['output'];
  pending: Scalars['Float']['output'];
  rejected: Scalars['Float']['output'];
  validated: Scalars['Float']['output'];
};

export type Demande = {
  __typename?: 'Demande';
  amount: Scalars['Float']['output'];
  collaborator: User;
  colloborator?: Maybe<User>;
  createdAt: Scalars['DateTime']['output'];
  fees: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  number: Scalars['Float']['output'];
  rejectedReason?: Maybe<Scalars['String']['output']>;
  status: DemandeStatus;
  statusText?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum DemandeStatus {
  Cancelled = 'CANCELLED',
  InProcess = 'IN_PROCESS',
  Payed = 'PAYED',
  Pending = 'PENDING',
  Rejected = 'REJECTED',
  Validated = 'VALIDATED',
}

export type DemandesMetrics = {
  __typename?: 'DemandesMetrics';
  payed: Array<DemandesMetricsRow>;
  remaining: Array<DemandesMetricsRow>;
  total: Array<DemandesMetricsRow>;
};

export type DemandesMetricsInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  maximum?: InputMaybe<Scalars['Float']['input']>;
  minimum?: InputMaybe<Scalars['Float']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<DemandeStatus>;
};

export type DemandesMetricsRow = {
  __typename?: 'DemandesMetricsRow';
  amount: Scalars['Float']['output'];
  date: Scalars['String']['output'];
  month: Scalars['Float']['output'];
  year: Scalars['Float']['output'];
};

export type FinalizeForgotPasswordInput = {
  code: Scalars['String']['input'];
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type InviteCollaboratorInput = {
  address: Scalars['String']['input'];
  bankAccountNumber?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  email: Scalars['String']['input'];
  favoriteWallet?: InputMaybe<Wallet>;
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
  cancelDemandeByAdmin: Scalars['Boolean']['output'];
  createFinancialOrganization: Organization;
  createOrganization: Organization;
  disableEmailNotification: Scalars['Boolean']['output'];
  enableEmailNotification: Scalars['Boolean']['output'];
  finalizeForgotPassword: Scalars['Boolean']['output'];
  inviteAdmin: Scalars['Boolean']['output'];
  inviteCollaborator: Scalars['Boolean']['output'];
  lockUser: Scalars['Boolean']['output'];
  payeDemande: Scalars['Boolean']['output'];
  rejectDemandeByAdmin: Scalars['Boolean']['output'];
  resetAdminPassword: Scalars['Boolean']['output'];
  startForgotPassword: Scalars['Boolean']['output'];
  unlockUser: Scalars['Boolean']['output'];
  updateCollaborator: Scalars['Boolean']['output'];
  updateMyAdminPassword: Scalars['Boolean']['output'];
  updateMyAdminProfile: Scalars['Boolean']['output'];
  updateOrganization: Scalars['Boolean']['output'];
  upladFile: Scalars['Boolean']['output'];
  validateDemande: Scalars['Boolean']['output'];
  viewOrganizationNotifications: Scalars['Boolean']['output'];
};

export type MutationCancelDemandeByAdminArgs = {
  demandeId: Scalars['ID']['input'];
};

export type MutationCreateFinancialOrganizationArgs = {
  organizationInput: OrganizationInput;
};

export type MutationCreateOrganizationArgs = {
  organizationInput: OrganizationInput;
};

export type MutationDisableEmailNotificationArgs = {
  userId: Scalars['String']['input'];
};

export type MutationEnableEmailNotificationArgs = {
  userId: Scalars['String']['input'];
};

export type MutationFinalizeForgotPasswordArgs = {
  finalizeForgotPasswordInput: FinalizeForgotPasswordInput;
};

export type MutationInviteAdminArgs = {
  admin: InviteCollaboratorInput;
};

export type MutationInviteCollaboratorArgs = {
  collaborator: InviteCollaboratorInput;
};

export type MutationLockUserArgs = {
  userId: Scalars['String']['input'];
};

export type MutationPayeDemandeArgs = {
  demandeId: Scalars['ID']['input'];
};

export type MutationRejectDemandeByAdminArgs = {
  demandeId: Scalars['ID']['input'];
  rejectedReason: Scalars['String']['input'];
};

export type MutationResetAdminPasswordArgs = {
  resetPasswordInput: ResetPasswordInput;
};

export type MutationStartForgotPasswordArgs = {
  email: Scalars['String']['input'];
};

export type MutationUnlockUserArgs = {
  userId: Scalars['String']['input'];
};

export type MutationUpdateCollaboratorArgs = {
  collaborator: UpdateCollaboratorInput;
  collaboratorId: Scalars['String']['input'];
};

export type MutationUpdateMyAdminPasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type MutationUpdateMyAdminProfileArgs = {
  userInput: UpdateMyAdminProfileInput;
};

export type MutationUpdateOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
  organizationInput: OrganizationUpdateInput;
};

export type MutationUpladFileArgs = {
  destination: Scalars['String']['input'];
  file: Scalars['String']['input'];
};

export type MutationValidateDemandeArgs = {
  demandeId: Scalars['ID']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  author: User;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  entityId?: Maybe<Scalars['String']['output']>;
  organization: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  viewedByMe: Scalars['Boolean']['output'];
};

/** Sort order */
export enum OrderByDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type OrderByInput = {
  direction: OrderByDirection;
  property: Scalars['String']['input'];
};

export type Organization = {
  __typename?: 'Organization';
  amountPercent: Scalars['Float']['output'];
  demandeDeadlineDay?: Maybe<Scalars['Float']['output']>;
  fees: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  maxDemandeAmount: Scalars['Float']['output'];
  /** Nom de l'organisation */
  name: Scalars['String']['output'];
  /** Email de l'utilisateur racine ou admin */
  rootEmail: Scalars['String']['output'];
};

export type OrganizationInput = {
  amountPercent: Scalars['Float']['input'];
  fees: Scalars['Float']['input'];
  maxDemandeAmount: Scalars['Float']['input'];
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
  amountPercent?: InputMaybe<Scalars['Float']['input']>;
  demandeDeadlineDay?: InputMaybe<Scalars['Float']['input']>;
  fees?: InputMaybe<Scalars['Float']['input']>;
  maxDemandeAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Nom de l'organisation */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PaginatedActivityResult = {
  __typename?: 'PaginatedActivityResult';
  pagination: PaginationInfo;
  results: Array<Activity>;
};

export type PaginatedDemandeResult = {
  __typename?: 'PaginatedDemandeResult';
  pagination: PaginationInfo;
  results: Array<Demande>;
};

export type PaginatedNotificationResult = {
  __typename?: 'PaginatedNotificationResult';
  pagination: PaginationInfo;
  results: Array<Notification>;
};

export type PaginatedUserResult = {
  __typename?: 'PaginatedUserResult';
  pagination: PaginationInfo;
  results: Array<User>;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  currentPage: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalItems: Scalars['Int']['output'];
};

export type Payment = {
  __typename?: 'Payment';
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  bankAccountNumberExists: Scalars['Boolean']['output'];
  emailExists: Scalars['Boolean']['output'];
  fectchCountStatus: CountStatusDemande;
  fetchActivity: Activity;
  fetchCurrentAdmin: User;
  fetchDemandesMetrics: DemandesMetrics;
  fetchOrganization: Organization;
  fetchOrganizationAdmins: Array<User>;
  fetchOrganizationCollaborator: User;
  fetchOrganizationCollaborators: Array<User>;
  fetchOrganizationDemandes: Array<Demande>;
  fetchOrganizationNotifications: Array<Notification>;
  fetchOrganizations: Array<Organization>;
  fetchPaginatedActivities: PaginatedActivityResult;
  fetchPaginatedNotifications: PaginatedNotificationResult;
  fetchPaginatedOrganisationAdmins: PaginatedUserResult;
  fetchPaginatedOrganisationCol: PaginatedUserResult;
  fetchPaginatedOrganizationCollaborators: PaginatedUserResult;
  fetchPaginatedOrganizationDemandes: PaginatedDemandeResult;
  fetchPayment: Payment;
  fetchPayments: Array<Payment>;
  loginAdmin: Session;
  phoneNumberExists: Scalars['Boolean']['output'];
  uniqueIdentifierExists: Scalars['Boolean']['output'];
};

export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};

export type QueryBankAccountNumberExistsArgs = {
  bankAccountNumber: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryEmailExistsArgs = {
  email: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFetchActivityArgs = {
  activityId: Scalars['ID']['input'];
};

export type QueryFetchDemandesMetricsArgs = {
  metricsInput: DemandesMetricsInput;
};

export type QueryFetchOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
};

export type QueryFetchOrganizationCollaboratorArgs = {
  collaboratorId: Scalars['String']['input'];
};

export type QueryFetchOrganizationCollaboratorsArgs = {
  metricsInput?: InputMaybe<DemandesMetricsInput>;
};

export type QueryFetchOrganizationDemandesArgs = {
  metricsInput?: InputMaybe<DemandesMetricsInput>;
};

export type QueryFetchPaginatedActivitiesArgs = {
  queryFilter?: InputMaybe<QueryDataConfigInput>;
};

export type QueryFetchPaginatedNotificationsArgs = {
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
};

export type QueryFetchPaginatedOrganisationAdminsArgs = {
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
};

export type QueryFetchPaginatedOrganisationColArgs = {
  metricsInput?: InputMaybe<DemandesMetricsInput>;
};

export type QueryFetchPaginatedOrganizationCollaboratorsArgs = {
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
};

export type QueryFetchPaginatedOrganisationAdminsArgs = {
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
};

export type QueryFetchPaymentArgs = {
  paymentId: Scalars['ID']['input'];
};

export type QueryLoginAdminArgs = {
  loginInput: LoginInput;
};

export type QueryPhoneNumberExistsArgs = {
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  phoneNumber: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryUniqueIdentifierExistsArgs = {
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  uniqueIdentifier: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryDataConfigInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OrderByInput>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
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

export type SupportPaiement = {
  __typename?: 'SupportPaiement';
  amount: Scalars['Float']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  uniqueIdentifier: Scalars['String']['output'];
};

export type UpdateCollaboratorInput = {
  address: Scalars['String']['input'];
  bankAccountNumber?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  favoriteWallet?: InputMaybe<Wallet>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  position: Scalars['String']['input'];
  salary?: InputMaybe<Scalars['Float']['input']>;
  uniqueIdentifier: Scalars['String']['input'];
  wizallAccountNumber?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMyAdminProfileInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  birthDate?: InputMaybe<Scalars['DateTime']['input']>;
  enableEmailNotification?: InputMaybe<Scalars['Boolean']['input']>;
  favoriteWallet?: InputMaybe<Wallet>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Scalars['String']['output']>;
  authorizedAdvance: Scalars['Float']['output'];
  balance?: Maybe<Scalars['Float']['output']>;
  bankAccountNumber?: Maybe<Scalars['String']['output']>;
  birthDate?: Maybe<Scalars['DateTime']['output']>;
  blocked?: Maybe<Scalars['Boolean']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  enableEmailNotification?: Maybe<Scalars['Boolean']['output']>;
  favoriteWallet?: Maybe<Wallet>;
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  organization: Organization;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  salary?: Maybe<Scalars['Float']['output']>;
  status?: Maybe<Scalars['Float']['output']>;
  totalDemandeAmount: Scalars['Float']['output'];
  uniqueIdentifier?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  wizallAccountNumber?: Maybe<Scalars['String']['output']>;
};

/** Possible wallets */
export enum Wallet {
  Wave = 'WAVE',
}

export type _Entity = Demande | Organization;

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY',
}

export type LoginAdminQueryVariables = Exact<{
  loginInput: LoginInput;
}>;

export type LoginAdminQuery = {
  __typename?: 'Query';
  loginAdmin: {
    __typename?: 'Session';
    enabled: boolean;
    token?: string | null;
    access_token?: string | null;
    refresh_token?: string | null;
    expires_in?: number | null;
    user?: {
      __typename?: 'User';
      id: string;
      firstName: string;
      lastName: string;
      organization: {
        __typename?: 'Organization';
        id: string;
        rootEmail: string;
        name: string;
      };
    } | null;
  };
};

export type ResetAdminPasswordMutationVariables = Exact<{
  resetPasswordInput: ResetPasswordInput;
}>;

export type ResetAdminPasswordMutation = {
  __typename?: 'Mutation';
  resetAdminPassword: boolean;
};

export type StartForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;

export type StartForgotPasswordMutation = {
  __typename?: 'Mutation';
  startForgotPassword: boolean;
};

export type FinalizeForgotPasswordMutationVariables = Exact<{
  finalizeForgotPasswordInput: FinalizeForgotPasswordInput;
}>;

export type FinalizeForgotPasswordMutation = {
  __typename?: 'Mutation';
  finalizeForgotPassword: boolean;
};

export type FetchPaginatedActivitiesQueryVariables = Exact<{
  queryFilter?: InputMaybe<QueryDataConfigInput>;
}>;

export type FetchPaginatedActivitiesQuery = {
  __typename?: 'Query';
  fetchPaginatedActivities: {
    __typename?: 'PaginatedActivityResult';
    pagination: {
      __typename?: 'PaginationInfo';
      totalItems: number;
      pageCount: number;
      currentPage: number;
      pageSize: number;
    };
    results: Array<{
      __typename?: 'Activity';
      id: string;
      message: string;
      scope: ActivityScope;
      createdAt: any;
      updatedAt: any;
      user: {
        __typename?: 'User';
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }>;
  };
};

export type FetchOrganizationAdminsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type FetchOrganizationAdminsQuery = {
  __typename?: 'Query';
  fetchOrganizationAdmins: Array<{
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    uniqueIdentifier?: string | null;
    address?: string | null;
    salary?: number | null;
    blocked?: boolean | null;
    balance?: number | null;
    totalDemandeAmount: number;
    wizallAccountNumber?: string | null;
    bankAccountNumber?: string | null;
    position?: string | null;
    authorizedAdvance: number;
    createdAt: any;
    updatedAt: any;
  }>;
};

export type InviteAdminMutationVariables = Exact<{
  adminInput: InviteCollaboratorInput;
}>;

export type InviteAdminMutation = {
  __typename?: 'Mutation';
  inviteAdmin: boolean;
};

export type FetchPaginatedOrganisationAdminsQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
}>;

export type FetchPaginatedOrganisationAdminsQuery = {
  __typename?: 'Query';
  fetchPaginatedOrganisationAdmins: {
    __typename?: 'PaginatedUserResult';
    pagination: {
      __typename?: 'PaginationInfo';
      totalItems: number;
      pageCount: number;
      currentPage: number;
      pageSize: number;
    };
    results: Array<{
      __typename?: 'User';
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string | null;
      uniqueIdentifier?: string | null;
      address?: string | null;
      salary?: number | null;
      blocked?: boolean | null;
      balance?: number | null;
      totalDemandeAmount: number;
      wizallAccountNumber?: string | null;
      bankAccountNumber?: string | null;
      position?: string | null;
      authorizedAdvance: number;
      createdAt: any;
      updatedAt: any;
    }>;
  };
};

export type FetchOrganizationCollaboratorsQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
}>;

export type FetchOrganizationCollaboratorsQuery = {
  __typename?: 'Query';
  fetchOrganizationCollaborators: Array<{
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    uniqueIdentifier?: string | null;
    address?: string | null;
    salary?: number | null;
    balance?: number | null;
    totalDemandeAmount: number;
    wizallAccountNumber?: string | null;
    bankAccountNumber?: string | null;
    position?: string | null;
    authorizedAdvance: number;
    createdAt: any;
    updatedAt: any;
    blocked?: boolean | null;
    favoriteWallet?: Wallet | null;
    birthDate?: any | null;
  }>;
};

export type FetchPaginatedOrganizationCollaboratorsQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
}>;

export type FetchPaginatedOrganizationCollaboratorsQuery = {
  __typename?: 'Query';
  fetchPaginatedOrganizationCollaborators: {
    __typename?: 'PaginatedUserResult';
    pagination: {
      __typename?: 'PaginationInfo';
      totalItems: number;
      pageCount: number;
      currentPage: number;
      pageSize: number;
    };
    results: Array<{
      __typename?: 'User';
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string | null;
      uniqueIdentifier?: string | null;
      address?: string | null;
      salary?: number | null;
      balance?: number | null;
      totalDemandeAmount: number;
      wizallAccountNumber?: string | null;
      bankAccountNumber?: string | null;
      position?: string | null;
      authorizedAdvance: number;
      createdAt: any;
      updatedAt: any;
      blocked?: boolean | null;
      favoriteWallet?: Wallet | null;
      birthDate?: any | null;
    }>;
  };
};

export type InviteCollaboratorMutationVariables = Exact<{
  collaboratorInput: InviteCollaboratorInput;
}>;

export type InviteCollaboratorMutation = {
  __typename?: 'Mutation';
  inviteCollaborator: boolean;
};

export type FetchOrganizationCollaboratorQueryVariables = Exact<{
  collaboratorId: Scalars['String']['input'];
}>;

export type FetchOrganizationCollaboratorQuery = {
  __typename?: 'Query';
  fetchOrganizationCollaborator: {
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    uniqueIdentifier?: string | null;
    address?: string | null;
    salary?: number | null;
    wizallAccountNumber?: string | null;
    bankAccountNumber?: string | null;
    position?: string | null;
    authorizedAdvance: number;
    favoriteWallet?: Wallet | null;
    birthDate?: any | null;
    blocked?: boolean | null;
    organization: { __typename?: 'Organization'; name: string };
  };
};

export type UpdateCollaboratorMutationVariables = Exact<{
  collaboratorInput: UpdateCollaboratorInput;
  collaboratorId: Scalars['String']['input'];
}>;

export type UpdateCollaboratorMutation = {
  __typename?: 'Mutation';
  updateCollaborator: boolean;
};

export type FetchOrganizationNotificationsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type FetchOrganizationNotificationsQuery = {
  __typename?: 'Query';
  fetchOrganizationNotifications: Array<{
    __typename?: 'Notification';
    entityId?: string | null;
    title: string;
    content: string;
    viewedByMe: boolean;
    organization: string;
    date: any;
    author: { __typename?: 'User'; firstName: string; lastName: string };
  }>;
};

export type ViewOrganizationNotificationsMutationVariables = Exact<{
  [key: string]: never;
}>;

export type ViewOrganizationNotificationsMutation = {
  __typename?: 'Mutation';
  viewOrganizationNotifications: boolean;
};

export type FetchPaginatedNotificationsQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
}>;

export type FetchPaginatedNotificationsQuery = {
  __typename?: 'Query';
  fetchPaginatedNotifications: {
    __typename?: 'PaginatedNotificationResult';
    pagination: {
      __typename?: 'PaginationInfo';
      totalItems: number;
      pageCount: number;
      currentPage: number;
      pageSize: number;
    };
    results: Array<{
      __typename?: 'Notification';
      entityId?: string | null;
      title: string;
      content: string;
      viewedByMe: boolean;
      organization: string;
      date: any;
      author: { __typename?: 'User'; firstName: string; lastName: string };
    }>;
  };
};

export type UpdateOrganizationMutationVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  organizationInput: OrganizationUpdateInput;
}>;

export type UpdateOrganizationMutation = {
  __typename?: 'Mutation';
  updateOrganization: boolean;
};

export type FetchDemandesMetricsQueryVariables = Exact<{
  metricsInput: DemandesMetricsInput;
}>;

export type FetchDemandesMetricsQuery = {
  __typename?: 'Query';
  fetchDemandesMetrics: {
    __typename?: 'DemandesMetrics';
    remaining: Array<{
      __typename?: 'DemandesMetricsRow';
      y: number;
      x: string;
    }>;
    total: Array<{ __typename?: 'DemandesMetricsRow'; y: number; x: string }>;
  };
};

export type FetchOrganizationDemandesQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
}>;

export type FetchOrganizationDemandesQuery = {
  __typename?: 'Query';
  fetchOrganizationDemandes: Array<{
    __typename?: 'Demande';
    id: string;
    amount: number;
    status: DemandeStatus;
    number: number;
    fees: number;
    statusText?: string | null;
    createdAt: any;
    updatedAt: any;
    collaborator: {
      __typename?: 'User';
      id: string;
      firstName: string;
      lastName: string;
      balance?: number | null;
      totalDemandeAmount: number;
      salary?: number | null;
      authorizedAdvance: number;
      bankAccountNumber?: string | null;
      uniqueIdentifier?: string | null;
    };
  }>;
};

export type FetchPaginatedOrganizationDemandesQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
}>;

export type FetchPaginatedOrganizationDemandesQuery = {
  __typename?: 'Query';
  fetchPaginatedOrganizationDemandes: {
    __typename?: 'PaginatedDemandeResult';
    pagination: {
      __typename?: 'PaginationInfo';
      totalItems: number;
      pageCount: number;
      currentPage: number;
      pageSize: number;
    };
    results: Array<{
      __typename?: 'Demande';
      id: string;
      amount: number;
      status: DemandeStatus;
      number: number;
      fees: number;
      statusText?: string | null;
      createdAt: any;
      updatedAt: any;
      collaborator: {
        __typename?: 'User';
        id: string;
        firstName: string;
        lastName: string;
        balance?: number | null;
        totalDemandeAmount: number;
        salary?: number | null;
        authorizedAdvance: number;
        bankAccountNumber?: string | null;
        uniqueIdentifier?: string | null;
      };
    }>;
  };
};

export type ValidateDemandeMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
}>;

export type ValidateDemandeMutation = {
  __typename?: 'Mutation';
  validateDemande: boolean;
};

export type PayeDemandeMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
}>;

export type PayeDemandeMutation = {
  __typename?: 'Mutation';
  payeDemande: boolean;
};

export type CancelDemandeByAdminMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
}>;

export type CancelDemandeByAdminMutation = {
  __typename?: 'Mutation';
  cancelDemandeByAdmin: boolean;
};

export type RejectDemandeByAdminMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
  rejectedReason: Scalars['String']['input'];
}>;

export type RejectDemandeByAdminMutation = {
  __typename?: 'Mutation';
  rejectDemandeByAdmin: boolean;
};

export type FetchCountStatusQueryVariables = Exact<{ [key: string]: never }>;

export type FetchCountStatusQuery = {
  __typename?: 'Query';
  fectchCountStatus: {
    __typename?: 'CountStatusDemande';
    pending: number;
    validated: number;
    rejected: number;
    payed: number;
  };
};

export type UpdateMyAdminPasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;

export type UpdateMyAdminPasswordMutation = {
  __typename?: 'Mutation';
  updateMyAdminPassword: boolean;
};

export type FetchCurrentAdminQueryVariables = Exact<{ [key: string]: never }>;

export type FetchCurrentAdminQuery = {
  __typename?: 'Query';
  fetchCurrentAdmin: {
    __typename?: 'User';
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    address?: string | null;
    role?: string | null;
    position?: string | null;
    enableEmailNotification?: boolean | null;
    organization: {
      __typename?: 'Organization';
      id: string;
      name: string;
      maxDemandeAmount: number;
      amountPercent: number;
      fees: number;
      demandeDeadlineDay?: number | null;
    };
  };
};

export type UpdateMyAdminProfileMutationVariables = Exact<{
  userInput: UpdateMyAdminProfileInput;
}>;

export type UpdateMyAdminProfileMutation = {
  __typename?: 'Mutation';
  updateMyAdminProfile: boolean;
};

export type LockUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;

export type LockUserMutation = { __typename?: 'Mutation'; lockUser: boolean };

export type UnlockUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;

export type UnlockUserMutation = {
  __typename?: 'Mutation';
  unlockUser: boolean;
};

export type EnableEmailNotificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;

export type EnableEmailNotificationMutation = {
  __typename?: 'Mutation';
  enableEmailNotification: boolean;
};

export type DisableEmailNotificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;

export type DisableEmailNotificationMutation = {
  __typename?: 'Mutation';
  disableEmailNotification: boolean;
};

export type FetchSupportPaiementQueryVariables = Exact<{
  [key: string]: never;
}>;

export type FetchSupportPaiementQuery = {
  __typename?: 'Query';
  fetchSupportPaiement: Array<{
    __typename?: 'SupportPaiement';
    amount: number;
    owner: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    uniqueIdentifier: string;
  }>;
};

export type BankAccountNumberExistsQueryVariables = Exact<{
  bankAccountNumber: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
}>;

export type BankAccountNumberExistsQuery = {
  __typename?: 'Query';
  bankAccountNumberExists: boolean;
};

export type PhoneNumberExistsQueryVariables = Exact<{
  phoneNumber: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
}>;

export type PhoneNumberExistsQuery = {
  __typename?: 'Query';
  phoneNumberExists: boolean;
};

export type UniqueIdentifierExistsQueryVariables = Exact<{
  uniqueIdentifier: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
}>;

export type UniqueIdentifierExistsQuery = {
  __typename?: 'Query';
  uniqueIdentifierExists: boolean;
};

export type EmailExistsQueryVariables = Exact<{
  email: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
}>;

export type EmailExistsQuery = { __typename?: 'Query'; emailExists: boolean };

export const LoginAdminDocument = gql`
  query LoginAdmin($loginInput: LoginInput!) {
    loginAdmin(loginInput: $loginInput) {
      user {
        id
        firstName
        lastName
        organization {
          id
          rootEmail
          name
        }
      }
      enabled
      token
      access_token
      refresh_token
      expires_in
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoginAdminGQL extends Apollo.Query<
  LoginAdminQuery,
  LoginAdminQueryVariables
> {
  document = LoginAdminDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ResetAdminPasswordDocument = gql`
  mutation ResetAdminPassword($resetPasswordInput: ResetPasswordInput!) {
    resetAdminPassword(resetPasswordInput: $resetPasswordInput)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ResetAdminPasswordGQL extends Apollo.Mutation<
  ResetAdminPasswordMutation,
  ResetAdminPasswordMutationVariables
> {
  document = ResetAdminPasswordDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const StartForgotPasswordDocument = gql`
  mutation StartForgotPassword($email: String!) {
    startForgotPassword(email: $email)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class StartForgotPasswordGQL extends Apollo.Mutation<
  StartForgotPasswordMutation,
  StartForgotPasswordMutationVariables
> {
  document = StartForgotPasswordDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FinalizeForgotPasswordDocument = gql`
  mutation FinalizeForgotPassword(
    $finalizeForgotPasswordInput: FinalizeForgotPasswordInput!
  ) {
    finalizeForgotPassword(
      finalizeForgotPasswordInput: $finalizeForgotPasswordInput
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FinalizeForgotPasswordGQL extends Apollo.Mutation<
  FinalizeForgotPasswordMutation,
  FinalizeForgotPasswordMutationVariables
> {
  document = FinalizeForgotPasswordDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchPaginatedActivitiesDocument = gql`
  query FetchPaginatedActivities($queryFilter: QueryDataConfigInput) {
    fetchPaginatedActivities(queryFilter: $queryFilter) {
      pagination {
        totalItems
        pageCount
        currentPage
        pageSize
      }
      results {
        id
        message
        scope
        user {
          id
          firstName
          lastName
          email
        }
        createdAt
        updatedAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPaginatedActivitiesGQL extends Apollo.Query<
  FetchPaginatedActivitiesQuery,
  FetchPaginatedActivitiesQueryVariables
> {
  document = FetchPaginatedActivitiesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchOrganizationAdminsDocument = gql`
  query FetchOrganizationAdmins {
    fetchOrganizationAdmins {
      id
      firstName
      lastName
      email
      phoneNumber
      uniqueIdentifier
      address
      salary
      blocked
      balance
      totalDemandeAmount
      wizallAccountNumber
      bankAccountNumber
      position
      authorizedAdvance
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchOrganizationAdminsGQL extends Apollo.Query<
  FetchOrganizationAdminsQuery,
  FetchOrganizationAdminsQueryVariables
> {
  document = FetchOrganizationAdminsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const InviteAdminDocument = gql`
  mutation InviteAdmin($adminInput: InviteCollaboratorInput!) {
    inviteAdmin(admin: $adminInput)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class InviteAdminGQL extends Apollo.Mutation<
  InviteAdminMutation,
  InviteAdminMutationVariables
> {
  document = InviteAdminDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchPaginatedOrganisationAdminsDocument = gql`
  query FetchPaginatedOrganisationAdmins(
    $metricsInput: DemandesMetricsInput
    $queryFilter: QueryDataConfigInput
  ) {
    fetchPaginatedOrganisationAdmins(
      metricsInput: $metricsInput
      queryFilter: $queryFilter
    ) {
      pagination {
        totalItems
        pageCount
        currentPage
        pageSize
      }
      results {
        id
        firstName
        lastName
        email
        phoneNumber
        uniqueIdentifier
        address
        salary
        blocked
        balance
        totalDemandeAmount
        wizallAccountNumber
        bankAccountNumber
        position
        authorizedAdvance
        createdAt
        updatedAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPaginatedOrganisationAdminsGQL extends Apollo.Query<
  FetchPaginatedOrganisationAdminsQuery,
  FetchPaginatedOrganisationAdminsQueryVariables
> {
  document = FetchPaginatedOrganisationAdminsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchOrganizationCollaboratorsDocument = gql`
  query FetchOrganizationCollaborators($metricsInput: DemandesMetricsInput) {
    fetchOrganizationCollaborators(metricsInput: $metricsInput) {
      id
      firstName
      lastName
      email
      phoneNumber
      uniqueIdentifier
      address
      salary
      balance
      totalDemandeAmount
      wizallAccountNumber
      bankAccountNumber
      position
      authorizedAdvance
      createdAt
      updatedAt
      blocked
      favoriteWallet
      birthDate
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchOrganizationCollaboratorsGQL extends Apollo.Query<
  FetchOrganizationCollaboratorsQuery,
  FetchOrganizationCollaboratorsQueryVariables
> {
  document = FetchOrganizationCollaboratorsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchPaginatedOrganizationCollaboratorsDocument = gql`
  query FetchPaginatedOrganizationCollaborators(
    $metricsInput: DemandesMetricsInput
    $queryFilter: QueryDataConfigInput
  ) {
    fetchPaginatedOrganizationCollaborators(
      metricsInput: $metricsInput
      queryFilter: $queryFilter
    ) {
      pagination {
        totalItems
        pageCount
        currentPage
        pageSize
      }
      results {
        id
        firstName
        lastName
        email
        phoneNumber
        uniqueIdentifier
        address
        salary
        balance
        totalDemandeAmount
        wizallAccountNumber
        bankAccountNumber
        position
        authorizedAdvance
        createdAt
        updatedAt
        blocked
        favoriteWallet
        birthDate
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPaginatedOrganizationCollaboratorsGQL extends Apollo.Query<
  FetchPaginatedOrganizationCollaboratorsQuery,
  FetchPaginatedOrganizationCollaboratorsQueryVariables
> {
  document = FetchPaginatedOrganizationCollaboratorsDocument;

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
  providedIn: 'root',
})
export class InviteCollaboratorGQL extends Apollo.Mutation<
  InviteCollaboratorMutation,
  InviteCollaboratorMutationVariables
> {
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
      favoriteWallet
      birthDate
      blocked
      organization {
        name
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchOrganizationCollaboratorGQL extends Apollo.Query<
  FetchOrganizationCollaboratorQuery,
  FetchOrganizationCollaboratorQueryVariables
> {
  document = FetchOrganizationCollaboratorDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateCollaboratorDocument = gql`
  mutation UpdateCollaborator(
    $collaboratorInput: UpdateCollaboratorInput!
    $collaboratorId: String!
  ) {
    updateCollaborator(
      collaborator: $collaboratorInput
      collaboratorId: $collaboratorId
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateCollaboratorGQL extends Apollo.Mutation<
  UpdateCollaboratorMutation,
  UpdateCollaboratorMutationVariables
> {
  document = UpdateCollaboratorDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchOrganizationNotificationsDocument = gql`
  query FetchOrganizationNotifications {
    fetchOrganizationNotifications {
      entityId
      title
      content
      author {
        firstName
        lastName
      }
      viewedByMe
      organization
      date: createdAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchOrganizationNotificationsGQL extends Apollo.Query<
  FetchOrganizationNotificationsQuery,
  FetchOrganizationNotificationsQueryVariables
> {
  document = FetchOrganizationNotificationsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ViewOrganizationNotificationsDocument = gql`
  mutation ViewOrganizationNotifications {
    viewOrganizationNotifications
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ViewOrganizationNotificationsGQL extends Apollo.Mutation<
  ViewOrganizationNotificationsMutation,
  ViewOrganizationNotificationsMutationVariables
> {
  document = ViewOrganizationNotificationsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchPaginatedNotificationsDocument = gql`
  query FetchPaginatedNotifications(
    $metricsInput: DemandesMetricsInput
    $queryFilter: QueryDataConfigInput
  ) {
    fetchPaginatedNotifications(
      metricsInput: $metricsInput
      queryFilter: $queryFilter
    ) {
      pagination {
        totalItems
        pageCount
        currentPage
        pageSize
      }
      results {
        entityId
        title
        content
        author {
          firstName
          lastName
        }
        viewedByMe
        organization
        date: createdAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPaginatedNotificationsGQL extends Apollo.Query<
  FetchPaginatedNotificationsQuery,
  FetchPaginatedNotificationsQueryVariables
> {
  document = FetchPaginatedNotificationsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateOrganizationDocument = gql`
  mutation UpdateOrganization(
    $organizationId: ID!
    $organizationInput: OrganizationUpdateInput!
  ) {
    updateOrganization(
      organizationId: $organizationId
      organizationInput: $organizationInput
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateOrganizationGQL extends Apollo.Mutation<
  UpdateOrganizationMutation,
  UpdateOrganizationMutationVariables
> {
  document = UpdateOrganizationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchDemandesMetricsDocument = gql`
  query FetchDemandesMetrics($metricsInput: DemandesMetricsInput!) {
    fetchDemandesMetrics(metricsInput: $metricsInput) {
      remaining {
        y: amount
        x: date
      }
      total {
        y: amount
        x: date
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchDemandesMetricsGQL extends Apollo.Query<
  FetchDemandesMetricsQuery,
  FetchDemandesMetricsQueryVariables
> {
  document = FetchDemandesMetricsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchOrganizationDemandesDocument = gql`
  query FetchOrganizationDemandes($metricsInput: DemandesMetricsInput) {
    fetchOrganizationDemandes(metricsInput: $metricsInput) {
      id
      amount
      status
      number
      fees
      statusText
      collaborator {
        id
        firstName
        lastName
        balance
        totalDemandeAmount
        salary
        authorizedAdvance
        bankAccountNumber
        uniqueIdentifier
      }
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchOrganizationDemandesGQL extends Apollo.Query<
  FetchOrganizationDemandesQuery,
  FetchOrganizationDemandesQueryVariables
> {
  document = FetchOrganizationDemandesDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchPaginatedOrganizationDemandesDocument = gql`
  query FetchPaginatedOrganizationDemandes(
    $metricsInput: DemandesMetricsInput
    $queryFilter: QueryDataConfigInput
  ) {
    fetchPaginatedOrganizationDemandes(
      metricsInput: $metricsInput
      queryFilter: $queryFilter
    ) {
      pagination {
        totalItems
        pageCount
        currentPage
        pageSize
      }
      results {
        id
        amount
        status
        number
        fees
        statusText
        collaborator {
          id
          firstName
          lastName
          balance
          totalDemandeAmount
          salary
          authorizedAdvance
          bankAccountNumber
          uniqueIdentifier
        }
        createdAt
        updatedAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchPaginatedOrganizationDemandesGQL extends Apollo.Query<
  FetchPaginatedOrganizationDemandesQuery,
  FetchPaginatedOrganizationDemandesQueryVariables
> {
  document = FetchPaginatedOrganizationDemandesDocument;

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
  providedIn: 'root',
})
export class ValidateDemandeGQL extends Apollo.Mutation<
  ValidateDemandeMutation,
  ValidateDemandeMutationVariables
> {
  document = ValidateDemandeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const PayeDemandeDocument = gql`
  mutation PayeDemande($demandeId: ID!) {
    payeDemande(demandeId: $demandeId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PayeDemandeGQL extends Apollo.Mutation<
  PayeDemandeMutation,
  PayeDemandeMutationVariables
> {
  document = PayeDemandeDocument;

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
  providedIn: 'root',
})
export class CancelDemandeByAdminGQL extends Apollo.Mutation<
  CancelDemandeByAdminMutation,
  CancelDemandeByAdminMutationVariables
> {
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
  providedIn: 'root',
})
export class RejectDemandeByAdminGQL extends Apollo.Mutation<
  RejectDemandeByAdminMutation,
  RejectDemandeByAdminMutationVariables
> {
  document = RejectDemandeByAdminDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchCountStatusDocument = gql`
  query FetchCountStatus {
    fectchCountStatus {
      pending
      validated
      rejected
      payed
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchCountStatusGQL extends Apollo.Query<
  FetchCountStatusQuery,
  FetchCountStatusQueryVariables
> {
  document = FetchCountStatusDocument;

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
  providedIn: 'root',
})
export class UpdateMyAdminPasswordGQL extends Apollo.Mutation<
  UpdateMyAdminPasswordMutation,
  UpdateMyAdminPasswordMutationVariables
> {
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
      role
      position
      enableEmailNotification
      organization {
        id
        name
        maxDemandeAmount
        amountPercent
        fees
        demandeDeadlineDay
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchCurrentAdminGQL extends Apollo.Query<
  FetchCurrentAdminQuery,
  FetchCurrentAdminQueryVariables
> {
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
  providedIn: 'root',
})
export class UpdateMyAdminProfileGQL extends Apollo.Mutation<
  UpdateMyAdminProfileMutation,
  UpdateMyAdminProfileMutationVariables
> {
  document = UpdateMyAdminProfileDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const LockUserDocument = gql`
  mutation LockUser($userId: String!) {
    lockUser(userId: $userId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LockUserGQL extends Apollo.Mutation<
  LockUserMutation,
  LockUserMutationVariables
> {
  document = LockUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UnlockUserDocument = gql`
  mutation UnlockUser($userId: String!) {
    unlockUser(userId: $userId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UnlockUserGQL extends Apollo.Mutation<
  UnlockUserMutation,
  UnlockUserMutationVariables
> {
  document = UnlockUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const EnableEmailNotificationDocument = gql`
  mutation EnableEmailNotification($userId: String!) {
    enableEmailNotification(userId: $userId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EnableEmailNotificationGQL extends Apollo.Mutation<
  EnableEmailNotificationMutation,
  EnableEmailNotificationMutationVariables
> {
  document = EnableEmailNotificationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DisableEmailNotificationDocument = gql`
  mutation DisableEmailNotification($userId: String!) {
    disableEmailNotification(userId: $userId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DisableEmailNotificationGQL extends Apollo.Mutation<
  DisableEmailNotificationMutation,
  DisableEmailNotificationMutationVariables
> {
  document = DisableEmailNotificationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const FetchSupportPaiementDocument = gql`
  query FetchSupportPaiement {
    fetchSupportPaiement {
      amount
      owner
      firstName
      lastName
      phoneNumber
      email
      uniqueIdentifier
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class FetchSupportPaiementGQL extends Apollo.Query<
  FetchSupportPaiementQuery,
  FetchSupportPaiementQueryVariables
> {
  document = FetchSupportPaiementDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const BankAccountNumberExistsDocument = gql`
  query BankAccountNumberExists(
    $bankAccountNumber: String!
    $isAdmin: Boolean
    $userId: String
  ) {
    bankAccountNumberExists(
      bankAccountNumber: $bankAccountNumber
      isAdmin: $isAdmin
      userId: $userId
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class BankAccountNumberExistsGQL extends Apollo.Query<
  BankAccountNumberExistsQuery,
  BankAccountNumberExistsQueryVariables
> {
  document = BankAccountNumberExistsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const PhoneNumberExistsDocument = gql`
  query PhoneNumberExists(
    $phoneNumber: String!
    $isAdmin: Boolean
    $userId: String
  ) {
    phoneNumberExists(
      phoneNumber: $phoneNumber
      isAdmin: $isAdmin
      userId: $userId
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PhoneNumberExistsGQL extends Apollo.Query<
  PhoneNumberExistsQuery,
  PhoneNumberExistsQueryVariables
> {
  document = PhoneNumberExistsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UniqueIdentifierExistsDocument = gql`
  query UniqueIdentifierExists(
    $uniqueIdentifier: String!
    $isAdmin: Boolean
    $userId: String
  ) {
    uniqueIdentifierExists(
      uniqueIdentifier: $uniqueIdentifier
      isAdmin: $isAdmin
      userId: $userId
    )
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UniqueIdentifierExistsGQL extends Apollo.Query<
  UniqueIdentifierExistsQuery,
  UniqueIdentifierExistsQueryVariables
> {
  document = UniqueIdentifierExistsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const EmailExistsDocument = gql`
  query EmailExists($email: String!, $isAdmin: Boolean, $userId: String) {
    emailExists(email: $email, isAdmin: $isAdmin, userId: $userId)
  }
`;

@Injectable({
  providedIn: 'root',
})
export class EmailExistsGQL extends Apollo.Query<
  EmailExistsQuery,
  EmailExistsQueryVariables
> {
  document = EmailExistsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
