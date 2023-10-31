import { gql } from 'apollo-angular';
const projectinvoice_list = gql`
  query projectinvoice_list($idCompany: Int!, $idProject: Int!) {
    projectinvoice_list(idCompany: $idCompany, idProject: $idProject) {
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
export { projectinvoice_list, projectinvoice_deactivate };
