import { gql } from 'apollo-angular';

const companycategory_list = gql`
  query companycategory_list($idCompany: Int!) {
    companycategory_list(idCompany: $idCompany) {
      error
      code
      message
      data {
        idCategory
        txtName
      }
    }
  }
`;

const companycostcode_new = gql`
  mutation companycostcode_new(
    $idCompany: Int!
    $costCode: costCode_String_NotNull_maxLength_15!
    $txtName: txtName_String_NotNull_maxLength_128!
    $category: category_String_NotNull_maxLength_50!
    $txtNotes: txtNotes_String_NotNull_maxLength_512!
  ) {
    companycostcode_new(
      idCompany: $idCompany
      costCode: $costCode
      txtName: $txtName
      category: $category
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
        idCategory
        txtName
        active
        costcodelist {
          id
          revision
          costCode
          txtName
          category
          txtNotes
          active
        }
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

export {
  companycategory_list,
  companycostcode_new,
  companycostcode_list,
  companycostcode_importcsv,
};
