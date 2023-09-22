import { gql } from 'apollo-angular';

const companyrole_list = gql`
query companyrole_list($idCompany: Int!) {
  companyrole_list(idCompany: $idCompany) {
    error
    code
    message
    data{
      roles{
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
      permissions{
        permissionId
        permissionName
        roleaccess{
          idRole
          access
        }
      }
    }
  }
}`

const companyrole_new = gql`
  mutation companyrole_new(
    $idCompany: Int!,
    $txtName: txtName_String_NotNull_maxLength_128!
    $permissionaccess: [permissionaccess!]) {
  companyrole_new(idCompany: $idCompany, txtName: $txtName, permissionaccess: $permissionaccess) {
    error
    code
    message
    data {
      id
      revision
    }
  }
}

`
const companyrole_update = gql`
  mutation companyrole_update(
  $id: Int!,
  $revision: Int!,
  $txtName: txtName_String_NotNull_maxLength_128!,
  $permissionaccess: [permissionaccess!]) {
  companyrole_update(
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
`
const companyrole_deactivate = gql`
  mutation companyrole_deactivate($id: Int!, $revision: Int!, $archive: Boolean!) {
    companyrole_deactivate(id: $id, revision: $revision, archive: $archive) {
      error
      code
      message
      data {
        id
        revision
      }
    }
  }
`

const permissionrole_update =gql`
mutation permissionrole_update($idCompany: Int!, $permissionId: Int!, $idRole: Int!, $access: Boolean!) {
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
`


export { companyrole_list, companyrole_new, companyrole_update, companyrole_deactivate, permissionrole_update };
