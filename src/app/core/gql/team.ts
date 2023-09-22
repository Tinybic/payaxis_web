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
        idRole
        role
        approvalAmount
        active
        email
      }
    }
  }
`;

const companymember_emails= gql`
query companymember_emails($idCompany: Int!, $emaillist: [String!]) {
  companymember_emails(idCompany: $idCompany, emaillist: $emaillist) {
    error
    code
    message
    data {
      email
      memberyn
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

const company_member_deactivate = gql`
  mutation company_member_deactivate($id: Int!, $revision: Int!) {
    company_member_deactivate(id: $id, revision: $revision) {
      error
      code
      message
      data
    }
  }
`;

const company_member_edit = gql`
  mutation company_member_edit(
    $idCompany: Int!
    $companymembers: [companymemberaccess!]
  ) {
    company_member_edit(
      idCompany: $idCompany
      companymembers: $companymembers
    ) {
      error
      code
      message
      data
    }
  }
`;

export {
  company_members,
  company_member_invite,
  company_member_deactivate,
  company_member_edit,
  companymember_emails
};
