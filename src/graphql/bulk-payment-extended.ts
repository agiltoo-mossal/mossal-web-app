import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';
import { BulkPaymentOrderStatus, Wallet } from './generated';

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
