import { gql } from 'apollo-angular';

const companycategory_list = gql`
  query companycategory_list($idCompany: Int!) {
    companycategory_list(idCompany: $idCompany) {
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
        idCompany
        txtName
        active
        costcodecount
      }
    }
  }
`;

const companycategory_new = gql`
  mutation companycategory_new(
    $idCompany: Int!
    $txtName: txtName_String_NotNull_maxLength_128!
    $idProject: Int
  ) {
    companycategory_new(idCompany: $idCompany, txtName: $txtName, idProject: $idProject) {
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

const companycategory_update = gql`
  mutation companycategory_update(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $txtName: txtName_String_NotNull_maxLength_128!
  ) {
    companycategory_update(
      idCompany: $idCompany
      id: $id
      revision: $revision
      txtName: $txtName
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

const companycostcode_new = gql`
  mutation companycostcode_new(
    $idCompany: Int!
    $costCode: costCode_String_NotNull_maxLength_15!
    $txtName: txtName_String_NotNull_maxLength_128!
    $idCategory: Int!
    $txtNotes: txtNotes_String_NotNull_maxLength_512!
  ) {
    companycostcode_new(
      idCompany: $idCompany
      costCode: $costCode
      txtName: $txtName
      idCategory: $idCategory
      txtNotes: $txtNotes
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

const companycostcode_update = gql`
  mutation companycostcode_update(
    $idCompany: Int!
    $id: Int!
    $revision: Int!
    $txtName: txtName_String_NotNull_maxLength_128!
    $idCategory: Int!
    $txtNotes: txtNotes_String_NotNull_maxLength_512!
  ) {
    companycostcode_update(
      idCompany: $idCompany
      id: $id
      revision: $revision
      txtName: $txtName
      idCategory: $idCategory
      txtNotes: $txtNotes
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

const companycategory_deactivate = gql`
  mutation companycategory_deactivate(
    $idCompany: Int!
    $idCompany_category: Int!
    $revision: Int!
  ) {
    companycategory_deactivate(
      idCompany: $idCompany
      idCompany_category: $idCompany_category
      revision: $revision
    ) {
      error
      code
      message
      data
    }
  }
`;

const companycostcode_deactivate = gql`
  mutation companycostcode_deactivate(
    $idCompany: Int!
    $idCompany_costcode: Int!
    $revision: Int!
  ) {
    companycostcode_deactivate(
      idCompany: $idCompany
      idCompany_costcode: $idCompany_costcode
      revision: $revision
    ) {
      error
      code
      message
      data
    }
  }
`;

const companycostcode_list = gql`
  query companycostcode_list($idCompany: Int!) {
    companycostcode_list(idCompany: $idCompany) {
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
        idCompany
        costCode
        txtName
        idCategory
        category
        txtNotes
        active
        assignedvendor
      }
    }
  }
`;

const companycostcode_importcsv = gql`
  mutation companycostcode_importcsv($idCompany: Int!, $dataCSV: String!) {
    companycostcode_importcsv(idCompany: $idCompany, dataCSV: $dataCSV) {
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

const categorycostcode_list = gql`
  query categorycostcode_list($idCompany: Int!) {
    categorycostcode_list(idCompany: $idCompany) {
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
        idCompany
        txtName
        active
        costcodecount
        costcodelist {
          id
          txtName
          costCode
        }
      }
    }
  }
`;

const companycostcode_activate = gql`
  mutation companycostcode_activate(
    $idCompany: Int!
    $idCompany_costcode: Int!
    $revision: Int!
  ) {
    companycostcode_activate(
      idCompany: $idCompany
      idCompany_costcode: $idCompany_costcode
      revision: $revision
    ) {
      error
      code
      message
      data
    }
  }
`;

export {
  companycategory_list,
  companycategory_new,
  companycategory_update,
  companycategory_deactivate,
  companycostcode_new,
  companycostcode_update,
  companycostcode_deactivate,
  companycostcode_list,
  companycostcode_importcsv,
  categorycostcode_list,
  companycostcode_activate,
};
