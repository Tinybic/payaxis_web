import { gql } from 'apollo-angular';

const project_members = gql`
  query project_members($idProject: Int!) {
    project_members(idProject: $idProject) {
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
  mutation projectmember_deactivate($id: Int!, $revision: Int!) {
    projectmember_deactivate(id: $id, revision: $revision) {
      error
      code
      message
      data
    }
  }
`;

export { project_members, projectmember_invite, projectmember_deactivate };
