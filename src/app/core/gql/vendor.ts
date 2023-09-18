import { gql } from 'apollo-angular';

const vendor_new = gql`
  mutation vendor_new(
    $idCompany: Int!
    $vendorName: vendorName_String_NotNull_maxLength_128!
    $vendorType: vendorType_String_NotNull_maxLength_50!
    $primaryContact: primaryContact_String_NotNull_maxLength_50!
    $email: email_String_NotNull_maxLength_180_format_email!
    $phone: phone_String_NotNull_maxLength_20!
    $website: website_String_NotNull_maxLength_180!
    $txtAddress: txtAddress_String_NotNull_maxLength_80!
    $suiteNumber: suiteNumber_String_NotNull_maxLength_30!
    $txtCity: txtCity_String_NotNull_maxLength_80!
    $txtState: txtState_String_NotNull_maxLength_80!
    $txtZipcode: txtZipcode_String_NotNull_maxLength_10!
    $vendorcostcodes: [vendorcostcode!]
    $vendorfiles: [vendorfile!]
  ) {
    vendor_new(
      idCompany: $idCompany
      vendorName: $vendorName
      vendorType: $vendorType
      primaryContact: $primaryContact
      email: $email
      phone: $phone
      website: $website
      txtAddress: $txtAddress
      suiteNumber: $suiteNumber
      txtCity: $txtCity
      txtState: $txtState
      txtZipcode: $txtZipcode
      vendorcostcodes: $vendorcostcodes
      vendorfiles: $vendorfiles
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

const vendor_update = gql`
  mutation vendor_update(
    $id: Int!
    $revision: Int!
    $vendorName: vendorName_String_NotNull_maxLength_128!
    $vendorType: vendorType_String_NotNull_maxLength_50!
    $primaryContact: primaryContact_String_NotNull_maxLength_50!
    $email: email_String_NotNull_maxLength_180_format_email!
    $phone: phone_String_NotNull_maxLength_20!
    $website: website_String_NotNull_maxLength_180!
    $txtAddress: txtAddress_String_NotNull_maxLength_80!
    $suiteNumber: suiteNumber_String_NotNull_maxLength_30!
    $txtCity: txtCity_String_NotNull_maxLength_80!
    $txtState: txtState_String_NotNull_maxLength_80!
    $txtZipcode: txtZipcode_String_NotNull_maxLength_10!
    $vendorcostcodes: [vendorcostcode!]
    $vendorfiles: [vendorfile!]
  ) {
    vendor_update(
      id: $id
      revision: $revision
      vendorName: $vendorName
      vendorType: $vendorType
      primaryContact: $primaryContact
      email: $email
      phone: $phone
      website: $website
      txtAddress: $txtAddress
      suiteNumber: $suiteNumber
      txtCity: $txtCity
      txtState: $txtState
      txtZipcode: $txtZipcode
      vendorcostcodes: $vendorcostcodes
      vendorfiles: $vendorfiles
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

const vendor_list = gql`
  query vendor_list($idCompany: Int!) {
    vendor_list(idCompany: $idCompany) {
      error
      code
      message
      data {
        id
        vendorName
        status
      }
    }
  }
`;

const vendor_info = gql`
  query vendor_info($id: Int!) {
    vendor_info(id: $id) {
      error
      code
      message
      data {
        vendor {
          id
          revision
          vendorName
          vendorType
          primaryContact
          idCompany
          email
          phone
          website
          txtAddress
          suiteNumber
          txtCity
          txtState
          txtZipcode
          active
        }
        vendorcostcodes {
          id
          revision
          idVendor
          costCode
          txtName
          active
        }
        vendorfiles {
          id
          revision
          fileName
          fileSize
          fileType
          fileUrl
          active
        }
      }
    }
  }
`;

const vendor_file_delete = gql`
  mutation vendor_file_delete($idVendor_file: Int!, $revision: Int!) {
    vendor_file_delete(idVendor_file: $idVendor_file, revision: $revision) {
      error
      code
      message
      data
    }
  }
`;

const vendor_archive = gql`
  mutation vendor_archive($id: Int!, $revision: Int!) {
    vendor_archive(id: $id, revision: $revision) {
      error
      code
      message
      data
    }
  }
`;

const quickbooks_downloadvendors = gql`
  mutation quickbooks_downloadvendors(
    $idCompany: Int!
    $realmid: String!
    $redirectUri: String!
    $url: String!
  ) {
    quickbooks_downloadvendors(
      idCompany: $idCompany
      realmid: $realmid
      redirectUri: $redirectUri
      url: $url
    ) {
      error
      code
      message
      data
    }
  }
`;

export {
  vendor_new,
  vendor_list,
  vendor_update,
  vendor_info,
  vendor_file_delete,
  vendor_archive,
  quickbooks_downloadvendors,
};
