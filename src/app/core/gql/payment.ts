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
    companypayment_update(
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
        verified
        active
        linkedProjects
        released
      }
    }
  }
`;

const companypayment_setdefault = gql`
  mutation companypayment_setdefault(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $defaultPay: Boolean!
  ) {
    companypayment_setdefault(
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

const companypayment_deactivate = gql`
  mutation companypayment_deactivate(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
  ) {
    companypayment_deactivate(
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

const companypayment_release = gql`
  mutation companypayment_release(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
  ) {
    companypayment_release(
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

const companypayment_verify = gql`
  mutation companypayment_verify(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $amount_1: Float!
    $amount_2: Float!
  ) {
    companypayment_verify(
      idCompany: $idCompany
      id: $id
      revision: $revision
      amount_1: $amount_1
      amount_2: $amount_2
    ) {
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
  companypayment_release,
  companypayment_verify,
};
