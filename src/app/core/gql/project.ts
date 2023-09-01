import { gql } from 'apollo-angular';

const companyproject_list = gql`
query companyproject_list($idCompany: Int!) {
  companyproject_list(idCompany: $idCompany) {
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
      projectName
      projectAddress
      projectBudget
      projectSqft
      idCompany_payment
      status
      active
    }
  }
}`


const companyproject_new = gql`
mutation companyproject_new(
  $idCompany: Int!,
  $projectName: projectName_String_NotNull_maxLength_128!,
  $projectAddress: projectAddress_String_NotNull_maxLength_255!,
  $projectBudget: Float!,
  $projectSqft: Float!,
  $budgetAllocation: [allocatebudget!]) {
    companyproject_new(
      idCompany: $idCompany
      projectName: $projectName
      projectAddress: $projectAddress
      projectBudget: $projectBudget
      projectSqft: $projectSqft
      budgetAllocation: $budgetAllocation) {
        error
        code
        message
        data {
          id
          revision
        }
      }
  }`

export { companyproject_list, companyproject_new }
