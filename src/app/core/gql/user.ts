import { gql } from 'apollo-angular';

const profile_2fa = gql`
  mutation profile_2fa($mobile: mobile_String_NotNull_pattern_093093094!) {
    profile_2fa(mobile: $mobile)
  }
`;

const profile_activate = gql`
  mutation profile_activate(
    $revision: Int!
    $firstName: String!
    $lastName: String!
    $companyName: String!
    $mobile: String!
    $twofa: Boolean!
    $verificationCode: String!
  ) {
    profile_activate(
      revision: $revision
      firstName: $firstName
      lastName: $lastName
      companyName: $companyName
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
    }
  }
}
`;

export { profile_2fa, profile_activate,profile_info };
