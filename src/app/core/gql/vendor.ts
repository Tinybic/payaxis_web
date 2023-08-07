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
    $vendorcontracts: [vendorcontract!]
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
      vendorcontracts: $vendorcontracts
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
      }
    }
  }
`;

export { vendor_new,vendor_list };
