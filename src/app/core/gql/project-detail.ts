import { gql } from 'apollo-angular';

const project_members = gql`
  query project_members($idCompany: Int!, $idProject: Int!) {
    project_members(idCompany: $idCompany, idProject: $idProject) {
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
        idProject
        idRole
        role
        approvalAmount
        active
      }
    }
  }
`;

const projectmember_invite = gql`
  mutation projectmember_invite(
    $idCompany: Int!
    $idProject: Int!
    $inviteMembers: [projectinvitemember!]
  ) {
    projectmember_invite(
      idCompany: $idCompany
      idProject: $idProject
      inviteMembers: $inviteMembers
    ) {
      error
      code
      message
      data
    }
  }
`;
const projectmember_deactivate = gql`
  mutation projectmember_deactivate(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
  ) {
    projectmember_deactivate(
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
const projectmember_edit = gql`
mutation projectmember_edit($idCompany: Int!, $idProject: Int!, $projectmembers: [projectmemberaccess!]) {
  projectmember_edit(
    idCompany: $idCompany
    idProject: $idProject
    projectmembers: $projectmembers
  ) {
    error
    code
    message
    data
  }
}
`;

export { project_members, projectmember_invite, projectmember_deactivate,projectmember_edit };
