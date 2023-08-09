import { gql } from 'apollo-angular';

const vendorcontact_list = gql`
query vendorcontact_list($idVendor: Int!) {
  vendorcontact_list(idVendor: $idVendor) {
    error
    code
    message
    data{
      id
      revision
      createdBy
      createdDate
      modifiedBy
      modifiedDate
      idVendor
      contactName
      email
      phone
      notes
      active
    }
  }
}`

const vendorcontact_info = gql`
query vendorcontact_info($idVendor_contact: Int!) {
  vendorcontact_info(idVendor_contact: $idVendor_contact) {
    error
    code
    message
    data{
      id
      revision
      createdBy
      createdDate
      modifiedBy
      modifiedDate
      idVendor
      contactName
      email
      phone
      notes
      active
    }
  }
}`

const vendorcontact_new = gql`
mutation vendorcontact_new(
  $idVendor: Int!,
  $contactName: contactName_String_NotNull_maxLength_128!,
  $email: email_String_NotNull_maxLength_180_format_email!,
  $phone: phone_String_NotNull_maxLength_20!,
  $notes: notes_String_NotNull_maxLength_250!
) {
  vendorcontact_new(
    idVendor: $idVendor
    contactName: $contactName
    email: $email
    phone: $phone
    notes: $notes
  ) {
    error
    code
    message
    data {
      id
    }
  }
}
`

const vendorcontact_update = gql`
mutation vendorcontact_update(
  $id: Int!,
  $revision: Int!,
  $contactName: contactName_String_NotNull_maxLength_128!,
  $email: email_String_NotNull_maxLength_180_format_email!,
  $phone: phone_String_NotNull_maxLength_20!,
  $notes: notes_String_NotNull_maxLength_250!) {
  vendorcontact_update(
    id: $id
    revision: $revision
    contactName: $contactName
    email: $email
    phone: $phone
    notes: $notes
  ) {
    error
    code
    message
    data {
      id
    }
  }
}
`

const vendorcontract_delete = gql`
mutation vendor_contract_delete($idVendor_contract: Int!, $revision: Int!) {
  vendor_contract_delete(
    idVendor_contract: $idVendor_contract
    revision: $revision
  ) {
    error
    code
    message
    data
  }
}
`


export { vendorcontact_list, vendorcontact_info, vendorcontact_new, vendorcontact_update, vendorcontract_delete };
