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
  }
`;

const company_member_invite = gql`
  mutation company_member_invite(
    $idCompany: Int!
    $inviteMembers: [invitemember!]
  ) {
    company_member_invite(
      idCompany: $idCompany
      inviteMembers: $inviteMembers
    ) {
      error
      code
      message
      data
    }
  }
`;

export { company_members, company_member_invite };
