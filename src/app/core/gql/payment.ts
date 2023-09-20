import { gql } from 'apollo-angular';

const companypayment_new = gql`
  mutation companypayment_new(
    $idCompany: Int!
    $account: account_String_NotNull_maxLength_25!
    $routing: routing_String_NotNull_maxLength_15!
    $payType: payType_String_NotNull_maxLength_25!
    $bankName: bankName_String_NotNull_maxLength_128!
    $holderName: holderName_String_NotNull_maxLength_128!
    $email: email_String_NotNull_maxLength_180_format_email!
    $defaultPay: Boolean!
  ) {
    companypayment_new(
      idCompany: $idCompany
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

const companypayment_update = gql`
  mutation companypayment_update(
    $id: Int!
    $revision: Int!
    $account: account_String_NotNull_maxLength_25!
    $routing: routing_String_NotNull_maxLength_15!
    $bankName: bankName_String_NotNull_maxLength_128!
    $holderName: holderName_String_NotNull_maxLength_128!
    $email: email_String_NotNull_maxLength_180_format_email!
    $defaultPay: Boolean!
  ) {
    companypayment_update(
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

const companypayment_list = gql`
  query companypayment_list($idCompany: Int!) {
    companypayment_list(idCompany: $idCompany) {
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
        idCompany
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

const companypayment_setdefault = gql`
  mutation companypayment_setdefault(
    $id: Int!
    $revision: Int!
    $defaultPay: Boolean!
  ) {
    companypayment_setdefault(
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

const companypayment_deactivate = gql`
  mutation companypayment_deactivate($id: Int!, $revision: Int!) {
    companypayment_deactivate(id: $id, revision: $revision) {
      error
      code
      message
      data
    }
  }
`;

const bankname_routing = gql`
  query bankname_routing($idCompany: Int!, $routing: String!) {
    bankname_routing(idCompany: $idCompany, routing: $routing) {
      error
      code
      message
      data
    }
  }
`;
export {
  companypayment_new,
  companypayment_list,
  companypayment_update,
  companypayment_setdefault,
  companypayment_deactivate,
  bankname_routing,
};
