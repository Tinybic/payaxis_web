import { gql } from 'apollo-angular';

const compayDetail = gql`
  query company_details {
    company_details {
        company {
            id
            revision
            createdBy
            createdDate
            modifiedBy
            modifiedDate
            idUserOwner
            avatar
            txtName
            taxId
            idMasterCompany
            paymentTerms
            website
            txtAddress
            txtCity
            txtState
            txtZipcode
            contactNumber
            email
            description
            active
          }
          companyName
          comboxIndustry {
            id
            txtName
          }
          comboxPaymentTerms {
            id
            txtName
          }
    }
  }
`
export {compayDetail}