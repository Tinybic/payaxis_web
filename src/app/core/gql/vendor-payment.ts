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
const vendoradditional_update = gql`
  mutation vendoradditional_update(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $payto: payto_String_NotNull_maxLength_255!
    $federalId: federalId_String_NotNull_maxLength_25!
    $taxrate: Float!
    $discount: Float!
    $paymentTerms: paymentTerms_String_NotNull_maxLength_50!
    $form1099: Boolean!
  ) {
    vendoradditional_update(
      idCompany: $idCompany
      id: $id
      revision: $revision
      payto: $payto
      federalId: $federalId
      taxrate: $taxrate
      discount: $discount
      paymentTerms: $paymentTerms
      form1099: $form1099
    ) {
      error
      code
      message
      data
    }
  }
`;

const vendorinsurance_attachment = gql`
query vendorinsurance_attachment($idCompany: Int!, $idVendor: Int!) {
  vendorinsurance_attachment(idCompany: $idCompany, idVendor: $idVendor) {
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
      fileName
      fileSize
      fileType
      fileUrl
      active
    }
  }
}
`
const vendorinsurance_upload = gql`
mutation vendorinsurance_upload($idCompany: Int!, $idVendor: Int!, $insuranceFiles: [vendorfile!]) {
  vendorinsurance_upload(
    idCompany: $idCompany
    idVendor: $idVendor
    insuranceFiles: $insuranceFiles
  ) {
    error
    code
    message
    data
  }
}`

const vendorinsurance_delete = gql`
mutation vendorinsurance_delete($idCompany: Int!, $idVendor_insurance: Int!, $revision: Int!) {
  vendorinsurance_delete(
    idCompany: $idCompany
    idVendor_insurance: $idVendor_insurance
    revision: $revision
  ) {
    error
    code
    message
    data
  }
}

`


export {
  vendorpayment_list,
  vendorpayment_new,
  vendorpayment_update,
  vendorpayment_deactivate,
  vendorpayment_setdefault,
  vendoradditional_update,
  vendorinsurance_attachment,
  vendorinsurance_upload,
  vendorinsurance_delete,
};
