import { gql } from 'apollo-angular';

const company_roles = gql`
query company_roles($idCompany: Int!) {
  company_roles(idCompany: $idCompany) {
    error
    code
    message
    data{
      id
      revision
      createdBy
      createdDate
      modifiedBy
      modifiedDate
      idCompany
      idRole
      txtName
      active
    }
  }
}`


export { company_roles };
