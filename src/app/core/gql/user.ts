import { gql } from 'apollo-angular';

const SignupStep1 = gql`
  mutation User_account_add($email: String!, $password: String!) {
    user_account_add(email: $email, password: $password) {
      error
      message
    }
  }
`;

export { SignupStep1 };
