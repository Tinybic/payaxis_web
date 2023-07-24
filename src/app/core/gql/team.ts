import { gql } from 'apollo-angular';

const company_members = gql`
  query company_members($idCompany: Int!) {
    company_members(idCompany: $idCompany) {
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
        idUser
        idCompany
        idMasterRole
        role
        approvalAmount
        active
      }
    }
  }`

  export {company_members}