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
        canDelete
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

const companyproject_updatedetail = gql`
  mutation companyproject_updatedetail(
    $id: Int!
    $revision: Int!
    $projectName: projectName_String_NotNull_maxLength_128!
    $projectAddress: projectAddress_String_NotNull_maxLength_255!
    $idGroup: Int!
    $projectSqft: Float!
  ) {
    companyproject_updatedetail(
      id: $id
      revision: $revision
      projectName: $projectName
      projectAddress: $projectAddress
      idGroup: $idGroup
      projectSqft: $projectSqft
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

const companyproject_updatebudget = gql`
  mutation companyproject_updatebudget(
    $id: Int!
    $revision: Int!
    $projectBudget: Float!
    $budgetAllocation: [allocatebudget!]
  ) {
    companyproject_updatebudget(
      id: $id
      revision: $revision
      projectBudget: $projectBudget
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

const companyproject_moveto = gql`
  mutation companyproject_moveto($id: Int!, $revision: Int!, $idGroup: Int!) {
    companyproject_moveto(id: $id, revision: $revision, idGroup: $idGroup) {
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

const companyproject_delete = gql`
  mutation companyproject_delete($id: Int!, $revision: Int!) {
    companyproject_delete(id: $id, revision: $revision) {
      error
      code
      message
      data
    }
  }
`;

const companyproject_deactivate = gql`
  mutation companyproject_deactivate($id: Int!, $revision: Int!) {
    companyproject_deactivate(id: $id, revision: $revision) {
      error
      code
      message
      data
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

const companygroup_update = gql`
  mutation companygroup_update(
    $id: Int!
    $revision: Int!
    $txtName: txtName_String_NotNull_maxLength_128!
  ) {
    companygroup_update(id: $id, revision: $revision, txtName: $txtName) {
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

const companygroup_deactivate = gql`
  mutation companygroup_deactivate($idCompany_group: Int!, $revision: Int!) {
    companygroup_deactivate(
      idCompany_group: $idCompany_group
      revision: $revision
    ) {
      error
      code
      message
      data
    }
  }
`;
const companyproject_info = gql`
  query companyproject_info($id: Int!) {
    companyproject_info(id: $id) {
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
        canDelete
      }
    }
  }
`;
const projectbudget_list = gql`
  query projectbudget_list($idProject: Int!) {
    projectbudget_list(idProject: $idProject) {
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
        idProject
        idCategory
        category
        budgetPercentage
        budgetAmount
        active
      }
    }
  }
`;

export {
  companyproject_list,
  companyproject_new,
  companyproject_updatedetail,
  companyproject_updatebudget,
  companyproject_coloricon,
  companyproject_pin,
  companyproject_moveto,
  companyproject_delete,
  companyproject_deactivate,
  companygroup_list,
  companygroup_new,
  companygroup_update,
  companygroup_deactivate,
  companyproject_info,
  projectbudget_list,
};
