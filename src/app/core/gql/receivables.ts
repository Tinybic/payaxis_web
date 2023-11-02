import { gql } from 'apollo-angular';
const projectpayment_new = gql`
  mutation projectpayment_new(
    $idCompany: Int!
    $idProject: Int!
    $idVendor: Int!
    $idOrder1: Int!
    $idCompany_payment: Int!
    $billNumber: billNumber_String_NotNull_maxLength_25!
    $sentDate: String!
    $dueDate: String!
    $paymentTerms: paymentTerms_String_NotNull_maxLength_50!
    $amount: Float!
    $txtNotes: txtNotes_String_NotNull_maxLength_512!
    $paymentFiles: [paymentfile!]
  ) {
    projectpayment_new(
      idCompany: $idCompany
      idProject: $idProject
      idVendor: $idVendor
      idOrder1: $idOrder1
      idCompany_payment: $idCompany_payment
      billNumber: $billNumber
      sentDate: $sentDate
      dueDate: $dueDate
      paymentTerms: $paymentTerms
      amount: $amount
      txtNotes: $txtNotes
      paymentFiles: $paymentFiles
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

export { projectpayment_new };
