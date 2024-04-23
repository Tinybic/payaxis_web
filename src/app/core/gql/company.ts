import { gql } from 'apollo-angular';

const companyNew = gql`
  mutation company_new(
    $txtName: txtName_String_NotNull_maxLength_128!
    $taxId: taxId_String_NotNull_maxLength_50!
    $idMasterCompany: Int!
    $industry: industry_String_NotNull_maxLength_50!
    $paymentTerms: paymentTerms_String_NotNull_maxLength_50!
    $website: website_String_NotNull_maxLength_180!
    $txtAddress: txtAddress_String_NotNull_maxLength_80!
    $suiteNumber: suiteNumber_String_NotNull_maxLength_30!
    $txtCity: txtCity_String_NotNull_maxLength_80!
    $txtState: txtState_String_NotNull_maxLength_80!
    $txtZipcode: txtZipcode_String_NotNull_maxLength_10!
    $contactNumber: contactNumber_String_NotNull_maxLength_20!
    $description: description_String_NotNull_maxLength_512!
    $avatar: avatar_String_NotNull_maxLength_512!
  ) {
    company_new(
      txtName: $txtName
      taxId: $taxId
      idMasterCompany: $idMasterCompany
      industry: $industry
      paymentTerms: $paymentTerms
      website: $website
      txtAddress: $txtAddress
      suiteNumber: $suiteNumber
      txtCity: $txtCity
      txtState: $txtState
      txtZipcode: $txtZipcode
      contactNumber: $contactNumber
      description: $description
      avatar: $avatar
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

const companyUpate = gql`
  mutation company_update(
    $id: Int!
    $revision: Int!
    $txtName: txtName_String_NotNull_maxLength_128!
    $taxId: taxId_String_NotNull_maxLength_50!
    $idMasterCompany: Int!
    $industry: industry_String_NotNull_maxLength_50!
    $paymentTerms: paymentTerms_String_NotNull_maxLength_50!
    $website: website_String_NotNull_maxLength_180!
    $txtAddress: txtAddress_String_NotNull_maxLength_80!
    $suiteNumber: suiteNumber_String_NotNull_maxLength_30!
    $txtCity: txtCity_String_NotNull_maxLength_80!
    $txtState: txtState_String_NotNull_maxLength_80!
    $txtZipcode: txtZipcode_String_NotNull_maxLength_10!
    $contactNumber: contactNumber_String_NotNull_maxLength_20!
    $description: description_String_NotNull_maxLength_512!
    $avatar: avatar_String_NotNull_maxLength_512!
  ) {
    company_update(
      id: $id
      revision: $revision
      txtName: $txtName
      taxId: $taxId
      idMasterCompany: $idMasterCompany
      industry: $industry
      paymentTerms: $paymentTerms
      website: $website
      txtAddress: $txtAddress
      suiteNumber: $suiteNumber
      txtCity: $txtCity
      txtState: $txtState
      txtZipcode: $txtZipcode
      contactNumber: $contactNumber
      description: $description
      avatar: $avatar
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

const company_list = gql`
  query company_list {
    company_list {
      error
      code
      message
      data {
        id
        avatar
        txtName
        active
        idUserOwner
        companyAccess {
          permissionId
          permissionName
          access
        }
      }
    }
  }
`;

const company_info = gql`
  query company_info($id: Int!) {
    company_info(id: $id) {
      error
      code
      message
      data {
        company {
          id
          revision
          idUserOwner
          avatar
          txtName
          taxId
          idMasterCompany
          industry
          paymentTerms
          website
          txtAddress
          suiteNumber
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
  }
`;

const company_roles = gql`
  query company_roles($idCompany: Int!) {
    company_roles(idCompany: $idCompany) {
      error
      code
      message
      data {
        idRole
        txtName
      }
    }
  }
`;
const company_invitedmember_deactivate = gql`
  mutation company_invitedmember_deactivate(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
  ) {
    company_invitedmember_deactivate(
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

const company_member_join = gql`
  mutation refactored49($idCompany: Int!) {
    company_member_join(idCompany: $idCompany) {
      error
      code
      message
      data
    }
  }
`;

const signature_new = gql`
mutation signature_new($idUser: Int!, $imageUrl: imageUrl_String_NotNull_maxLength_512!, $imageBase64: String!) {
  signature_new(idUser: $idUser, imageUrl: $imageUrl, imageBase64: $imageBase64) {
    error
    code
    message
    data
  }
}`

export {
  companyNew,
  companyUpate,
  company_list,
  company_info,
  company_roles,
  company_invitedmember_deactivate,
  company_member_join,
  signature_new,
};
