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
      wallet: Wallet;
    }> | null;
    approvers?: Array<{ id: string; firstName: string; lastName: string }> | null;
    approvals?: Array<{ level: number; approverId: string; approvedAt?: string | null }> | null;
  };
}

const FetchOrderForApproverByIdDocument = gql`
  query FetchOrderForApproverById($id: String!) {
    fetchOrderForApproverById(id: $id) {
      id
      label
      totalAmount
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
        wallet
      }
      approvers {
        id
        firstName
        lastName
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
    payments?: Array<{
      id: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      amount: number;
      wallet: Wallet;
    }> | null;
    approvers?: Array<{
      id: string;
      firstName: string;
      lastName: string;
    }> | null;
  };
}

export interface SubmitBulkPaymentOrderMutationVariables {
  id: string;
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
      payments {
        id
        firstName
        lastName
        phoneNumber
        amount
        wallet
      }
      approvers {
        id
        firstName
        lastName
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
  mutation SubmitBulkPaymentOrder($id: String!) {
    submitBulkPaymentOrder(id: $id) {
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

export interface FetchOrdersForApproverQuery {
  fetchOrdersForApprover: Array<{
    id: string;
    label: string;
    totalAmount: number;
    status: BulkPaymentOrderStatus;
    currentApprovalLevel: number;
    paymentsCount: number;
    createdAt: string;
    createdByUser?: { firstName: string; lastName: string } | null;
    approvers?: Array<{ id: string; firstName: string; lastName: string }> | null;
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
      status
      currentApprovalLevel
      paymentsCount
      createdAt
      createdByUser {
        firstName
        lastName
      }
      approvers {
        id
        firstName
        lastName
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
