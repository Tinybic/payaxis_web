import { gql } from 'apollo-angular';
const projectpayment_new = gql`
  mutation projectpayment_new(
    $idCompany: Int!
    $idProject: Int!
    $idVendor: Int!
    $idOrder1: Int!
    $idCompany_payment: Int!
    $billNumber: billNumber_String_NotNull_maxLength_25!
    $costCode: String
    $sentDate: String!
    $dueDate: String!
    $paymentTerms: paymentTerms_String_NotNull_maxLength_50!
    $amount: Float!
    $txtNotes: txtNotes_String_NotNull_maxLength_512!
    $paymentFiles: [paymentfile!]
    $billyn: Boolean
  ) {
    projectpayment_new(
      idCompany: $idCompany
      idProject: $idProject
      idVendor: $idVendor
      idOrder1: $idOrder1
      idCompany_payment: $idCompany_payment
      billNumber: $billNumber
      costCode: $costCode
      sentDate: $sentDate
      dueDate: $dueDate
      paymentTerms: $paymentTerms
      amount: $amount
      txtNotes: $txtNotes
      paymentFiles: $paymentFiles
      billyn: $billyn
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

const projectpayment_list = gql`
  query projectpayment_list(
    $idCompany: Int!
    $idProject: Int!
    $idVendor: Int!
  ) {
    projectpayment_list(
      idCompany: $idCompany
      idProject: $idProject
      idVendor: $idVendor
    ) {
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
        idProject
        projectName
        idVendor
        vendorName
        vendorType
        txtAddress
        txtCity
        txtState
        primaryContact
        email
        phone
        avatar
        idOrder1
        orderNumber
        orderDue
        orderStatus
        costcodes {
          costCode
          txtName
        }
        idCompany_payment
        account
        payType
        holderName
        billNumber
        sentDate
        dueDate
        paymentTerms
        amount
        txtNotes
        status
        active
      }
    }
  }
`;

const projectbill_list = gql`
query projectbill_list($idCompany: Int!, $idProject: Int!, $idVendor: Int!) {
  projectbill_list(
    idCompany: $idCompany
    idProject: $idProject
    idVendor: $idVendor
  ) {
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
      idProject
      projectName
      idVendor
      vendorName
      vendorType
      txtAddress
      txtCity
      txtState
      primaryContact
      email
      phone
      avatar
      senderFirstname
      senderLastname
      senderAvatar
      senderEmail
      idOrder1
      orderNumber
      orderDue
      orderStatus
      costcodes{
        costCode
        txtName
      }
      idCompany_payment
      account
      payType
      holderName
      billNumber
      sentDate
      dueDate
      paymentTerms
      amount
      txtNotes
      status
      active
    }
  }
}

`;

export { projectpayment_new, projectpayment_list, projectbill_list };
