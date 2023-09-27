import { gql } from 'apollo-angular';

const companyrole_list = gql`
  query companyrole_list($idCompany: Int!) {
    companyrole_list(idCompany: $idCompany) {
      error
      code
      message
      data {
        roles {
          id
          revision
          createdBy
          createdDate
          modifiedBy
          modifiedDate
          idCompany
          idRole
          txtName
          active
          usedCount
          access
        }
        permissions {
          permissionId
          permissionName
          roleaccess {
            idRole
            access
          }
        }
      }
    }
  }
`;

const companyrole_new = gql`
  mutation companyrole_new(
    $idCompany: Int!
    $txtName: txtName_String_NotNull_maxLength_128!
    $permissionaccess: [permissionaccess!]
  ) {
    companyrole_new(
      idCompany: $idCompany
      txtName: $txtName
      permissionaccess: $permissionaccess
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
const companyrole_update = gql`
  mutation companyrole_update(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $txtName: txtName_String_NotNull_maxLength_128!
    $permissionaccess: [permissionaccess!]
  ) {
    companyrole_update(
      idCompany: $idCompany
      id: $id
      revision: $revision
      txtName: $txtName
      permissionaccess: $permissionaccess
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
const companyrole_deactivate = gql`
  mutation companyrole_deactivate(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $active: Boolean!
  ) {
    companyrole_deactivate(
      idCompany: $idCompany
      id: $id
      revision: $revision
      active: $active
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

const permissionrole_update = gql`
  mutation permissionrole_update(
    $idCompany: Int!
    $permissionId: Int!
    $idRole: Int!
    $access: Boolean!
  ) {
    permissionrole_update(
      idCompany: $idCompany
      permissionId: $permissionId
      idRole: $idRole
      access: $access
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

export {
  companyrole_list,
  companyrole_new,
  companyrole_update,
  companyrole_deactivate,
  permissionrole_update,
};
