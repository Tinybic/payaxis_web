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
        idGroup
        groupName
        idCompany_payment
        color
        icon
        pinyn
        status
        active
      }
    }
  }
`;
const groupproject_list = gql`
  query groupproject_list($idCompany: Int!) {
    groupproject_list(idCompany: $idCompany) {
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
        projectcount
        projectlist {
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
          idGroup
          groupName
          idCompany_payment
          color
          icon
          pinyn
          status
          active
        }
      }
    }
  }
`;

const companyproject_new = gql`
  mutation companyproject_new(
    $idCompany: Int!
    $projectName: projectName_String_NotNull_maxLength_128!
    $projectAddress: projectAddress_String_NotNull_maxLength_255!
    $projectBudget: Float!
    $projectSqft: Float!
    $idGroup: Int!
    $budgetAllocation: [allocatebudget!]
  ) {
    companyproject_new(
      idCompany: $idCompany
      projectName: $projectName
      projectAddress: $projectAddress
      projectBudget: $projectBudget
      projectSqft: $projectSqft
      idGroup: $idGroup
      budgetAllocation: $budgetAllocation
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

const companygroup_list = gql`
  query companygroup_list($idCompany: Int!) {
    companygroup_list(idCompany: $idCompany) {
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
        projectcount
      }
    }
  }
`;

const companygroup_new = gql`
  mutation companygroup_new(
    $idCompany: Int!
    $txtName: txtName_String_NotNull_maxLength_128!
  ) {
    companygroup_new(idCompany: $idCompany, txtName: $txtName) {
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

const companyproject_coloricon = gql`
  mutation companyproject_coloricon(
    $id: Int!
    $revision: Int!
    $color: String!
    $icon: String!
  ) {
    companyproject_coloricon(
      id: $id
      revision: $revision
      color: $color
      icon: $icon
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

const companyproject_pin = gql`
  mutation companyproject_pin($id: Int!, $revision: Int!, $pinyn: Boolean!) {
    companyproject_pin(id: $id, revision: $revision, pinyn: $pinyn) {
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

export {
  companyproject_list,
  groupproject_list,
  companyproject_new,
  companygroup_list,
  companygroup_new,
  companyproject_coloricon,
  companyproject_pin,
};
