import { gql } from 'apollo-angular';
const projectinvoice_list = gql`
  query projectinvoice_list($idCompany: Int!, $idProject: Int!, $idVendor: Int!) {
    projectinvoice_list(idCompany: $idCompany, idProject: $idProject, idVendor: $idVendor) {
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
        idOrder1
        orderNumber
        vendorName
        vendorType
        txtAddress
        txtCity
        txtState
        invoiceNumber
        invoicedDate
        indvoicedueDate
        costCode
        costCodeName
        amount
        status
        active
      }
    }
  }
`;
const projectinvoice_deactivate = gql`
  mutation projectinvoice_deactivate(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
  ) {
    projectinvoice_deactivate(
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

const projectinvoice_mapping = gql`
mutation projectinvoice_mapping(
  $idCompany: Int!,
  $fileUrl: fileUrl_String_NotNull_maxLength_512!) {
    projectinvoice_mapping(idCompany: $idCompany, fileUrl: $fileUrl) {
      error
      code
      message
      data {
        idVendor
        vendorName
        invoiceNumber
        idProject
        projectName
        costCode
        costCodeName
        amount
        invoicedDate
        indvoicedueDate
        idOrder1
        orderNumber
        txtAddress
        txtCity
        txtState
        status
      }
    }
}`

const projectinvoice_new = gql`
  mutation projectinvoice_new(
    $idCompany: Int!,
    $idProject: Int!,
    $idVendor: Int!,
    $idOrder1: Int!,
    $invoiceNumber: invoiceNumber_String_NotNull_maxLength_25!,
    $invoicedDate: String!,
    $indvoicedueDate: String!,
    $costCode: costCode_String_NotNull_maxLength_15!,
    $amount: Float!,
    $invoiceFiles: [invoicefile!]) {
    projectinvoice_new(
      idCompany: $idCompany
      idProject: $idProject
      idVendor: $idVendor
      idOrder1: $idOrder1
      invoiceNumber: $invoiceNumber
      invoicedDate: $invoicedDate
      indvoicedueDate: $indvoicedueDate
      costCode: $costCode
      amount: $amount
      invoiceFiles: $invoiceFiles
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
`

const projectinvoice_update = gql`
  mutation projectinvoice_update(
    $idCompany: Int!,
    $id: Int!,
    $revision: Int!,
    $idProject: Int!,
    $idVendor: Int!,
    $idOrder1: Int!,
    $invoiceNumber: invoiceNumber_String_NotNull_maxLength_25!,
    $invoicedDate: String!,
    $indvoicedueDate: String!,
    $costCode: costCode_String_NotNull_maxLength_15!,
    $amount: Float!) {
    projectinvoice_update(
      idCompany: $idCompany
      id: $id
      revision: $revision
      idProject: $idProject
      idVendor: $idVendor
      idOrder1: $idOrder1
      invoiceNumber: $invoiceNumber
      invoicedDate: $invoicedDate
      indvoicedueDate: $indvoicedueDate
      costCode: $costCode
      amount: $amount
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
`

const projectinvoice_uploadfiles = gql`
  mutation projectinvoice_uploadfiles(
  $idCompany: Int!,
  $idInvoice: Int!,
  $invoiceFiles: [invoicefile!]) {
    projectinvoice_uploadfiles(
      idCompany: $idCompany
      idInvoice: $idInvoice
      invoiceFiles: $invoiceFiles
    ) {
      error
      code
      message
      data
    }
  }
`

const projectinvoice_deletefile = gql`
  mutation projectinvoice_deletefile(
    $idCompany: Int!,
    $idProjectinvoice_file: Int!,
    $revision: Int!) {
      projectinvoice_deletefile(
        idCompany: $idCompany
        idProjectinvoice_file: $idProjectinvoice_file
        revision: $revision
      ) {
        error
        code
        message
        data
      }
    }
`

const projectinvoice_attachment = gql`
  query projectinvoice_attachment($idCompany: Int!, $idInvoice: Int!) {
    projectinvoice_attachment(idCompany: $idCompany, idInvoice: $idInvoice) {
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
        idInvoice
        fileName
        fileSize
        fileType
        fileUrl
        active
      }
    }
  }
`

export {
  projectinvoice_list,
  projectinvoice_deactivate,
  projectinvoice_mapping,
  projectinvoice_new,
  projectinvoice_update,
  projectinvoice_uploadfiles,
  projectinvoice_deletefile,
  projectinvoice_attachment
};
