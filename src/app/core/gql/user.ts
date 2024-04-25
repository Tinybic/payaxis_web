import { gql } from 'apollo-angular';

const profile_2fa = gql`
  mutation profile_2fa($mobile: mobile_String_NotNull_pattern_093093094!) {
    profile_2fa(mobile: $mobile)
  }
`;

const profile_activate = gql`
  mutation profile_activate(
    $revision: Int!
    $mobile: String!
    $twofa: Boolean!
    $verificationCode: String!
  ) {
    profile_activate(
      revision: $revision
      mobile: $mobile
      twofa: $twofa
      verificationCode: $verificationCode
    ) {
      error
      code
      message
      data {
        token
        refreshToken
      }
    }
  }
`;

const profile_info = gql`
  query profile_info {
    profile_info {
      error
      code
      message
      data {
        id
        revision
        avatar
        firstName
        lastName
        mobile
        twofa
        socialMedia
        socialMediaToken
        companyName
        active
        memberyn
        welcomeyn
        email
        signatureUrl
      }
    }
  }
`;

const profile_update = gql`
  mutation profile_update(
    $idUser: Int!
    $revision: Int!
    $firstName: firstName_String_NotNull_minLength_1_maxLength_50!
    $lastName: lastName_String_NotNull_minLength_1_maxLength_50!
    $mobile: String!
  ) {
    profile_update(
      idUser: $idUser
      revision: $revision
      firstName: $firstName
      lastName: $lastName
      mobile: $mobile
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

const profile_avatar = gql`
  mutation profile_avatar(
    $idUser: Int!
    $revision: Int!
    $avatar: avatar_String_NotNull_maxLength_512!
  ) {
    profile_avatar(idUser: $idUser, revision: $revision, avatar: $avatar) {
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

export { profile_2fa, profile_activate, profile_info, profile_update,profile_avatar };
