import { gql } from 'apollo-angular';

const vendorpayment_list = gql`
  query vendorpayment_list($idCompany: Int!, $idVendor: Int!) {
    vendorpayment_list(idCompany: $idCompany, idVendor: $idVendor) {
      error
      code
      message
      data {
        id
        revision
        createdBy
        createdDate
        modifiedBy
        modifiedDate
        idVendor
        account
        routing
        payType
        bankName
        holderName
        email
        defaultPay
        nextCheck
        nextAch
        active
        linkedProjects
      }
    }
  }
`;

const vendorpayment_new = gql`
  mutation vendorpayment_new(
    $idCompany: Int!
    $idVendor: Int!
    $account: account_String_NotNull_maxLength_25!
    $routing: routing_String_NotNull_maxLength_15!
    $payType: payType_String_NotNull_maxLength_25!
    $bankName: bankName_String_NotNull_maxLength_128!
    $holderName: holderName_String_NotNull_maxLength_128!
    $email: email_String_NotNull_maxLength_180_format_email!
    $defaultPay: Boolean!
  ) {
    vendorpayment_new(
      idCompany: $idCompany
      idVendor: $idVendor
      account: $account
      routing: $routing
      payType: $payType
      bankName: $bankName
      holderName: $holderName
      email: $email
      defaultPay: $defaultPay
    ) {
      error
      code
      message
      data {
        id
        revision
      }
    }
  }
`;
const vendorpayment_update = gql`
  mutation vendorpayment_update(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $account: account_String_NotNull_maxLength_25!
    $routing: routing_String_NotNull_maxLength_15!
    $bankName: bankName_String_NotNull_maxLength_128!
    $holderName: holderName_String_NotNull_maxLength_128!
    $email: email_String_NotNull_maxLength_180_format_email!
    $defaultPay: Boolean!
  ) {
    vendorpayment_update(
      idCompany: $idCompany
      id: $id
      revision: $revision
      account: $account
      routing: $routing
      bankName: $bankName
      holderName: $holderName
      email: $email
      defaultPay: $defaultPay
    ) {
      error
      code
      message
      data {
        id
        revision
      }
    }
  }
`;

const vendorpayment_deactivate = gql`
  mutation vendorpayment_deactivate(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
  ) {
    vendorpayment_deactivate(
      idCompany: $idCompany
      id: $id
      revision: $revision
    ) {
      error
      code
      message
      data
    }
  }
`;

const vendorpayment_setdefault = gql`
  mutation vendorpayment_setdefault(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $defaultPay: Boolean!
  ) {
    vendorpayment_setdefault(
      idCompany: $idCompany
      id: $id
      revision: $revision
      defaultPay: $defaultPay
    ) {
      error
      code
      message
      data {
        id
        revision
      }
    }
  }
`;

export {
  vendorpayment_list,
  vendorpayment_new,
  vendorpayment_update,
  vendorpayment_deactivate,
  vendorpayment_setdefault,
};
