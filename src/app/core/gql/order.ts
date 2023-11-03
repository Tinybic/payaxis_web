import { gql } from 'apollo-angular';

const projectorder_newnumber = gql`
  query projectorder_newnumber($idCompany: Int!) {
    projectorder_newnumber(idCompany: $idCompany) {
      error
      code
      message
      data
    }
  }
`;

const projectorder_reasonlist = gql`
  query projectorder_reasonlist($idCompany: Int!) {
    projectorder_reasonlist(idCompany: $idCompany) {
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
        txtName
        active
      }
    }
  }
`;

const projectorder_new = gql`
  mutation projectorder_new(
    $idCompany: Int!
    $idProject: Int!
    $idVendor: Int!
    $orderNumber: Int!
    $idReason: Int!
    $invoiceNumber: invoiceNumber_String_NotNull_maxLength_25!
    $invoicedDate: String!
    $indvoicedueDate: String!
    $paymentTerms: paymentTerms_String_NotNull_maxLength_50!
    $costCode: costCode_String_NotNull_maxLength_15!
    $notes: notes_String_NotNull_maxLength_255!
    $nontaxable: Float!
    $taxable: Float!
    $taxrate: Float!
    $tax: Float!
    $total: Float!
    $listItems: [projectorder2!]
  ) {
    projectorder_new(
      idCompany: $idCompany
      idProject: $idProject
      idVendor: $idVendor
      orderNumber: $orderNumber
      idReason: $idReason
      invoiceNumber: $invoiceNumber
      invoicedDate: $invoicedDate
      indvoicedueDate: $indvoicedueDate
      paymentTerms: $paymentTerms
      costCode: $costCode
      notes: $notes
      nontaxable: $nontaxable
      taxable: $taxable
      taxrate: $taxrate
      tax: $tax
      total: $total
      listItems: $listItems
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

const projectorder_info = gql`
  query projectorder_info($idCompany: Int!, $id: Int!) {
    projectorder_info(idCompany: $idCompany, id: $id) {
      error
      code
      message
      data {
        projectOrder {
          id
          revision
          idCompany
          idProject
          idVendor
          orderNumber
          idReason
          invoiceNumber
          invoicedDate
          indvoicedueDate
          paymentTerms
          costCode
          notes
          nontaxable
          taxable
          taxrate
          tax
          total
          paidAmount
          status
          active
        }
        listItems {
          id
          revision
          idOrder1
          upc
          description
          unit
          qty
          price
          amount
          taxyn
          notes
          paidyn
          active
          modifiedDate
        }
      }
    }
  }
`;

const projectorder_update = gql`
  mutation projectorder_update(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $idReason: Int!
    $idProject: Int!
    $idVendor: Int!
    $invoiceNumber: invoiceNumber_String_NotNull_maxLength_25!
    $invoicedDate: String!
    $indvoicedueDate: String!
    $paymentTerms: paymentTerms_String_NotNull_maxLength_50!
    $costCode: costCode_String_NotNull_maxLength_15!
    $notes: notes_String_NotNull_maxLength_255!
    $nontaxable: Float!
    $taxable: Float!
    $tax: Float!
    $total: Float!
    $listItems: [projectorder2!]
  ) {
    projectorder_update(
      idCompany: $idCompany
      id: $id
      revision: $revision
      idReason: $idReason
      idProject: $idProject
      idVendor: $idVendor
      invoiceNumber: $invoiceNumber
      invoicedDate: $invoicedDate
      indvoicedueDate: $indvoicedueDate
      paymentTerms: $paymentTerms
      costCode: $costCode
      notes: $notes
      nontaxable: $nontaxable
      taxable: $taxable
      tax: $tax
      total: $total
      listItems: $listItems
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

const projectorder_related = gql`
  query projectorder_related(
    $idCompany: Int!
    $idProject: Int!
    $idVendor: Int!
    $paidyn: Boolean!
  ) {
    projectorder_related(
      idCompany: $idCompany
      idProject: $idProject
      idVendor: $idVendor
      paidyn: $paidyn
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
`;

export {
  projectorder_newnumber,
  projectorder_reasonlist,
  projectorder_new,
  projectorder_info,
  projectorder_update,
  projectorder_related,
};
