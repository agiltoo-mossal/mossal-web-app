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
  /** Any type */
  Any: { input: any; output: any; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  _Any: { input: any; output: any; }
  federation__FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
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
  Organisation = 'organisation'
}

export enum AmountUnit {
  Fixed = 'Fixed',
  Percentage = 'Percentage'
}

export type CategorySociopro = {
  __typename?: 'CategorySociopro';
  activated?: Maybe<Scalars['Boolean']['output']>;
  addedBy?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Any']['output'];
  organisation: Organization;
  organizationId?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CategorySocioproInput = {
  activated?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CategorySocioproService = {
  __typename?: 'CategorySocioproService';
  activated: Scalars['Boolean']['output'];
  activatedAt?: Maybe<Scalars['DateTime']['output']>;
  amount: Scalars['Int']['output'];
  amountUnit: AmountUnit;
  autoValidate: Scalars['Boolean']['output'];
  categorySociopro?: Maybe<CategorySociopro>;
  categorySocioproId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  event?: Maybe<Event>;
  eventId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Any']['output'];
  organisationService?: Maybe<OrganisationService>;
  organisationServiceId: Scalars['String']['output'];
  refundDuration: Scalars['Int']['output'];
  refundDurationUnit: DurationUnit;
  updatedAt: Scalars['DateTime']['output'];
};

export type CategorySocioproServiceInput = {
  activated: Scalars['Boolean']['input'];
  activatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  amount?: InputMaybe<Scalars['Int']['input']>;
  amountUnit?: InputMaybe<AmountUnit>;
  autoValidate?: InputMaybe<Scalars['Boolean']['input']>;
  refundDuration: Scalars['Int']['input'];
  refundDurationUnit?: InputMaybe<DurationUnit>;
};

export type CategorySocioproServiceUpdateInput = {
  activated?: InputMaybe<Scalars['Boolean']['input']>;
  activatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  amount?: InputMaybe<Scalars['Int']['input']>;
  amountUnit?: InputMaybe<AmountUnit>;
  autoValidate?: InputMaybe<Scalars['Boolean']['input']>;
  refundDuration?: InputMaybe<Scalars['Int']['input']>;
  refundDurationUnit?: InputMaybe<DurationUnit>;
};

export type CategorySocioproUpdateInput = {
  activated?: InputMaybe<Scalars['Boolean']['input']>;
  activatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CountStatusDemande = {
  __typename?: 'CountStatusDemande';
  cancelled: Scalars['Float']['output'];
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
  organisationService?: Maybe<OrganisationService>;
  refundDuration: Scalars['Float']['output'];
  rejectedReason?: Maybe<Scalars['String']['output']>;
  remainingRefundAmount?: Maybe<Scalars['Float']['output']>;
  remboursements?: Maybe<Array<Remboursement>>;
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
  Validated = 'VALIDATED'
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

export enum DurationUnit {
  Day = 'Day',
  Month = 'Month'
}

export type Event = {
  __typename?: 'Event';
  activated: Scalars['Boolean']['output'];
  activatedAt?: Maybe<Scalars['DateTime']['output']>;
  addedBy?: Maybe<Scalars['String']['output']>;
  amount: Scalars['Int']['output'];
  amountUnit: AmountUnit;
  autoValidate: Scalars['Boolean']['output'];
  categorySocioproServices?: Maybe<Array<CategorySocioproService>>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['Any']['output'];
  organisationService: OrganisationService;
  refundDuration: Scalars['Int']['output'];
  refundDurationUnit: DurationUnit;
  startDate: Scalars['DateTime']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type EventInput = {
  activated?: InputMaybe<Scalars['Boolean']['input']>;
  activatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  amount?: InputMaybe<Scalars['Int']['input']>;
  amountUnit?: InputMaybe<AmountUnit>;
  autoValidate?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  refundDuration: Scalars['Int']['input'];
  refundDurationUnit?: InputMaybe<DurationUnit>;
  startDate: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
};

export type EventUpdateInput = {
  activated?: InputMaybe<Scalars['Boolean']['input']>;
  activatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  amount?: InputMaybe<Scalars['Int']['input']>;
  amountUnit?: InputMaybe<AmountUnit>;
  autoValidate?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  refundDuration?: InputMaybe<Scalars['Int']['input']>;
  refundDurationUnit?: InputMaybe<DurationUnit>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  activateCategorySociopro: Scalars['Boolean']['output'];
  activateCategorySocioproService: Scalars['Boolean']['output'];
  activateEvent: Scalars['Boolean']['output'];
  activateOrganisationService: Scalars['Boolean']['output'];
  activateService: Scalars['Boolean']['output'];
  cancelDemandeByAdmin: Scalars['Boolean']['output'];
  createCategorySociopro: CategorySociopro;
  createCategorySocioproService: CategorySocioproService;
  createEvent: Event;
  createFinancialOrganization: Organization;
  createOrganisationService: OrganisationService;
  createOrganization: Organization;
  createService: Service;
  deactivateCategorySociopro: Scalars['Boolean']['output'];
  deactivateCategorySocioproService: Scalars['Boolean']['output'];
  deactivateEvent: Scalars['Boolean']['output'];
  deactivateOrganisationService: Scalars['Boolean']['output'];
  deactivateService: Scalars['Boolean']['output'];
  deleteCategorySociopro: Scalars['Boolean']['output'];
  deleteCategorySocioproService: Scalars['Boolean']['output'];
  deleteEvent: Scalars['Boolean']['output'];
  deleteOrganisationService: Scalars['Boolean']['output'];
  deleteService: Scalars['Boolean']['output'];
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
  updateCategorySociopro: Scalars['Boolean']['output'];
  updateCategorySocioproService: Scalars['Boolean']['output'];
  updateCollaborator: Scalars['Boolean']['output'];
  updateEvent: Scalars['Boolean']['output'];
  updateMyAdminPassword: Scalars['Boolean']['output'];
  updateMyAdminProfile: Scalars['Boolean']['output'];
  updateOrganisationService: Scalars['Boolean']['output'];
  updateOrganization: Scalars['Boolean']['output'];
  updateService: Scalars['Boolean']['output'];
  upladFile: Scalars['Boolean']['output'];
  validateDemande: Scalars['Boolean']['output'];
  validateRemboursement: Scalars['Boolean']['output'];
  viewOrganizationNotifications: Scalars['Boolean']['output'];
};


export type MutationActivateCategorySocioproArgs = {
  activatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  categorySocioproId: Scalars['ID']['input'];
};


export type MutationActivateCategorySocioproServiceArgs = {
  categorySocioproServiceId: Scalars['ID']['input'];
};


export type MutationActivateEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationActivateOrganisationServiceArgs = {
  organisationServiceId: Scalars['ID']['input'];
};


export type MutationActivateServiceArgs = {
  serviceId: Scalars['ID']['input'];
};


export type MutationCancelDemandeByAdminArgs = {
  demandeId: Scalars['ID']['input'];
};


export type MutationCreateCategorySocioproArgs = {
  categorySocioproInput: CategorySocioproInput;
  organizationId: Scalars['ID']['input'];
};


export type MutationCreateCategorySocioproServiceArgs = {
  categorySocioproId: Scalars['ID']['input'];
  categorySocioproServiceInput: CategorySocioproServiceInput;
  eventId?: InputMaybe<Scalars['ID']['input']>;
  organisationServiceId: Scalars['ID']['input'];
};


export type MutationCreateEventArgs = {
  eventInput: EventInput;
  organizationServiceId: Scalars['ID']['input'];
};


export type MutationCreateFinancialOrganizationArgs = {
  organizationInput: OrganizationInput;
};


export type MutationCreateOrganisationServiceArgs = {
  organisationId: Scalars['ID']['input'];
  organisationServiceInput: OrganisationServiceInput;
  serviceId: Scalars['ID']['input'];
};


export type MutationCreateOrganizationArgs = {
  organizationInput: OrganizationInput;
};


export type MutationCreateServiceArgs = {
  serviceInput: ServiceInput;
};


export type MutationDeactivateCategorySocioproArgs = {
  categorySocioproId: Scalars['ID']['input'];
};


export type MutationDeactivateCategorySocioproServiceArgs = {
  categorySocioproServiceId: Scalars['ID']['input'];
};


export type MutationDeactivateEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationDeactivateOrganisationServiceArgs = {
  organisationServiceId: Scalars['ID']['input'];
};


export type MutationDeactivateServiceArgs = {
  serviceId: Scalars['ID']['input'];
};


export type MutationDeleteCategorySocioproArgs = {
  categorySocioproId: Scalars['ID']['input'];
};


export type MutationDeleteCategorySocioproServiceArgs = {
  categorySocioproServiceId: Scalars['ID']['input'];
};


export type MutationDeleteEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type MutationDeleteOrganisationServiceArgs = {
  organisationServiceId: Scalars['ID']['input'];
};


export type MutationDeleteServiceArgs = {
  serviceId: Scalars['ID']['input'];
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
  categorySocioProId?: InputMaybe<Scalars['String']['input']>;
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


export type MutationUpdateCategorySocioproArgs = {
  categorySocioproId: Scalars['ID']['input'];
  categorySocioproInput: CategorySocioproUpdateInput;
};


export type MutationUpdateCategorySocioproServiceArgs = {
  categorySocioproServiceId: Scalars['ID']['input'];
  categorySocioproServiceInput: CategorySocioproServiceUpdateInput;
};


export type MutationUpdateCollaboratorArgs = {
  categorySocioProId?: InputMaybe<Scalars['String']['input']>;
  collaborator: UpdateCollaboratorInput;
  collaboratorId: Scalars['String']['input'];
};


export type MutationUpdateEventArgs = {
  eventId: Scalars['ID']['input'];
  eventInput: EventUpdateInput;
};


export type MutationUpdateMyAdminPasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationUpdateMyAdminProfileArgs = {
  userInput: UpdateMyAdminProfileInput;
};


export type MutationUpdateOrganisationServiceArgs = {
  organisationServiceId: Scalars['ID']['input'];
  organisationServiceInput: OrganisationServiceUpdateInput;
};


export type MutationUpdateOrganizationArgs = {
  organizationId: Scalars['ID']['input'];
  organizationInput: OrganizationUpdateInput;
};


export type MutationUpdateServiceArgs = {
  serviceId: Scalars['ID']['input'];
  serviceInput: ServiceUpdateInput;
};


export type MutationUpladFileArgs = {
  destination: Scalars['String']['input'];
  file: Scalars['String']['input'];
};


export type MutationValidateDemandeArgs = {
  demandeId: Scalars['ID']['input'];
};


export type MutationValidateRemboursementArgs = {
  remboursementId: Scalars['ID']['input'];
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
  Desc = 'DESC'
}

export type OrderByInput = {
  direction: OrderByDirection;
  property: Scalars['String']['input'];
};

export type OrganisationService = {
  __typename?: 'OrganisationService';
  activated: Scalars['Boolean']['output'];
  activatedAt?: Maybe<Scalars['DateTime']['output']>;
  activationDurationDay: Scalars['Int']['output'];
  amount?: Maybe<Scalars['Int']['output']>;
  amountUnit: AmountUnit;
  autoValidate: Scalars['Boolean']['output'];
  categoriesocioproservices?: Maybe<Array<CategorySocioproService>>;
  createdAt: Scalars['DateTime']['output'];
  demandes?: Maybe<Array<Demande>>;
  events?: Maybe<Array<Event>>;
  id: Scalars['Any']['output'];
  organization: Organization;
  organizationId: Scalars['String']['output'];
  refundDuration: Scalars['Int']['output'];
  refundDurationUnit: DurationUnit;
  service: Service;
  serviceId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type OrganisationServiceInput = {
  activated?: InputMaybe<Scalars['Boolean']['input']>;
  activatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  activationDurationDay?: InputMaybe<Scalars['Int']['input']>;
  amount?: InputMaybe<Scalars['Int']['input']>;
  amountUnit?: InputMaybe<AmountUnit>;
  autoValidate?: InputMaybe<Scalars['Boolean']['input']>;
  refundDuration?: InputMaybe<Scalars['Int']['input']>;
  refundDurationUnit?: InputMaybe<DurationUnit>;
};

export type OrganisationServiceUpdateInput = {
  activated?: InputMaybe<Scalars['Boolean']['input']>;
  activatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  activationDurationDay?: InputMaybe<Scalars['Int']['input']>;
  amount?: InputMaybe<Scalars['Int']['input']>;
  amountUnit?: InputMaybe<AmountUnit>;
  autoValidate?: InputMaybe<Scalars['Boolean']['input']>;
  refundDuration?: InputMaybe<Scalars['Int']['input']>;
  refundDurationUnit?: InputMaybe<DurationUnit>;
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
  organisationService?: Maybe<Array<OrganisationService>>;
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

export type PaginatedCategorySocioproResult = {
  __typename?: 'PaginatedCategorySocioproResult';
  pagination: PaginationInfo;
  results: Array<CategorySociopro>;
};

export type PaginatedCategorySocioproServiceResult = {
  __typename?: 'PaginatedCategorySocioproServiceResult';
  pagination: PaginationInfo;
  results: Array<CategorySocioproService>;
};

export type PaginatedDemandeResult = {
  __typename?: 'PaginatedDemandeResult';
  pagination: PaginationInfo;
  results: Array<Demande>;
};

export type PaginatedEventResult = {
  __typename?: 'PaginatedEventResult';
  pagination: PaginationInfo;
  results: Array<Event>;
};

export type PaginatedNotificationResult = {
  __typename?: 'PaginatedNotificationResult';
  pagination: PaginationInfo;
  results: Array<Notification>;
};

export type PaginatedOrganisationServiceResult = {
  __typename?: 'PaginatedOrganisationServiceResult';
  pagination: PaginationInfo;
  results: Array<OrganisationService>;
};

export type PaginatedServiceResult = {
  __typename?: 'PaginatedServiceResult';
  pagination: PaginationInfo;
  results: Array<Service>;
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
  fetchAccountantData: Array<Demande>;
  fetchActivity: Activity;
  fetchAllCategorySocioproServices: Array<CategorySocioproService>;
  fetchAllCategorySociopros: Array<CategorySociopro>;
  fetchAllEvents: Array<Event>;
  fetchAllOrganisationServices: Array<OrganisationService>;
  fetchAllRemboursements: Array<Remboursement>;
  fetchAllServices: Array<Service>;
  fetchCategorySociopro: CategorySociopro;
  fetchCategorySocioproService: CategorySocioproService;
  fetchCategorySocioproServices: PaginatedCategorySocioproServiceResult;
  fetchCategorySociopros: PaginatedCategorySocioproResult;
  fetchCollaboratorCount: Scalars['Float']['output'];
  fetchCountStatus: CountStatusDemande;
  fetchCurrentAdmin: User;
  fetchDemandesByCollaborator: Array<Demande>;
  fetchDemandesMetrics: DemandesMetrics;
  fetchEvent: Event;
  fetchEvents: PaginatedEventResult;
  fetchOrganisationService: OrganisationService;
  fetchOrganisationServiceByOrganisationIdAndServiceId?: Maybe<OrganisationService>;
  fetchOrganisationServices: PaginatedOrganisationServiceResult;
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
  fetchRemboursementByUserId: Array<Remboursement>;
  fetchRemboursementsByDemande: Array<Remboursement>;
  fetchService: Service;
  fetchServicePub: Service;
  fetchServices: PaginatedServiceResult;
  fetchServicesPub: PaginatedServiceResult;
  fetchSupportPaiement: Array<Demande>;
  fetchTotalDemandesAmount?: Maybe<Scalars['Float']['output']>;
  loginAdmin: Session;
  myRemboursements: Array<Remboursement>;
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


export type QueryFetchAllCategorySocioproServicesArgs = {
  organisationServiceId: Scalars['ID']['input'];
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchAllCategorySocioprosArgs = {
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchAllEventsArgs = {
  organizationServiceId: Scalars['ID']['input'];
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchAllOrganisationServicesArgs = {
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchAllServicesArgs = {
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchCategorySocioproArgs = {
  categorySocioproId: Scalars['ID']['input'];
};


export type QueryFetchCategorySocioproServiceArgs = {
  categorySocioproServiceId: Scalars['ID']['input'];
};


export type QueryFetchCategorySocioproServicesArgs = {
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchCategorySocioprosArgs = {
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchCollaboratorCountArgs = {
  filter?: InputMaybe<UserFilterInput>;
};


export type QueryFetchCountStatusArgs = {
  filter?: InputMaybe<DemandesMetricsInput>;
};


export type QueryFetchDemandesByCollaboratorArgs = {
  collaboratorId: Scalars['ID']['input'];
  status?: InputMaybe<DemandeStatus>;
};


export type QueryFetchDemandesMetricsArgs = {
  metricsInput: DemandesMetricsInput;
};


export type QueryFetchEventArgs = {
  eventId: Scalars['ID']['input'];
};


export type QueryFetchEventsArgs = {
  organizationServiceId: Scalars['ID']['input'];
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchOrganisationServiceArgs = {
  organisationServiceId: Scalars['ID']['input'];
};


export type QueryFetchOrganisationServiceByOrganisationIdAndServiceIdArgs = {
  organisationId: Scalars['ID']['input'];
  serviceId: Scalars['ID']['input'];
};


export type QueryFetchOrganisationServicesArgs = {
  queryConfig?: InputMaybe<QueryDataConfigInput>;
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
  hasPendingDemandes?: InputMaybe<Scalars['Boolean']['input']>;
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchPaginatedOrganizationDemandesArgs = {
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  organizationServiceId?: InputMaybe<Scalars['String']['input']>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchPaymentArgs = {
  paymentId: Scalars['ID']['input'];
};


export type QueryFetchRemboursementByUserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryFetchRemboursementsByDemandeArgs = {
  demandeId: Scalars['ID']['input'];
};


export type QueryFetchServiceArgs = {
  serviceId: Scalars['ID']['input'];
};


export type QueryFetchServicePubArgs = {
  serviceId: Scalars['String']['input'];
};


export type QueryFetchServicesArgs = {
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchServicesPubArgs = {
  queryConfig?: InputMaybe<QueryDataConfigInput>;
};


export type QueryFetchTotalDemandesAmountArgs = {
  filter?: InputMaybe<DemandesMetricsInput>;
  status?: InputMaybe<Array<DemandeStatus>>;
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

export type Remboursement = {
  __typename?: 'Remboursement';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  demande?: Maybe<Demande>;
  demandeId: Scalars['String']['output'];
  fees?: Maybe<Scalars['Float']['output']>;
  id: Scalars['ID']['output'];
  number: Scalars['Float']['output'];
  status: RemboursementStatus;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
  validatedAt?: Maybe<Scalars['DateTime']['output']>;
  validatedBy?: Maybe<User>;
};

export enum RemboursementStatus {
  Payed = 'PAYED',
  Pending = 'PENDING'
}

export type ResetPasswordInput = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Service = {
  __typename?: 'Service';
  addedBy?: Maybe<Scalars['String']['output']>;
  available: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Any']['output'];
  identifier: Scalars['String']['output'];
  publishedAt?: Maybe<Scalars['DateTime']['output']>;
  refundDurationMonth: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ServiceInput = {
  available: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  identifier: Scalars['String']['input'];
  refundDurationMonth: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type ServiceUpdateInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  identifier?: InputMaybe<Scalars['String']['input']>;
  refundDurationMonth?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  categorySociopro?: Maybe<CategorySociopro>;
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

export type UserFilterInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

/** Possible user role */
export enum UserRole {
  Admin = 'ADMIN',
  Collaborator = 'COLLABORATOR',
  SuperAdmin = 'SUPER_ADMIN',
  SuperAdminOrg = 'SUPER_ADMIN_ORG'
}

/** Possible wallets */
export enum Wallet {
  OrangeMoney = 'ORANGE_MONEY',
  Wave = 'WAVE'
}

export type _Entity = Demande | Organization | Remboursement;

export type _Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}

export type LoginAdminQueryVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginAdminQuery = { __typename?: 'Query', loginAdmin: { __typename?: 'Session', enabled: boolean, token?: string | null, access_token?: string | null, refresh_token?: string | null, expires_in?: number | null, user?: { __typename?: 'User', id: string, firstName: string, lastName: string, organization: { __typename?: 'Organization', id: string, rootEmail: string, name: string } } | null } };

export type ResetAdminPasswordMutationVariables = Exact<{
  resetPasswordInput: ResetPasswordInput;
}>;


export type ResetAdminPasswordMutation = { __typename?: 'Mutation', resetAdminPassword: boolean };

export type StartForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type StartForgotPasswordMutation = { __typename?: 'Mutation', startForgotPassword: boolean };

export type FinalizeForgotPasswordMutationVariables = Exact<{
  finalizeForgotPasswordInput: FinalizeForgotPasswordInput;
}>;


export type FinalizeForgotPasswordMutation = { __typename?: 'Mutation', finalizeForgotPassword: boolean };

export type FetchPaginatedActivitiesQueryVariables = Exact<{
  queryFilter?: InputMaybe<QueryDataConfigInput>;
}>;


export type FetchPaginatedActivitiesQuery = { __typename?: 'Query', fetchPaginatedActivities: { __typename?: 'PaginatedActivityResult', pagination: { __typename?: 'PaginationInfo', totalItems: number, pageCount: number, currentPage: number, pageSize: number }, results: Array<{ __typename?: 'Activity', id: string, message: string, scope: ActivityScope, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string } }> } };

export type FetchOrganizationAdminsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchOrganizationAdminsQuery = { __typename?: 'Query', fetchOrganizationAdmins: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, uniqueIdentifier?: string | null, address?: string | null, salary?: number | null, blocked?: boolean | null, balance?: number | null, totalDemandeAmount: number, wizallAccountNumber?: string | null, bankAccountNumber?: string | null, position?: string | null, authorizedAdvance: number, createdAt: any, updatedAt: any }> };

export type InviteAdminMutationVariables = Exact<{
  adminInput: InviteCollaboratorInput;
}>;


export type InviteAdminMutation = { __typename?: 'Mutation', inviteAdmin: boolean };

export type FetchPaginatedOrganisationAdminsQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
}>;


export type FetchPaginatedOrganisationAdminsQuery = { __typename?: 'Query', fetchPaginatedOrganisationAdmins: { __typename?: 'PaginatedUserResult', pagination: { __typename?: 'PaginationInfo', totalItems: number, pageCount: number, currentPage: number, pageSize: number }, results: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, uniqueIdentifier?: string | null, address?: string | null, salary?: number | null, blocked?: boolean | null, balance?: number | null, totalDemandeAmount: number, wizallAccountNumber?: string | null, bankAccountNumber?: string | null, position?: string | null, authorizedAdvance: number, createdAt: any, updatedAt: any }> } };

export type FetchOrganizationCollaboratorsQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
}>;


export type FetchOrganizationCollaboratorsQuery = { __typename?: 'Query', fetchOrganizationCollaborators: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, uniqueIdentifier?: string | null, address?: string | null, salary?: number | null, balance?: number | null, totalDemandeAmount: number, wizallAccountNumber?: string | null, bankAccountNumber?: string | null, position?: string | null, authorizedAdvance: number, createdAt: any, updatedAt: any, blocked?: boolean | null, favoriteWallet?: Wallet | null, birthDate?: any | null }> };

export type FetchPaginatedOrganizationCollaboratorsQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
  hasPendingDemandes?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type FetchPaginatedOrganizationCollaboratorsQuery = { __typename?: 'Query', fetchPaginatedOrganizationCollaborators: { __typename?: 'PaginatedUserResult', pagination: { __typename?: 'PaginationInfo', totalItems: number, pageCount: number, currentPage: number, pageSize: number }, results: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, uniqueIdentifier?: string | null, address?: string | null, salary?: number | null, balance?: number | null, totalDemandeAmount: number, wizallAccountNumber?: string | null, bankAccountNumber?: string | null, position?: string | null, authorizedAdvance: number, createdAt: any, updatedAt: any, blocked?: boolean | null, favoriteWallet?: Wallet | null, birthDate?: any | null }> } };

export type InviteCollaboratorMutationVariables = Exact<{
  collaboratorInput: InviteCollaboratorInput;
  categorySocioProId?: InputMaybe<Scalars['String']['input']>;
}>;


export type InviteCollaboratorMutation = { __typename?: 'Mutation', inviteCollaborator: boolean };

export type FetchOrganizationCollaboratorQueryVariables = Exact<{
  collaboratorId: Scalars['String']['input'];
}>;


export type FetchOrganizationCollaboratorQuery = { __typename?: 'Query', fetchOrganizationCollaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, uniqueIdentifier?: string | null, address?: string | null, salary?: number | null, wizallAccountNumber?: string | null, bankAccountNumber?: string | null, position?: string | null, authorizedAdvance: number, favoriteWallet?: Wallet | null, birthDate?: any | null, blocked?: boolean | null, balance?: number | null, totalDemandeAmount: number, organization: { __typename?: 'Organization', name: string }, categorySociopro?: { __typename?: 'CategorySociopro', id: any, title?: string | null } | null } };

export type UpdateCollaboratorMutationVariables = Exact<{
  collaboratorInput: UpdateCollaboratorInput;
  collaboratorId: Scalars['String']['input'];
  categorySocioProId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateCollaboratorMutation = { __typename?: 'Mutation', updateCollaborator: boolean };

export type FetchOrganizationNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchOrganizationNotificationsQuery = { __typename?: 'Query', fetchOrganizationNotifications: Array<{ __typename?: 'Notification', entityId?: string | null, title: string, content: string, viewedByMe: boolean, organization: string, date: any, author: { __typename?: 'User', firstName: string, lastName: string } }> };

export type ViewOrganizationNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type ViewOrganizationNotificationsMutation = { __typename?: 'Mutation', viewOrganizationNotifications: boolean };

export type FetchPaginatedNotificationsQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
}>;


export type FetchPaginatedNotificationsQuery = { __typename?: 'Query', fetchPaginatedNotifications: { __typename?: 'PaginatedNotificationResult', pagination: { __typename?: 'PaginationInfo', totalItems: number, pageCount: number, currentPage: number, pageSize: number }, results: Array<{ __typename?: 'Notification', entityId?: string | null, title: string, content: string, viewedByMe: boolean, organization: string, date: any, author: { __typename?: 'User', firstName: string, lastName: string } }> } };

export type UpdateOrganizationMutationVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  organizationInput: OrganizationUpdateInput;
}>;


export type UpdateOrganizationMutation = { __typename?: 'Mutation', updateOrganization: boolean };

export type DeleteCategorySocioproMutationVariables = Exact<{
  categorySocioproId: Scalars['ID']['input'];
}>;


export type DeleteCategorySocioproMutation = { __typename?: 'Mutation', deleteCategorySociopro: boolean };

export type UpdateCategorySocioproMutationVariables = Exact<{
  categorySocioproInput: CategorySocioproUpdateInput;
  categorySocioproId: Scalars['ID']['input'];
}>;


export type UpdateCategorySocioproMutation = { __typename?: 'Mutation', updateCategorySociopro: boolean };

export type CreateCategorySocioproServiceMutationVariables = Exact<{
  categorySocioproServiceInput: CategorySocioproServiceInput;
  categorySocioproId: Scalars['ID']['input'];
  organisationServiceId: Scalars['ID']['input'];
  eventId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type CreateCategorySocioproServiceMutation = { __typename?: 'Mutation', createCategorySocioproService: { __typename?: 'CategorySocioproService', id: any } };

export type CreateCategorySocioproMutationVariables = Exact<{
  categorySocioproInput: CategorySocioproInput;
  organizationId: Scalars['ID']['input'];
}>;


export type CreateCategorySocioproMutation = { __typename?: 'Mutation', createCategorySociopro: { __typename?: 'CategorySociopro', id: any, title?: string | null, organizationId?: string | null, createdAt: any, updatedAt: any } };

export type FetchCategorySocioprosQueryVariables = Exact<{
  queryConfig: QueryDataConfigInput;
}>;


export type FetchCategorySocioprosQuery = { __typename?: 'Query', fetchCategorySociopros: { __typename?: 'PaginatedCategorySocioproResult', pagination: { __typename?: 'PaginationInfo', totalItems: number, pageCount: number, currentPage: number, pageSize: number }, results: Array<{ __typename?: 'CategorySociopro', id: any, title?: string | null, organizationId?: string | null, createdAt: any, updatedAt: any }> } };

export type FetchServicesQueryVariables = Exact<{
  queryConfig?: InputMaybe<QueryDataConfigInput>;
}>;


export type FetchServicesQuery = { __typename?: 'Query', fetchServices: { __typename?: 'PaginatedServiceResult', pagination: { __typename?: 'PaginationInfo', totalItems: number, pageCount: number, currentPage: number, pageSize: number }, results: Array<{ __typename?: 'Service', id: any, title: string, description?: string | null, createdAt: any, updatedAt: any, identifier: string, refundDurationMonth: number, available: boolean }> } };

export type CreateOrganistionServiceMutationVariables = Exact<{
  organisationServiceInput: OrganisationServiceInput;
  organisationId: Scalars['ID']['input'];
  serviceId: Scalars['ID']['input'];
}>;


export type CreateOrganistionServiceMutation = { __typename?: 'Mutation', createOrganisationService: { __typename?: 'OrganisationService', createdAt: any, updatedAt: any, id: any, amount?: number | null, amountUnit: AmountUnit, refundDuration: number, refundDurationUnit: DurationUnit, activated: boolean, activatedAt?: any | null, activationDurationDay: number, autoValidate: boolean, organizationId: string, serviceId: string, organization: { __typename?: 'Organization', id: string }, service: { __typename?: 'Service', id: any, title: string }, events?: Array<{ __typename?: 'Event', id: any, title: string }> | null, categoriesocioproservices?: Array<{ __typename?: 'CategorySocioproService', createdAt: any, updatedAt: any, id: any, amount: number, amountUnit: AmountUnit, refundDuration: number, refundDurationUnit: DurationUnit, activated: boolean, activatedAt?: any | null, autoValidate: boolean, organisationServiceId: string, categorySocioproId: string, categorySociopro?: { __typename?: 'CategorySociopro', id: any, title?: string | null, organizationId?: string | null, createdAt: any, updatedAt: any } | null }> | null } };

export type UpdateOrganisationServiceMutationVariables = Exact<{
  organisationServiceInput: OrganisationServiceUpdateInput;
  organisationServiceId: Scalars['ID']['input'];
}>;


export type UpdateOrganisationServiceMutation = { __typename?: 'Mutation', updateOrganisationService: boolean };

export type UpdateCategorySocioproServiceMutationVariables = Exact<{
  categorySocioproServiceInput: CategorySocioproServiceUpdateInput;
  categorySocioproServiceId: Scalars['ID']['input'];
}>;


export type UpdateCategorySocioproServiceMutation = { __typename?: 'Mutation', updateCategorySocioproService: boolean };

export type FetchOrganisationServiceByOrganisationIdAndServiceIdQueryVariables = Exact<{
  organisationId: Scalars['ID']['input'];
  serviceId: Scalars['ID']['input'];
}>;


export type FetchOrganisationServiceByOrganisationIdAndServiceIdQuery = { __typename?: 'Query', fetchOrganisationServiceByOrganisationIdAndServiceId?: { __typename?: 'OrganisationService', id: any, amount?: number | null, amountUnit: AmountUnit, refundDuration: number, refundDurationUnit: DurationUnit, activated: boolean, activatedAt?: any | null, activationDurationDay: number, autoValidate: boolean, organizationId: string, serviceId: string, organization: { __typename?: 'Organization', id: string }, service: { __typename?: 'Service', id: any, title: string }, events?: Array<{ __typename?: 'Event', id: any, title: string }> | null, categoriesocioproservices?: Array<{ __typename?: 'CategorySocioproService', createdAt: any, updatedAt: any, id: any, amount: number, amountUnit: AmountUnit, refundDuration: number, refundDurationUnit: DurationUnit, activated: boolean, activatedAt?: any | null, autoValidate: boolean, organisationServiceId: string, categorySocioproId: string, categorySociopro?: { __typename?: 'CategorySociopro', id: any, title?: string | null, organizationId?: string | null, createdAt: any, updatedAt: any } | null }> | null } | null };

export type CreateEventMutationVariables = Exact<{
  eventInput: EventInput;
  organizationServiceId: Scalars['ID']['input'];
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'Event', id: any, title: string, description?: string | null, startDate: any, endDate: any, createdAt: any, updatedAt: any, activated: boolean, amount: number, amountUnit: AmountUnit, refundDuration: number, refundDurationUnit: DurationUnit, activatedAt?: any | null, autoValidate: boolean, organisationService: { __typename?: 'OrganisationService', id: any } } };

export type FetchEventsQueryVariables = Exact<{
  queryConfig?: InputMaybe<QueryDataConfigInput>;
  organizationServiceId: Scalars['ID']['input'];
}>;


export type FetchEventsQuery = { __typename?: 'Query', fetchEvents: { __typename?: 'PaginatedEventResult', pagination: { __typename?: 'PaginationInfo', totalItems: number, pageCount: number, currentPage: number, pageSize: number }, results: Array<{ __typename?: 'Event', id: any, title: string, description?: string | null, startDate: any, endDate: any, activated: boolean, createdAt: any, updatedAt: any, amount: number, amountUnit: AmountUnit, refundDuration: number, refundDurationUnit: DurationUnit, activatedAt?: any | null, autoValidate: boolean, organisationService: { __typename?: 'OrganisationService', id: any }, categorySocioproServices?: Array<{ __typename?: 'CategorySocioproService', createdAt: any, updatedAt: any, id: any, amount: number, amountUnit: AmountUnit, refundDuration: number, refundDurationUnit: DurationUnit, activated: boolean, activatedAt?: any | null, autoValidate: boolean, organisationServiceId: string, categorySocioproId: string, categorySociopro?: { __typename?: 'CategorySociopro', id: any, title?: string | null, organizationId?: string | null, createdAt: any, updatedAt: any } | null }> | null }> } };

export type DesactivateOrganisationServiceMutationVariables = Exact<{
  organisationServiceId: Scalars['ID']['input'];
}>;


export type DesactivateOrganisationServiceMutation = { __typename?: 'Mutation', deactivateOrganisationService: boolean };

export type ActivateOrganisationServiceMutationVariables = Exact<{
  organisationServiceId: Scalars['ID']['input'];
}>;


export type ActivateOrganisationServiceMutation = { __typename?: 'Mutation', activateOrganisationService: boolean };

export type DeleteEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: boolean };

export type DesactiveEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type DesactiveEventMutation = { __typename?: 'Mutation', deactivateEvent: boolean };

export type ActivateEventMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type ActivateEventMutation = { __typename?: 'Mutation', activateEvent: boolean };

export type UpdateEventMutationVariables = Exact<{
  eventInput: EventUpdateInput;
  eventId: Scalars['ID']['input'];
}>;


export type UpdateEventMutation = { __typename?: 'Mutation', updateEvent: boolean };

export type FetchDemandesByCollaboratorQueryVariables = Exact<{
  collaboratorId: Scalars['ID']['input'];
  status?: InputMaybe<DemandeStatus>;
}>;


export type FetchDemandesByCollaboratorQuery = { __typename?: 'Query', fetchDemandesByCollaborator: Array<{ __typename?: 'Demande', id: string, status: DemandeStatus, amount: number, number: number, refundDuration: number, rejectedReason?: string | null, statusText?: string | null, fees: number, createdAt: any, updatedAt: any, collaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, salary?: number | null, balance?: number | null }, organisationService?: { __typename?: 'OrganisationService', service: { __typename?: 'Service', id: any, title: string } } | null }> };

export type FetchDemandesMetricsQueryVariables = Exact<{
  metricsInput: DemandesMetricsInput;
}>;


export type FetchDemandesMetricsQuery = { __typename?: 'Query', fetchDemandesMetrics: { __typename?: 'DemandesMetrics', remaining: Array<{ __typename?: 'DemandesMetricsRow', y: number, x: string }>, total: Array<{ __typename?: 'DemandesMetricsRow', y: number, x: string }> } };

export type FetchOrganizationDemandesQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
}>;


export type FetchOrganizationDemandesQuery = { __typename?: 'Query', fetchOrganizationDemandes: Array<{ __typename?: 'Demande', id: string, amount: number, status: DemandeStatus, number: number, fees: number, statusText?: string | null, createdAt: any, updatedAt: any, collaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, balance?: number | null, totalDemandeAmount: number, salary?: number | null, authorizedAdvance: number, bankAccountNumber?: string | null, uniqueIdentifier?: string | null } }> };

export type MyRemboursementsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyRemboursementsQuery = { __typename?: 'Query', myRemboursements: Array<{ __typename?: 'Remboursement', id: string, amount: number, number: number, fees?: number | null, status: RemboursementStatus, demandeId: string, userId?: string | null, createdAt: any, updatedAt: any, demande?: { __typename?: 'Demande', id: string, amount: number, status: DemandeStatus, number: number, fees: number, statusText?: string | null, createdAt: any, updatedAt: any, collaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, balance?: number | null, totalDemandeAmount: number, salary?: number | null, authorizedAdvance: number, bankAccountNumber?: string | null, uniqueIdentifier?: string | null } } | null }> };

export type FetchRemboursementByUserIdQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type FetchRemboursementByUserIdQuery = { __typename?: 'Query', fetchRemboursementByUserId: Array<{ __typename?: 'Remboursement', id: string, amount: number, number: number, fees?: number | null, status: RemboursementStatus, demandeId: string, userId?: string | null, createdAt: any, updatedAt: any, validatedAt?: any | null, demande?: { __typename?: 'Demande', remainingRefundAmount?: number | null, id: string, amount: number, status: DemandeStatus, number: number, fees: number, statusText?: string | null, createdAt: any, updatedAt: any, organisationService?: { __typename?: 'OrganisationService', service: { __typename?: 'Service', title: string } } | null, collaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, balance?: number | null, totalDemandeAmount: number, salary?: number | null, authorizedAdvance: number, bankAccountNumber?: string | null, uniqueIdentifier?: string | null } } | null }> };

export type FetchPaginatedOrganizationDemandesQueryVariables = Exact<{
  metricsInput?: InputMaybe<DemandesMetricsInput>;
  queryFilter?: InputMaybe<QueryDataConfigInput>;
  organizationServiceId?: InputMaybe<Scalars['String']['input']>;
}>;


export type FetchPaginatedOrganizationDemandesQuery = { __typename?: 'Query', fetchPaginatedOrganizationDemandes: { __typename?: 'PaginatedDemandeResult', pagination: { __typename?: 'PaginationInfo', totalItems: number, pageCount: number, currentPage: number, pageSize: number }, results: Array<{ __typename?: 'Demande', id: string, amount: number, status: DemandeStatus, number: number, fees: number, statusText?: string | null, createdAt: any, updatedAt: any, refundDuration: number, collaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, balance?: number | null, totalDemandeAmount: number, salary?: number | null, authorizedAdvance: number, bankAccountNumber?: string | null, uniqueIdentifier?: string | null }, remboursements?: Array<{ __typename?: 'Remboursement', createdAt: any, updatedAt: any, id: string, amount: number, number: number, fees?: number | null, status: RemboursementStatus, demandeId: string, userId?: string | null }> | null }> } };

export type ValidateDemandeMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
}>;


export type ValidateDemandeMutation = { __typename?: 'Mutation', validateDemande: boolean };

export type PayeDemandeMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
}>;


export type PayeDemandeMutation = { __typename?: 'Mutation', payeDemande: boolean };

export type CancelDemandeByAdminMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
}>;


export type CancelDemandeByAdminMutation = { __typename?: 'Mutation', cancelDemandeByAdmin: boolean };

export type RejectDemandeByAdminMutationVariables = Exact<{
  demandeId: Scalars['ID']['input'];
  rejectedReason: Scalars['String']['input'];
}>;


export type RejectDemandeByAdminMutation = { __typename?: 'Mutation', rejectDemandeByAdmin: boolean };

export type ValidateRemboursementMutationVariables = Exact<{
  remboursementId: Scalars['ID']['input'];
}>;


export type ValidateRemboursementMutation = { __typename?: 'Mutation', validateRemboursement: boolean };

export type FetchCountStatusQueryVariables = Exact<{
  filter?: InputMaybe<DemandesMetricsInput>;
}>;


export type FetchCountStatusQuery = { __typename?: 'Query', fetchCountStatus: { __typename?: 'CountStatusDemande', pending: number, validated: number, rejected: number, payed: number, cancelled: number } };

export type FetchOrganisationServiceQueryVariables = Exact<{
  organisationServiceId: Scalars['ID']['input'];
}>;


export type FetchOrganisationServiceQuery = { __typename?: 'Query', fetchOrganisationService: { __typename?: 'OrganisationService', id: any, amount?: number | null, amountUnit: AmountUnit, refundDuration: number, refundDurationUnit: DurationUnit, activated: boolean, activatedAt?: any | null, activationDurationDay: number, autoValidate: boolean, organizationId: string, serviceId: string, demandes?: Array<{ __typename?: 'Demande', createdAt: any, updatedAt: any, id: string, amount: number, number: number, fees: number, status: DemandeStatus, rejectedReason?: string | null, statusText?: string | null, collaborator: { __typename?: 'User', createdAt: any, updatedAt: any, id: string, email: string, firstName: string, lastName: string, phoneNumber?: string | null, address?: string | null, position?: string | null, uniqueIdentifier?: string | null, salary?: number | null, balance?: number | null, wizallAccountNumber?: string | null, bankAccountNumber?: string | null, totalDemandeAmount: number, role?: string | null, blocked?: boolean | null, birthDate?: any | null, favoriteWallet?: Wallet | null, enableEmailNotification?: boolean | null, status?: number | null, authorizedAdvance: number } }> | null } };

export type FetchCollaboratorCountQueryVariables = Exact<{
  filter?: InputMaybe<UserFilterInput>;
}>;


export type FetchCollaboratorCountQuery = { __typename?: 'Query', fetchCollaboratorCount: number };

export type FetchTotalDemandesAmountQueryVariables = Exact<{
  status?: InputMaybe<Array<DemandeStatus> | DemandeStatus>;
  filter?: InputMaybe<DemandesMetricsInput>;
}>;


export type FetchTotalDemandesAmountQuery = { __typename?: 'Query', fetchTotalDemandesAmount?: number | null };

export type FetchRemboursementsByDemandeQueryVariables = Exact<{
  demandeId: Scalars['ID']['input'];
}>;


export type FetchRemboursementsByDemandeQuery = { __typename?: 'Query', fetchRemboursementsByDemande: Array<{ __typename?: 'Remboursement', id: string, amount: number, number: number, fees?: number | null, status: RemboursementStatus, demandeId: string, userId?: string | null, createdAt: any, updatedAt: any, demande?: { __typename?: 'Demande', id: string, amount: number, status: DemandeStatus, number: number, fees: number, statusText?: string | null, createdAt: any, updatedAt: any, collaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, balance?: number | null, totalDemandeAmount: number, salary?: number | null, authorizedAdvance: number, bankAccountNumber?: string | null, uniqueIdentifier?: string | null } } | null }> };

export type UpdateMyAdminPasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type UpdateMyAdminPasswordMutation = { __typename?: 'Mutation', updateMyAdminPassword: boolean };

export type FetchCurrentAdminQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCurrentAdminQuery = { __typename?: 'Query', fetchCurrentAdmin: { __typename?: 'User', id: string, firstName: string, lastName: string, email: string, phoneNumber?: string | null, address?: string | null, role?: string | null, position?: string | null, enableEmailNotification?: boolean | null, organization: { __typename?: 'Organization', id: string, name: string, maxDemandeAmount: number, amountPercent: number, fees: number, demandeDeadlineDay?: number | null, organisationService?: Array<{ __typename?: 'OrganisationService', id: any, serviceId: string }> | null } } };

export type UpdateMyAdminProfileMutationVariables = Exact<{
  userInput: UpdateMyAdminProfileInput;
}>;


export type UpdateMyAdminProfileMutation = { __typename?: 'Mutation', updateMyAdminProfile: boolean };

export type LockUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type LockUserMutation = { __typename?: 'Mutation', lockUser: boolean };

export type UnlockUserMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type UnlockUserMutation = { __typename?: 'Mutation', unlockUser: boolean };

export type EnableEmailNotificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type EnableEmailNotificationMutation = { __typename?: 'Mutation', enableEmailNotification: boolean };

export type DisableEmailNotificationMutationVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type DisableEmailNotificationMutation = { __typename?: 'Mutation', disableEmailNotification: boolean };

export type FetchSupportPaiementQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchSupportPaiementQuery = { __typename?: 'Query', fetchSupportPaiement: Array<{ __typename?: 'Demande', amount: number, collaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, balance?: number | null, email: string, totalDemandeAmount: number, salary?: number | null, authorizedAdvance: number, phoneNumber?: string | null, bankAccountNumber?: string | null, uniqueIdentifier?: string | null }, organisationService?: { __typename?: 'OrganisationService', service: { __typename?: 'Service', title: string } } | null }> };

export type FetchAccountantDataQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchAccountantDataQuery = { __typename?: 'Query', fetchAccountantData: Array<{ __typename?: 'Demande', amount: number, number: number, collaborator: { __typename?: 'User', id: string, firstName: string, lastName: string, balance?: number | null, email: string, totalDemandeAmount: number, salary?: number | null, authorizedAdvance: number, phoneNumber?: string | null, bankAccountNumber?: string | null, uniqueIdentifier?: string | null }, organisationService?: { __typename?: 'OrganisationService', service: { __typename?: 'Service', title: string } } | null }> };

export type BankAccountNumberExistsQueryVariables = Exact<{
  bankAccountNumber: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
}>;


export type BankAccountNumberExistsQuery = { __typename?: 'Query', bankAccountNumberExists: boolean };

export type PhoneNumberExistsQueryVariables = Exact<{
  phoneNumber: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
}>;


export type PhoneNumberExistsQuery = { __typename?: 'Query', phoneNumberExists: boolean };

export type UniqueIdentifierExistsQueryVariables = Exact<{
  uniqueIdentifier: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
}>;


export type UniqueIdentifierExistsQuery = { __typename?: 'Query', uniqueIdentifierExists: boolean };

export type EmailExistsQueryVariables = Exact<{
  email: Scalars['String']['input'];
  isAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
}>;


export type EmailExistsQuery = { __typename?: 'Query', emailExists: boolean };

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
    providedIn: 'root'
  })
  export class LoginAdminGQL extends Apollo.Query<LoginAdminQuery, LoginAdminQueryVariables> {
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
    providedIn: 'root'
  })
  export class ResetAdminPasswordGQL extends Apollo.Mutation<ResetAdminPasswordMutation, ResetAdminPasswordMutationVariables> {
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
    providedIn: 'root'
  })
  export class StartForgotPasswordGQL extends Apollo.Mutation<StartForgotPasswordMutation, StartForgotPasswordMutationVariables> {
    document = StartForgotPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FinalizeForgotPasswordDocument = gql`
    mutation FinalizeForgotPassword($finalizeForgotPasswordInput: FinalizeForgotPasswordInput!) {
  finalizeForgotPassword(
    finalizeForgotPasswordInput: $finalizeForgotPasswordInput
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FinalizeForgotPasswordGQL extends Apollo.Mutation<FinalizeForgotPasswordMutation, FinalizeForgotPasswordMutationVariables> {
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
    providedIn: 'root'
  })
  export class FetchPaginatedActivitiesGQL extends Apollo.Query<FetchPaginatedActivitiesQuery, FetchPaginatedActivitiesQueryVariables> {
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
    providedIn: 'root'
  })
  export class FetchOrganizationAdminsGQL extends Apollo.Query<FetchOrganizationAdminsQuery, FetchOrganizationAdminsQueryVariables> {
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
    providedIn: 'root'
  })
  export class InviteAdminGQL extends Apollo.Mutation<InviteAdminMutation, InviteAdminMutationVariables> {
    document = InviteAdminDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchPaginatedOrganisationAdminsDocument = gql`
    query FetchPaginatedOrganisationAdmins($metricsInput: DemandesMetricsInput, $queryFilter: QueryDataConfigInput) {
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
    providedIn: 'root'
  })
  export class FetchPaginatedOrganisationAdminsGQL extends Apollo.Query<FetchPaginatedOrganisationAdminsQuery, FetchPaginatedOrganisationAdminsQueryVariables> {
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
    providedIn: 'root'
  })
  export class FetchOrganizationCollaboratorsGQL extends Apollo.Query<FetchOrganizationCollaboratorsQuery, FetchOrganizationCollaboratorsQueryVariables> {
    document = FetchOrganizationCollaboratorsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchPaginatedOrganizationCollaboratorsDocument = gql`
    query FetchPaginatedOrganizationCollaborators($metricsInput: DemandesMetricsInput, $queryFilter: QueryDataConfigInput, $hasPendingDemandes: Boolean) {
  fetchPaginatedOrganizationCollaborators(
    metricsInput: $metricsInput
    queryFilter: $queryFilter
    hasPendingDemandes: $hasPendingDemandes
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
    providedIn: 'root'
  })
  export class FetchPaginatedOrganizationCollaboratorsGQL extends Apollo.Query<FetchPaginatedOrganizationCollaboratorsQuery, FetchPaginatedOrganizationCollaboratorsQueryVariables> {
    document = FetchPaginatedOrganizationCollaboratorsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const InviteCollaboratorDocument = gql`
    mutation InviteCollaborator($collaboratorInput: InviteCollaboratorInput!, $categorySocioProId: String) {
  inviteCollaborator(
    collaborator: $collaboratorInput
    categorySocioProId: $categorySocioProId
  )
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
    favoriteWallet
    birthDate
    blocked
    balance
    totalDemandeAmount
    organization {
      name
    }
    categorySociopro {
      id
      title
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
    mutation UpdateCollaborator($collaboratorInput: UpdateCollaboratorInput!, $collaboratorId: String!, $categorySocioProId: String) {
  updateCollaborator(
    collaborator: $collaboratorInput
    collaboratorId: $collaboratorId
    categorySocioProId: $categorySocioProId
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
    providedIn: 'root'
  })
  export class FetchOrganizationNotificationsGQL extends Apollo.Query<FetchOrganizationNotificationsQuery, FetchOrganizationNotificationsQueryVariables> {
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
    providedIn: 'root'
  })
  export class ViewOrganizationNotificationsGQL extends Apollo.Mutation<ViewOrganizationNotificationsMutation, ViewOrganizationNotificationsMutationVariables> {
    document = ViewOrganizationNotificationsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchPaginatedNotificationsDocument = gql`
    query FetchPaginatedNotifications($metricsInput: DemandesMetricsInput, $queryFilter: QueryDataConfigInput) {
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
    providedIn: 'root'
  })
  export class FetchPaginatedNotificationsGQL extends Apollo.Query<FetchPaginatedNotificationsQuery, FetchPaginatedNotificationsQueryVariables> {
    document = FetchPaginatedNotificationsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOrganizationDocument = gql`
    mutation UpdateOrganization($organizationId: ID!, $organizationInput: OrganizationUpdateInput!) {
  updateOrganization(
    organizationId: $organizationId
    organizationInput: $organizationInput
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOrganizationGQL extends Apollo.Mutation<UpdateOrganizationMutation, UpdateOrganizationMutationVariables> {
    document = UpdateOrganizationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteCategorySocioproDocument = gql`
    mutation DeleteCategorySociopro($categorySocioproId: ID!) {
  deleteCategorySociopro(categorySocioproId: $categorySocioproId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteCategorySocioproGQL extends Apollo.Mutation<DeleteCategorySocioproMutation, DeleteCategorySocioproMutationVariables> {
    document = DeleteCategorySocioproDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateCategorySocioproDocument = gql`
    mutation UpdateCategorySociopro($categorySocioproInput: CategorySocioproUpdateInput!, $categorySocioproId: ID!) {
  updateCategorySociopro(
    categorySocioproInput: $categorySocioproInput
    categorySocioproId: $categorySocioproId
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCategorySocioproGQL extends Apollo.Mutation<UpdateCategorySocioproMutation, UpdateCategorySocioproMutationVariables> {
    document = UpdateCategorySocioproDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateCategorySocioproServiceDocument = gql`
    mutation CreateCategorySocioproService($categorySocioproServiceInput: CategorySocioproServiceInput!, $categorySocioproId: ID!, $organisationServiceId: ID!, $eventId: ID) {
  createCategorySocioproService(
    categorySocioproServiceInput: $categorySocioproServiceInput
    categorySocioproId: $categorySocioproId
    organisationServiceId: $organisationServiceId
    eventId: $eventId
  ) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCategorySocioproServiceGQL extends Apollo.Mutation<CreateCategorySocioproServiceMutation, CreateCategorySocioproServiceMutationVariables> {
    document = CreateCategorySocioproServiceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateCategorySocioproDocument = gql`
    mutation CreateCategorySociopro($categorySocioproInput: CategorySocioproInput!, $organizationId: ID!) {
  createCategorySociopro(
    categorySocioproInput: $categorySocioproInput
    organizationId: $organizationId
  ) {
    id
    title
    organizationId
    createdAt
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCategorySocioproGQL extends Apollo.Mutation<CreateCategorySocioproMutation, CreateCategorySocioproMutationVariables> {
    document = CreateCategorySocioproDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchCategorySocioprosDocument = gql`
    query FetchCategorySociopros($queryConfig: QueryDataConfigInput!) {
  fetchCategorySociopros(queryConfig: $queryConfig) {
    pagination {
      totalItems
      pageCount
      currentPage
      pageSize
    }
    results {
      id
      title
      organizationId
      createdAt
      updatedAt
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchCategorySocioprosGQL extends Apollo.Query<FetchCategorySocioprosQuery, FetchCategorySocioprosQueryVariables> {
    document = FetchCategorySocioprosDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchServicesDocument = gql`
    query FetchServices($queryConfig: QueryDataConfigInput) {
  fetchServices(queryConfig: $queryConfig) {
    pagination {
      totalItems
      pageCount
      currentPage
      pageSize
    }
    results {
      id
      title
      description
      createdAt
      updatedAt
      identifier
      refundDurationMonth
      available
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchServicesGQL extends Apollo.Query<FetchServicesQuery, FetchServicesQueryVariables> {
    document = FetchServicesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateOrganistionServiceDocument = gql`
    mutation CreateOrganistionService($organisationServiceInput: OrganisationServiceInput!, $organisationId: ID!, $serviceId: ID!) {
  createOrganisationService(
    organisationServiceInput: $organisationServiceInput
    organisationId: $organisationId
    serviceId: $serviceId
  ) {
    createdAt
    updatedAt
    id
    amount
    amountUnit
    refundDuration
    refundDurationUnit
    activated
    activatedAt
    activationDurationDay
    autoValidate
    organizationId
    serviceId
    organization {
      id
    }
    service {
      id
      title
    }
    events {
      id
      title
    }
    categoriesocioproservices {
      createdAt
      updatedAt
      id
      amount
      amountUnit
      refundDuration
      refundDurationUnit
      activated
      activatedAt
      autoValidate
      organisationServiceId
      categorySocioproId
      categorySociopro {
        id
        title
        organizationId
        createdAt
        updatedAt
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateOrganistionServiceGQL extends Apollo.Mutation<CreateOrganistionServiceMutation, CreateOrganistionServiceMutationVariables> {
    document = CreateOrganistionServiceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateOrganisationServiceDocument = gql`
    mutation UpdateOrganisationService($organisationServiceInput: OrganisationServiceUpdateInput!, $organisationServiceId: ID!) {
  updateOrganisationService(
    organisationServiceInput: $organisationServiceInput
    organisationServiceId: $organisationServiceId
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateOrganisationServiceGQL extends Apollo.Mutation<UpdateOrganisationServiceMutation, UpdateOrganisationServiceMutationVariables> {
    document = UpdateOrganisationServiceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateCategorySocioproServiceDocument = gql`
    mutation UpdateCategorySocioproService($categorySocioproServiceInput: CategorySocioproServiceUpdateInput!, $categorySocioproServiceId: ID!) {
  updateCategorySocioproService(
    categorySocioproServiceInput: $categorySocioproServiceInput
    categorySocioproServiceId: $categorySocioproServiceId
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCategorySocioproServiceGQL extends Apollo.Mutation<UpdateCategorySocioproServiceMutation, UpdateCategorySocioproServiceMutationVariables> {
    document = UpdateCategorySocioproServiceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOrganisationServiceByOrganisationIdAndServiceIdDocument = gql`
    query FetchOrganisationServiceByOrganisationIdAndServiceId($organisationId: ID!, $serviceId: ID!) {
  fetchOrganisationServiceByOrganisationIdAndServiceId(
    organisationId: $organisationId
    serviceId: $serviceId
  ) {
    id
    amount
    amountUnit
    refundDuration
    refundDurationUnit
    activated
    activatedAt
    activationDurationDay
    autoValidate
    organizationId
    serviceId
    organization {
      id
    }
    service {
      id
      title
    }
    events {
      id
      title
    }
    categoriesocioproservices {
      createdAt
      updatedAt
      id
      amount
      amountUnit
      refundDuration
      refundDurationUnit
      activated
      activatedAt
      autoValidate
      organisationServiceId
      categorySocioproId
      categorySociopro {
        id
        title
        organizationId
        createdAt
        updatedAt
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOrganisationServiceByOrganisationIdAndServiceIdGQL extends Apollo.Query<FetchOrganisationServiceByOrganisationIdAndServiceIdQuery, FetchOrganisationServiceByOrganisationIdAndServiceIdQueryVariables> {
    document = FetchOrganisationServiceByOrganisationIdAndServiceIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateEventDocument = gql`
    mutation CreateEvent($eventInput: EventInput!, $organizationServiceId: ID!) {
  createEvent(
    eventInput: $eventInput
    organizationServiceId: $organizationServiceId
  ) {
    id
    title
    description
    startDate
    endDate
    organisationService {
      id
    }
    createdAt
    updatedAt
    activated
    organisationService {
      id
    }
    amount
    amountUnit
    refundDuration
    refundDurationUnit
    activated
    activatedAt
    autoValidate
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateEventGQL extends Apollo.Mutation<CreateEventMutation, CreateEventMutationVariables> {
    document = CreateEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchEventsDocument = gql`
    query FetchEvents($queryConfig: QueryDataConfigInput, $organizationServiceId: ID!) {
  fetchEvents(
    queryConfig: $queryConfig
    organizationServiceId: $organizationServiceId
  ) {
    pagination {
      totalItems
      pageCount
      currentPage
      pageSize
    }
    results {
      id
      title
      description
      startDate
      endDate
      activated
      organisationService {
        id
      }
      createdAt
      updatedAt
      amount
      amountUnit
      refundDuration
      refundDurationUnit
      activated
      activatedAt
      autoValidate
      categorySocioproServices {
        createdAt
        updatedAt
        id
        amount
        amountUnit
        refundDuration
        refundDurationUnit
        activated
        activatedAt
        autoValidate
        organisationServiceId
        categorySocioproId
        categorySociopro {
          id
          title
          organizationId
          createdAt
          updatedAt
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchEventsGQL extends Apollo.Query<FetchEventsQuery, FetchEventsQueryVariables> {
    document = FetchEventsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DesactivateOrganisationServiceDocument = gql`
    mutation DesactivateOrganisationService($organisationServiceId: ID!) {
  deactivateOrganisationService(organisationServiceId: $organisationServiceId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DesactivateOrganisationServiceGQL extends Apollo.Mutation<DesactivateOrganisationServiceMutation, DesactivateOrganisationServiceMutationVariables> {
    document = DesactivateOrganisationServiceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ActivateOrganisationServiceDocument = gql`
    mutation ActivateOrganisationService($organisationServiceId: ID!) {
  activateOrganisationService(organisationServiceId: $organisationServiceId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ActivateOrganisationServiceGQL extends Apollo.Mutation<ActivateOrganisationServiceMutation, ActivateOrganisationServiceMutationVariables> {
    document = ActivateOrganisationServiceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteEventDocument = gql`
    mutation DeleteEvent($eventId: ID!) {
  deleteEvent(eventId: $eventId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteEventGQL extends Apollo.Mutation<DeleteEventMutation, DeleteEventMutationVariables> {
    document = DeleteEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DesactiveEventDocument = gql`
    mutation DesactiveEvent($eventId: ID!) {
  deactivateEvent(eventId: $eventId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DesactiveEventGQL extends Apollo.Mutation<DesactiveEventMutation, DesactiveEventMutationVariables> {
    document = DesactiveEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ActivateEventDocument = gql`
    mutation ActivateEvent($eventId: ID!) {
  activateEvent(eventId: $eventId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ActivateEventGQL extends Apollo.Mutation<ActivateEventMutation, ActivateEventMutationVariables> {
    document = ActivateEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateEventDocument = gql`
    mutation UpdateEvent($eventInput: EventUpdateInput!, $eventId: ID!) {
  updateEvent(eventInput: $eventInput, eventId: $eventId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateEventGQL extends Apollo.Mutation<UpdateEventMutation, UpdateEventMutationVariables> {
    document = UpdateEventDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchDemandesByCollaboratorDocument = gql`
    query FetchDemandesByCollaborator($collaboratorId: ID!, $status: DemandeStatus) {
  fetchDemandesByCollaborator(collaboratorId: $collaboratorId, status: $status) {
    id
    status
    amount
    number
    refundDuration
    rejectedReason
    statusText
    fees
    createdAt
    updatedAt
    collaborator {
      id
      firstName
      lastName
      salary
      balance
    }
    organisationService {
      service {
        id
        title
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchDemandesByCollaboratorGQL extends Apollo.Query<FetchDemandesByCollaboratorQuery, FetchDemandesByCollaboratorQueryVariables> {
    document = FetchDemandesByCollaboratorDocument;
    
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
    providedIn: 'root'
  })
  export class FetchDemandesMetricsGQL extends Apollo.Query<FetchDemandesMetricsQuery, FetchDemandesMetricsQueryVariables> {
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
    providedIn: 'root'
  })
  export class FetchOrganizationDemandesGQL extends Apollo.Query<FetchOrganizationDemandesQuery, FetchOrganizationDemandesQueryVariables> {
    document = FetchOrganizationDemandesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MyRemboursementsDocument = gql`
    query MyRemboursements {
  myRemboursements {
    id
    amount
    number
    fees
    status
    demandeId
    userId
    createdAt
    updatedAt
    demande {
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
    providedIn: 'root'
  })
  export class MyRemboursementsGQL extends Apollo.Query<MyRemboursementsQuery, MyRemboursementsQueryVariables> {
    document = MyRemboursementsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchRemboursementByUserIdDocument = gql`
    query FetchRemboursementByUserId($userId: ID!) {
  fetchRemboursementByUserId(userId: $userId) {
    id
    amount
    number
    fees
    status
    demandeId
    userId
    createdAt
    updatedAt
    validatedAt
    demande {
      remainingRefundAmount
      organisationService {
        service {
          title
        }
      }
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
    providedIn: 'root'
  })
  export class FetchRemboursementByUserIdGQL extends Apollo.Query<FetchRemboursementByUserIdQuery, FetchRemboursementByUserIdQueryVariables> {
    document = FetchRemboursementByUserIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchPaginatedOrganizationDemandesDocument = gql`
    query FetchPaginatedOrganizationDemandes($metricsInput: DemandesMetricsInput, $queryFilter: QueryDataConfigInput, $organizationServiceId: String) {
  fetchPaginatedOrganizationDemandes(
    metricsInput: $metricsInput
    queryFilter: $queryFilter
    organizationServiceId: $organizationServiceId
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
      refundDuration
      remboursements {
        createdAt
        updatedAt
        id
        amount
        number
        fees
        status
        demandeId
        userId
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchPaginatedOrganizationDemandesGQL extends Apollo.Query<FetchPaginatedOrganizationDemandesQuery, FetchPaginatedOrganizationDemandesQueryVariables> {
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
    providedIn: 'root'
  })
  export class ValidateDemandeGQL extends Apollo.Mutation<ValidateDemandeMutation, ValidateDemandeMutationVariables> {
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
    providedIn: 'root'
  })
  export class PayeDemandeGQL extends Apollo.Mutation<PayeDemandeMutation, PayeDemandeMutationVariables> {
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
export const ValidateRemboursementDocument = gql`
    mutation ValidateRemboursement($remboursementId: ID!) {
  validateRemboursement(remboursementId: $remboursementId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ValidateRemboursementGQL extends Apollo.Mutation<ValidateRemboursementMutation, ValidateRemboursementMutationVariables> {
    document = ValidateRemboursementDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchCountStatusDocument = gql`
    query FetchCountStatus($filter: DemandesMetricsInput) {
  fetchCountStatus(filter: $filter) {
    pending
    validated
    rejected
    payed
    cancelled
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchCountStatusGQL extends Apollo.Query<FetchCountStatusQuery, FetchCountStatusQueryVariables> {
    document = FetchCountStatusDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchOrganisationServiceDocument = gql`
    query FetchOrganisationService($organisationServiceId: ID!) {
  fetchOrganisationService(organisationServiceId: $organisationServiceId) {
    id
    amount
    amountUnit
    refundDuration
    refundDurationUnit
    activated
    activatedAt
    activationDurationDay
    autoValidate
    organizationId
    serviceId
    demandes {
      createdAt
      updatedAt
      id
      amount
      number
      fees
      status
      collaborator {
        createdAt
        updatedAt
        id
        email
        firstName
        lastName
        phoneNumber
        address
        position
        uniqueIdentifier
        salary
        balance
        wizallAccountNumber
        bankAccountNumber
        totalDemandeAmount
        role
        blocked
        birthDate
        favoriteWallet
        enableEmailNotification
        status
        authorizedAdvance
      }
      rejectedReason
      statusText
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchOrganisationServiceGQL extends Apollo.Query<FetchOrganisationServiceQuery, FetchOrganisationServiceQueryVariables> {
    document = FetchOrganisationServiceDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchCollaboratorCountDocument = gql`
    query FetchCollaboratorCount($filter: UserFilterInput) {
  fetchCollaboratorCount(filter: $filter)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchCollaboratorCountGQL extends Apollo.Query<FetchCollaboratorCountQuery, FetchCollaboratorCountQueryVariables> {
    document = FetchCollaboratorCountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchTotalDemandesAmountDocument = gql`
    query FetchTotalDemandesAmount($status: [DemandeStatus!], $filter: DemandesMetricsInput) {
  fetchTotalDemandesAmount(status: $status, filter: $filter)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchTotalDemandesAmountGQL extends Apollo.Query<FetchTotalDemandesAmountQuery, FetchTotalDemandesAmountQueryVariables> {
    document = FetchTotalDemandesAmountDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchRemboursementsByDemandeDocument = gql`
    query FetchRemboursementsByDemande($demandeId: ID!) {
  fetchRemboursementsByDemande(demandeId: $demandeId) {
    id
    amount
    number
    fees
    status
    demandeId
    userId
    createdAt
    updatedAt
    demande {
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
    providedIn: 'root'
  })
  export class FetchRemboursementsByDemandeGQL extends Apollo.Query<FetchRemboursementsByDemandeQuery, FetchRemboursementsByDemandeQueryVariables> {
    document = FetchRemboursementsByDemandeDocument;
    
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
      organisationService {
        id
        serviceId
      }
    }
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
export const LockUserDocument = gql`
    mutation LockUser($userId: String!) {
  lockUser(userId: $userId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class LockUserGQL extends Apollo.Mutation<LockUserMutation, LockUserMutationVariables> {
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
    providedIn: 'root'
  })
  export class UnlockUserGQL extends Apollo.Mutation<UnlockUserMutation, UnlockUserMutationVariables> {
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
    providedIn: 'root'
  })
  export class EnableEmailNotificationGQL extends Apollo.Mutation<EnableEmailNotificationMutation, EnableEmailNotificationMutationVariables> {
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
    providedIn: 'root'
  })
  export class DisableEmailNotificationGQL extends Apollo.Mutation<DisableEmailNotificationMutation, DisableEmailNotificationMutationVariables> {
    document = DisableEmailNotificationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchSupportPaiementDocument = gql`
    query FetchSupportPaiement {
  fetchSupportPaiement {
    amount
    collaborator {
      id
      firstName
      lastName
      balance
      email
      totalDemandeAmount
      salary
      authorizedAdvance
      phoneNumber
      bankAccountNumber
      uniqueIdentifier
    }
    organisationService {
      service {
        title
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchSupportPaiementGQL extends Apollo.Query<FetchSupportPaiementQuery, FetchSupportPaiementQueryVariables> {
    document = FetchSupportPaiementDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FetchAccountantDataDocument = gql`
    query FetchAccountantData {
  fetchAccountantData {
    amount
    number
    collaborator {
      id
      firstName
      lastName
      balance
      email
      totalDemandeAmount
      salary
      authorizedAdvance
      phoneNumber
      bankAccountNumber
      uniqueIdentifier
    }
    organisationService {
      service {
        title
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchAccountantDataGQL extends Apollo.Query<FetchAccountantDataQuery, FetchAccountantDataQueryVariables> {
    document = FetchAccountantDataDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const BankAccountNumberExistsDocument = gql`
    query BankAccountNumberExists($bankAccountNumber: String!, $isAdmin: Boolean, $userId: String) {
  bankAccountNumberExists(
    bankAccountNumber: $bankAccountNumber
    isAdmin: $isAdmin
    userId: $userId
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class BankAccountNumberExistsGQL extends Apollo.Query<BankAccountNumberExistsQuery, BankAccountNumberExistsQueryVariables> {
    document = BankAccountNumberExistsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PhoneNumberExistsDocument = gql`
    query PhoneNumberExists($phoneNumber: String!, $isAdmin: Boolean, $userId: String) {
  phoneNumberExists(phoneNumber: $phoneNumber, isAdmin: $isAdmin, userId: $userId)
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PhoneNumberExistsGQL extends Apollo.Query<PhoneNumberExistsQuery, PhoneNumberExistsQueryVariables> {
    document = PhoneNumberExistsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UniqueIdentifierExistsDocument = gql`
    query UniqueIdentifierExists($uniqueIdentifier: String!, $isAdmin: Boolean, $userId: String) {
  uniqueIdentifierExists(
    uniqueIdentifier: $uniqueIdentifier
    isAdmin: $isAdmin
    userId: $userId
  )
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UniqueIdentifierExistsGQL extends Apollo.Query<UniqueIdentifierExistsQuery, UniqueIdentifierExistsQueryVariables> {
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
    providedIn: 'root'
  })
  export class EmailExistsGQL extends Apollo.Query<EmailExistsQuery, EmailExistsQueryVariables> {
    document = EmailExistsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }