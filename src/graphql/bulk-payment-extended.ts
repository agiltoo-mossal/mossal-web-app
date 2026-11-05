import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
import type { BulkPaymentInput } from './generated';
import { BulkPaymentOrderStatus, Wallet } from './generated';

export interface FetchOrderForApproverByIdQueryVariables {
  id: string;
}

export interface FetchOrderForApproverByIdQuery {
  fetchOrderForApproverById: {
    id: string;
    label: string;
    totalAmount: number;
    totalFees: number;
    status: BulkPaymentOrderStatus;
    currentApprovalLevel: number;
    rejectedReason?: string | null;
    createdAt: string;
    createdByUser?: { firstName: string; lastName: string } | null;
    payments?: Array<{
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      amount: number;
      fee: number;
      wallet: Wallet;
      status: string;
    }> | null;
    approversByLevel?: Array<{
      level: number;
      approverIds?: string[] | null;
      approvers?: Array<{ id: string; firstName: string; lastName: string }> | null;
    }> | null;
    approvals?: Array<{ level: number; approverId: string; approvedAt?: string | null }> | null;
  };
}

const FetchOrderForApproverByIdDocument = gql`
  query FetchOrderForApproverById($id: String!) {
    fetchOrderForApproverById(id: $id) {
      id
      label
      totalAmount
      totalFees
      status
      currentApprovalLevel
      rejectedReason
      createdAt
      createdByUser {
        firstName
        lastName
      }
      payments {
        id
        firstName
        lastName
        phoneNumber
        amount
        fee
        wallet
        status
      }
      approversByLevel {
        level
        approverIds
        approvers {
          id
          firstName
          lastName
        }
      }
      approvals {
        level
        approverId
        approvedAt
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class FetchOrderForApproverByIdGQL extends Apollo.Query<
  FetchOrderForApproverByIdQuery,
  FetchOrderForApproverByIdQueryVariables
> {
  document = FetchOrderForApproverByIdDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface FetchBulkPaymentOrderByIdQueryVariables {
  id: string;
}

export interface FetchBulkPaymentOrderByIdQuery {
  fetchBulkPaymentOrderById: {
    id: string;
    label: string;
    totalAmount: number;
    status: BulkPaymentOrderStatus;
    type?: string | null;
    payments?: Array<{
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      amount: number;
      wallet: Wallet;
    }> | null;
    approversByLevel?: Array<{
      level: number;
      approverIds?: string[] | null;
      approvers?: Array<{ id: string; firstName: string; lastName: string }> | null;
    }> | null;
  };
}

export interface ApprovalLevelSelectionInput {
  level: number;
  approverIds: string[];
}

export interface SubmitBulkPaymentOrderMutationVariables {
  id: string;
  approversByLevel?: ApprovalLevelSelectionInput[];
}

export interface SubmitBulkPaymentOrderMutation {
  submitBulkPaymentOrder: {
    id: string;
    status: BulkPaymentOrderStatus;
  };
}

const FetchBulkPaymentOrderByIdDocument = gql`
  query FetchBulkPaymentOrderById($id: String!) {
    fetchBulkPaymentOrderById(id: $id) {
      id
      label
      totalAmount
      status
      type
      payments {
        id
        firstName
        lastName
        phoneNumber
        amount
        wallet
      }
      approversByLevel {
        level
        approverIds
        approvers {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class FetchBulkPaymentOrderByIdGQL extends Apollo.Query<
  FetchBulkPaymentOrderByIdQuery,
  FetchBulkPaymentOrderByIdQueryVariables
> {
  document = FetchBulkPaymentOrderByIdDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

const SubmitBulkPaymentOrderDocument = gql`
  mutation SubmitBulkPaymentOrder($id: String!, $approversByLevel: [ApprovalLevelInput!]) {
    submitBulkPaymentOrder(id: $id, approversByLevel: $approversByLevel) {
      id
      status
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class SubmitBulkPaymentOrderGQL extends Apollo.Mutation<
  SubmitBulkPaymentOrderMutation,
  SubmitBulkPaymentOrderMutationVariables
> {
  document = SubmitBulkPaymentOrderDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface FetchMyBulkPaymentHistoryQuery {
  fetchMyBulkPaymentHistory: Array<{
    id: string;
    label: string;
    status: BulkPaymentOrderStatus;
    totalAmount: number;
    totalFees?: number | null;
    createdAt: string;
    payments?: Array<{
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      amount: number;
      fee?: number | null;
      wallet: Wallet;
      status: string;
      providerReference?: string | null;
      failureReason?: string | null;
      paidAt?: string | null;
      updatedAt?: string | null;
    }> | null;
  }>;
}

const FetchMyBulkPaymentHistoryDocument = gql`
  query FetchMyBulkPaymentHistory {
    fetchMyBulkPaymentHistory {
      id
      label
      status
      totalAmount
      totalFees
      createdAt
      payments {
        id
        firstName
        lastName
        phoneNumber
        amount
        fee
        wallet
        status
        providerReference
        failureReason
        paidAt
        updatedAt
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class FetchMyBulkPaymentHistoryGQL extends Apollo.Query<
  FetchMyBulkPaymentHistoryQuery,
  {}
> {
  document = FetchMyBulkPaymentHistoryDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface FetchOrdersForApproverQuery {
  fetchOrdersForApprover: Array<{
    id: string;
    label: string;
    totalAmount: number;
    totalFees?: number | null;
    status: BulkPaymentOrderStatus;
    currentApprovalLevel: number;
    paymentsCount: number;
    createdAt: string;
    createdByUser?: { firstName: string; lastName: string } | null;
    approversByLevel?: Array<{
      level: number;
      approverIds?: string[] | null;
      approvers?: Array<{ id: string; firstName: string; lastName: string }> | null;
    }> | null;
    approvals?: Array<{ approverId: string }> | null;
    isApprovedByCurrentUser?: boolean | null;
  }>;
}

const FetchOrdersForApproverDocument = gql`
  query FetchOrdersForApprover {
    fetchOrdersForApprover {
      id
      label
      totalAmount
      totalFees
      status
      currentApprovalLevel
      paymentsCount
      createdAt
      createdByUser {
        firstName
        lastName
      }
      approversByLevel {
        level
        approverIds
        approvers {
          id
          firstName
          lastName
        }
      }
      approvals {
        approverId
      }
      isApprovedByCurrentUser
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class FetchOrdersForApproverGQL extends Apollo.Query<
  FetchOrdersForApproverQuery,
  {}
> {
  document = FetchOrdersForApproverDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface ApproverOrdersQueryFilter {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface FetchPaginatedOrdersForApproverQueryVariables {
  queryFilter: ApproverOrdersQueryFilter;
}

export interface FetchPaginatedOrdersForApproverQuery {
  fetchPaginatedOrdersForApprover: {
    results: Array<{
      id: string;
      label: string;
      totalAmount: number;
      totalFees?: number | null;
      status: BulkPaymentOrderStatus;
      currentApprovalLevel: number;
      paymentsCount: number;
      createdAt: string;
      createdByUser?: { firstName: string; lastName: string } | null;
      approversByLevel?: Array<{ level: number }> | null;
      isApprovedByCurrentUser?: boolean | null;
    }>;
    pagination: { totalItems: number; pageCount: number; currentPage: number; pageSize: number };
    counts: { pending: number; approved: number; rejected: number };
  };
}

const FetchPaginatedOrdersForApproverDocument = gql`
  query FetchPaginatedOrdersForApprover($queryFilter: QueryDataConfigInput) {
    fetchPaginatedOrdersForApprover(queryFilter: $queryFilter) {
      results {
        id
        label
        totalAmount
        totalFees
        status
        currentApprovalLevel
        paymentsCount
        createdAt
        createdByUser {
          firstName
          lastName
        }
        approversByLevel {
          level
        }
        isApprovedByCurrentUser
      }
      pagination {
        totalItems
        pageCount
        currentPage
        pageSize
      }
      counts {
        pending
        approved
        rejected
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class FetchPaginatedOrdersForApproverGQL extends Apollo.Query<
  FetchPaginatedOrdersForApproverQuery,
  FetchPaginatedOrdersForApproverQueryVariables
> {
  document = FetchPaginatedOrdersForApproverDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface UpdateBulkPaymentOrderMutationVariables {
  id: string;
  inputs: BulkPaymentInput[];
  label: string;
}

export interface UpdateBulkPaymentOrderMutation {
  updateBulkPaymentOrder: {
    id: string;
    label: string;
    status: BulkPaymentOrderStatus;
  };
}

const UpdateBulkPaymentOrderDocument = gql`
  mutation UpdateBulkPaymentOrder($id: String!, $inputs: [BulkPaymentInput!]!, $label: String!) {
    updateBulkPaymentOrder(id: $id, inputs: $inputs, label: $label) {
      id
      label
      status
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class UpdateBulkPaymentOrderGQL extends Apollo.Mutation<
  UpdateBulkPaymentOrderMutation,
  UpdateBulkPaymentOrderMutationVariables
> {
  document = UpdateBulkPaymentOrderDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface UpdateSubmittedBulkPaymentOrderMutationVariables {
  id: string;
  inputs: BulkPaymentInput[];
  label: string;
  approversByLevel?: ApprovalLevelSelectionInput[];
  reason: string;
}

export interface UpdateSubmittedBulkPaymentOrderMutation {
  updateSubmittedBulkPaymentOrder: {
    id: string;
    label: string;
    status: BulkPaymentOrderStatus;
  };
}

const UpdateSubmittedBulkPaymentOrderDocument = gql`
  mutation UpdateSubmittedBulkPaymentOrder(
    $id: String!
    $inputs: [BulkPaymentInput!]!
    $label: String!
    $approversByLevel: [ApprovalLevelInput!]
    $reason: String!
  ) {
    updateSubmittedBulkPaymentOrder(id: $id, inputs: $inputs, label: $label, approversByLevel: $approversByLevel, reason: $reason) {
      id
      label
      status
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class UpdateSubmittedBulkPaymentOrderGQL extends Apollo.Mutation<
  UpdateSubmittedBulkPaymentOrderMutation,
  UpdateSubmittedBulkPaymentOrderMutationVariables
> {
  document = UpdateSubmittedBulkPaymentOrderDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface CancelBulkPaymentOrderMutationVariables {
  id: string;
  reason: string;
}

export interface CancelBulkPaymentOrderMutation {
  cancelBulkPaymentOrder: { id: string; status: BulkPaymentOrderStatus };
}

const CancelBulkPaymentOrderDocument = gql`
  mutation CancelBulkPaymentOrder($id: String!, $reason: String!) {
    cancelBulkPaymentOrder(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class CancelBulkPaymentOrderGQL extends Apollo.Mutation<
  CancelBulkPaymentOrderMutation,
  CancelBulkPaymentOrderMutationVariables
> {
  document = CancelBulkPaymentOrderDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface ApproveBulkPaymentOrderMutationVariables {
  id: string;
}

export interface ApproveBulkPaymentOrderMutation {
  approveBulkPaymentOrder: { id: string; status: BulkPaymentOrderStatus };
}

const ApproveBulkPaymentOrderDocument = gql`
  mutation ApproveBulkPaymentOrder($id: String!) {
    approveBulkPaymentOrder(id: $id) {
      id
      status
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class ApproveBulkPaymentOrderGQL extends Apollo.Mutation<
  ApproveBulkPaymentOrderMutation,
  ApproveBulkPaymentOrderMutationVariables
> {
  document = ApproveBulkPaymentOrderDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface RejectBulkPaymentOrderMutationVariables {
  id: string;
  reason?: string;
}

export interface RejectBulkPaymentOrderMutation {
  rejectBulkPaymentOrder: { id: string; status: BulkPaymentOrderStatus };
}

const RejectBulkPaymentOrderDocument = gql`
  mutation RejectBulkPaymentOrder($id: String!, $reason: String) {
    rejectBulkPaymentOrder(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class RejectBulkPaymentOrderGQL extends Apollo.Mutation<
  RejectBulkPaymentOrderMutation,
  RejectBulkPaymentOrderMutationVariables
> {
  document = RejectBulkPaymentOrderDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}

export interface RelaunchApproversMutationVariables {
  id: string;
}

export interface RelaunchApproversMutation {
  relaunchApprovers: { id: string; lastRelaunchAt?: string | null };
}

const RelaunchApproversDocument = gql`
  mutation RelaunchApprovers($id: String!) {
    relaunchApprovers(id: $id) {
      id
      lastRelaunchAt
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class RelaunchApproversGQL extends Apollo.Mutation<
  RelaunchApproversMutation,
  RelaunchApproversMutationVariables
> {
  document = RelaunchApproversDocument;
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
