import { gql } from 'apollo-angular';

const projectorder_list = gql`
query projectorder_list($idCompany: Int!, $idProject: Int!) {
  projectorder_list(idCompany: $idCompany, idProject: $idProject) {
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
      orderNumber
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
      remainingAmount
      status
      active
    }
  }
}
`

const projectorder_uploadfiles = gql`
mutation projectorder_uploadfiles($idCompany: Int!, $idOrder1: Int!, $orderFiles: [orderfile!]) {
  projectorder_uploadfiles(
    idCompany: $idCompany
    idOrder1: $idOrder1
    orderFiles: $orderFiles
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

const projectorder_deletefile = gql`
mutation projectorder_deletefile($idCompany: Int!, $idProjectorder_file: Int!, $revision: Int!) {
  projectorder_deletefile(
    idCompany: $idCompany
    idProjectorder_file: $idProjectorder_file
    revision: $revision
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

export { projectorder_list, projectorder_uploadfiles, projectorder_deletefile };
