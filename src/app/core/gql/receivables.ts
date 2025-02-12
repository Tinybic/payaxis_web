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
    $sentDate: sentDate_String_NotNull_format_date!
    $dueDate: dueDate_String_NotNull_format_date!
    $paymentTerms: paymentTerms_String_NotNull_maxLength_50!
    $amount: Float!
    $txtNotes: txtNotes_String_NotNull_maxLength_512!
    $paymentFiles: [paymentfile!]
    $idInvitedCompany: Int
    $vendorName: String
    $vendorEmail: String
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
      idInvitedCompany: $idInvitedCompany
      vendorName: $vendorName
      vendorEmail: $vendorEmail
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

const projectpayment_update = gql`
  mutation projectpayment_update(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
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
  ) {
    projectpayment_update(
      idCompany: $idCompany
      id: $id
      revision: $revision
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

const projectpayment_cancel = gql`
  mutation projectpayment_cancel($idCompany: Int!, $id: Int!, $revision: Int!) {
    projectpayment_cancel(idCompany: $idCompany, id: $id, revision: $revision) {
      error
      code
      message
      data
    }
  }
 `;

const projectpayment_info = gql`
  query projectpayment_info($idCompany: Int!, $id: Int!) {
    projectpayment_info(idCompany: $idCompany, id: $id) {
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
        idNewVendor
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
        idCompany_payment
        bankName
        account
        payType
        holderName
        billNumber
        costCode
        costCodeName
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
        paidDate
      }
    }
  }
`;

const projectbill_list = gql`
  query projectbill_list(
    $idCompany: Int!
    $idProject: Int!
    $idVendor: Int!
    $idOrder1: Int
  ) {
    projectbill_list(
      idCompany: $idCompany
      idProject: $idProject
      idVendor: $idVendor
      idOrder1: $idOrder1
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
        costcodes {
          costCode
          txtName
        }
        idCompany_payment
        account
        payType
        holderName
        billNumber
        costCode
        costCodeName
        sentDate
        dueDate
        paymentTerms
        amount
        txtNotes
        paidDate
        status
        active
      }
    }
  }
`;

const projectpayment_attachment = gql`
  query projectpayment_attachment($idCompany: Int!, $idPayment: Int!) {
    projectpayment_attachment(idCompany: $idCompany, idPayment: $idPayment) {
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
        firstName
        lastName
        avatar
        idPayment
        fileName
        fileSize
        fileType
        fileUrl
        active
      }
    }
  }
`;

const getassociatedcompany_list = gql`
  query getassociatedcompany_list($idCompany: Int!, $vendorEmail: String!) {
    getassociatedcompany_list(
      idCompany: $idCompany
      vendorEmail: $vendorEmail
    ) {
      error
      code
      message
      data {
        idInvitedCompany
        companyName
      }
    }
  }
`;

const projectpayment_pay = gql`
  mutation projectpayment_pay(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $idVendor: Int
    $paidDate: String!
    $amount: Float!
    $payMemo: payMemo_String_maxLength_255
  ) {
    projectpayment_pay(
      idCompany: $idCompany
      id: $id
      revision: $revision
      idVendor: $idVendor
      paidDate: $paidDate
      amount: $amount
      payMemo: $payMemo
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
const receivable_list = gql`
  query receivable_list($idCompany: Int!) {
    receivable_list(idCompany: $idCompany) {
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
        idNewVendor
        vendorName
        vendorType
        orderNumber
        txtAddress
        txtCity
        txtState
        idReason
        invoiceNumber
        invoicedDate
        indvoicedueDate
        paymentTerms
        costCode
        costCodeName
        notes
        nontaxable
        taxable
        taxrate
        tax
        total
        paidAmount
        pendingAmount
        remainingAmount
        idPayment
        status
        active
      }
    }
  }
`;

const projectorder_accept = gql`
mutation projectorder_accept($idCompany: Int!, $id: Int!, $revision: Int!) {
  projectorder_accept(idCompany: $idCompany, id: $id, revision: $revision) {
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

const projectorder_decline = gql`
mutation projectorder_decline($idCompany: Int!, $id: Int!, $revision: Int!) {
  projectorder_decline(idCompany: $idCompany, id: $id, revision: $revision) {
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

const projectpayment_paymultiple = gql`
mutation projectpayment_paymultiple($idCompany: Int!, $paymentOrders: [paymentorder!]) {
  projectpayment_paymultiple(idCompany: $idCompany, paymentOrders: $paymentOrders) {
    error
    code
    message
    data {
      error
      code
      message
      data {
        id
        revision
      }
    }
  }
}
`

export {
  projectpayment_new,
  projectpayment_list,
  projectbill_list,
  getassociatedcompany_list,
  projectpayment_info,
  projectpayment_attachment,
  projectpayment_pay,
  projectpayment_update,
  projectpayment_cancel,
  receivable_list,
  projectorder_accept,
  projectorder_decline,
  projectpayment_paymultiple
};
