import { gql } from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  account_String_NotNull_maxLength_25: { input: any; output: any; }
  avatar_String_NotNull_maxLength_512: { input: any; output: any; }
  bankName_String_NotNull_maxLength_128: { input: any; output: any; }
  billNumber_String_NotNull_maxLength_25: { input: any; output: any; }
  category_String_NotNull_maxLength_50: { input: any; output: any; }
  contactName_String_NotNull_maxLength_128: { input: any; output: any; }
  contactNumber_String_NotNull_maxLength_20: { input: any; output: any; }
  costCode_String_NotNull_maxLength_15: { input: any; output: any; }
  description_String_NotNull_maxLength_512: { input: any; output: any; }
  email_String_NotNull_maxLength_180_format_email: { input: any; output: any; }
  federalId_String_NotNull_maxLength_25: { input: any; output: any; }
  fileName_String_NotNull_maxLength_128: { input: any; output: any; }
  fileType_String_NotNull_maxLength_15: { input: any; output: any; }
  fileUrl_String_NotNull_maxLength_512: { input: any; output: any; }
  holderName_String_NotNull_maxLength_128: { input: any; output: any; }
  industry_String_NotNull_maxLength_50: { input: any; output: any; }
  invoiceNumber_String_NotNull_maxLength_25: { input: any; output: any; }
  mobile_String_NotNull_pattern_093093094: { input: any; output: any; }
  notes_String_NotNull_maxLength_250: { input: any; output: any; }
  notes_String_NotNull_maxLength_255: { input: any; output: any; }
  payType_String_NotNull_maxLength_25: { input: any; output: any; }
  paymentTerms_String_NotNull_maxLength_50: { input: any; output: any; }
  payto_String_NotNull_maxLength_255: { input: any; output: any; }
  phone_String_NotNull_maxLength_20: { input: any; output: any; }
  primaryContact_String_NotNull_maxLength_50: { input: any; output: any; }
  projectAddress_String_NotNull_maxLength_255: { input: any; output: any; }
  projectName_String_NotNull_maxLength_128: { input: any; output: any; }
  routing_String_NotNull_maxLength_15: { input: any; output: any; }
  suiteNumber_String_NotNull_maxLength_30: { input: any; output: any; }
  taxId_String_NotNull_maxLength_50: { input: any; output: any; }
  txtAddress_String_NotNull_maxLength_80: { input: any; output: any; }
  txtCity_String_NotNull_maxLength_80: { input: any; output: any; }
  txtName_String_NotNull_maxLength_128: { input: any; output: any; }
  txtName_String_NotNull_maxLength_128_format_email: { input: any; output: any; }
  txtNotes_String_NotNull_maxLength_512: { input: any; output: any; }
  txtState_String_NotNull_maxLength_80: { input: any; output: any; }
  txtZipcode_String_NotNull_maxLength_10: { input: any; output: any; }
  vendorName_String_NotNull_maxLength_128: { input: any; output: any; }
  vendorType_String_NotNull_maxLength_50: { input: any; output: any; }
  website_String_NotNull_maxLength_180: { input: any; output: any; }
};

/** structure to handle table company_member */
export enum Folder {
  Avatarcompany = 'avatarcompany',
  Avataruser = 'avataruser',
  Bills = 'bills',
  Files = 'files'
}

/** structure to handle table sms */
export type Mutation = {
  __typename?: 'Mutation';
  /** deactivate company_invitedmember */
  company_invitedmember_deactivate: Invitememberresult;
  /** deactivate company_member */
  company_member_deactivate: Invitememberresult;
  /** manage company_member access */
  company_member_edit: Invitememberresult;
  /** new company_invitedmember */
  company_member_invite: Invitememberresult;
  /** request to join company */
  company_member_join: Invitememberresult;
  /** new company details */
  company_new: Comresult;
  /** update company details */
  company_update: Comresult;
  /** deactivate company_category */
  companycategory_deactivate: Costcodedeactivateeresult;
  /** new company_category */
  companycategory_new: Costcoderesult;
  /** update company_category */
  companycategory_update: Costcoderesult;
  /** activate company_costcode */
  companycostcode_activate: Costcodedeactivateeresult;
  /** deactivate company_costcode */
  companycostcode_deactivate: Costcodedeactivateeresult;
  /** import company_costcode from CSV */
  companycostcode_importcsv: Costcoderesult;
  /** new company_costcode */
  companycostcode_new: Costcoderesult;
  /** update company_costcode */
  companycostcode_update: Costcoderesult;
  /** deactivate company_group */
  companygroup_deactivate: Combooleanresult;
  /** new company_group */
  companygroup_new: Comresult;
  /** update company_group */
  companygroup_update: Comresult;
  /** deactivate companypayment */
  companypayment_deactivate: Paymentbooleanresult;
  /** new companypayment */
  companypayment_new: Paymentresult;
  /** favorite companypayment */
  companypayment_setdefault: Paymentresult;
  /** update companypayment */
  companypayment_update: Paymentresult;
  /** set color/icon for companyproject */
  companyproject_coloricon: Projectresult;
  /** deactivate companyproject */
  companyproject_deactivate: Projectbooleanresult;
  /** delete companyproject */
  companyproject_delete: Projectbooleanresult;
  /** moveto companyproject to group */
  companyproject_moveto: Projectresult;
  /** new companyproject */
  companyproject_new: Projectresult;
  /** pin companyproject */
  companyproject_pin: Projectresult;
  /** update companyproject budget */
  companyproject_updatebudget: Projectresult;
  /** update companyproject detail */
  companyproject_updatedetail: Projectresult;
  /** deactivate companyrole */
  companyrole_deactivate: Roleresult;
  /** new companyrole */
  companyrole_new: Roleresult;
  /** update companyrole */
  companyrole_update: Roleresult;
  /** update permissionrole */
  permissionrole_update: Roleresult;
  /** to activate the user profile */
  profile_2fa?: Maybe<Scalars['Boolean']['output']>;
  /** to activate the user profile */
  profile_activate: Response;
  /** deactivate project invoice */
  projectinvoice_deactivate: Projectinvoicebooleanresult;
  /** delete projectinvoice file */
  projectinvoice_deletefile: Projectinvoicebooleanresult;
  /** mapping attachment */
  projectinvoice_mapping: Invoicemappingresult;
  /** new project invoice */
  projectinvoice_new: Projectinvoiceresult;
  /** update project invoice */
  projectinvoice_update: Projectinvoiceresult;
  /** upload projectinvoice file */
  projectinvoice_uploadfiles: Projectinvoicebooleanresult;
  /** deactivate project member */
  projectmember_deactivate: Projectinvitememberresult;
  /** edit project member access */
  projectmember_edit: Projectinvitememberresult;
  /** invite project member */
  projectmember_invite: Projectinvitememberresult;
  /** deactivate project order */
  projectorder_deactivate: Projectorderbooleanresult;
  /** delete projectorder file */
  projectorder_deletefile: Projectorderbooleanresult;
  /** new project order */
  projectorder_new: Projectorderresult;
  /** update project order */
  projectorder_update: Projectorderresult;
  /** upload projectorder file */
  projectorder_uploadfiles: Projectorderbooleanresult;
  /** approve project payment */
  projectpayment_approve: Projectpaymentresult;
  /** deactivate project payment */
  projectpayment_deactivate: Projectpaymentbooleanresult;
  /** delete projectpayment file */
  projectpayment_deletefile: Projectpaymentbooleanresult;
  /** new project payment */
  projectpayment_new: Projectpaymentresult;
  /** open project payment */
  projectpayment_open: Projectpaymentresult;
  /** pay project payment */
  projectpayment_pay: Projectpaymentresult;
  /** reject project payment */
  projectpayment_reject: Projectpaymentresult;
  /** update project payment */
  projectpayment_update: Projectpaymentresult;
  /** upload projectpayment file */
  projectpayment_uploadfiles: Projectpaymentbooleanresult;
  /** download quickbooks vendors */
  quickbooks_downloadvendors: ResponseQuickbooks;
  /** upload quickbooks vendors */
  quickbooks_uploadvendors: ResponseQuickbooks;
  /** to send sms code */
  sms_send: Response;
  /** to verify the code */
  sms_verify?: Maybe<Scalars['Boolean']['output']>;
  /** mutation to add a new row */
  test1_add: Test1;
  /** mutation to delete a row, 1=success, 0=not found */
  test1_delete?: Maybe<Scalars['Int']['output']>;
  /** mutation to update a row, 1=success, 0=not found */
  test1_update?: Maybe<Scalars['Int']['output']>;
  /** archive vendor_account */
  vendor_archive: Vendordeleteresult;
  /** deactivate vendor_contact */
  vendor_contact_deactivate: Vendordeactivateeresult;
  /** delete vendor file */
  vendor_file_delete: Vendordeleteresult;
  /** vendor invitation */
  vendor_invite: Vendordeleteresult;
  /** new vendor_account */
  vendor_new: Vendorupdateresult;
  /** update vendor_account */
  vendor_update: Vendorupdateresult;
  /** update vendor additional */
  vendoradditional_update: Vendordeleteresult;
  /** new vendor_contact */
  vendorcontact_new: Vendorcontactresult;
  /** update vendor_contact */
  vendorcontact_update: Vendorcontactresult;
  /** delete insurance file */
  vendorinsurance_delete: Vendordeleteresult;
  /** upload insurance file */
  vendorinsurance_upload: Vendordeleteresult;
  /** deactivate vendorpayment */
  vendorpayment_deactivate: Vendorpaymentbooleanresult;
  /** new vendorpayment */
  vendorpayment_new: Vendorpaymentresult;
  /** favorite vendorpayment */
  vendorpayment_setdefault: Vendorpaymentresult;
  /** update vendorpayment */
  vendorpayment_update: Vendorpaymentresult;
};


/** structure to handle table sms */
export type MutationCompany_Invitedmember_DeactivateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompany_Member_DeactivateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompany_Member_EditArgs = {
  companymembers?: InputMaybe<Array<Companymemberaccess>>;
  idCompany: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompany_Member_InviteArgs = {
  idCompany: Scalars['Int']['input'];
  inviteMembers?: InputMaybe<Array<Invitemember>>;
};


/** structure to handle table sms */
export type MutationCompany_Member_JoinArgs = {
  idCompany: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompany_NewArgs = {
  avatar: Scalars['avatar_String_NotNull_maxLength_512']['input'];
  contactNumber: Scalars['contactNumber_String_NotNull_maxLength_20']['input'];
  description: Scalars['description_String_NotNull_maxLength_512']['input'];
  idMasterCompany: Scalars['Int']['input'];
  industry: Scalars['industry_String_NotNull_maxLength_50']['input'];
  paymentTerms: Scalars['paymentTerms_String_NotNull_maxLength_50']['input'];
  suiteNumber: Scalars['suiteNumber_String_NotNull_maxLength_30']['input'];
  taxId: Scalars['taxId_String_NotNull_maxLength_50']['input'];
  txtAddress: Scalars['txtAddress_String_NotNull_maxLength_80']['input'];
  txtCity: Scalars['txtCity_String_NotNull_maxLength_80']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
  txtState: Scalars['txtState_String_NotNull_maxLength_80']['input'];
  txtZipcode: Scalars['txtZipcode_String_NotNull_maxLength_10']['input'];
  website: Scalars['website_String_NotNull_maxLength_180']['input'];
};


/** structure to handle table sms */
export type MutationCompany_UpdateArgs = {
  avatar: Scalars['avatar_String_NotNull_maxLength_512']['input'];
  contactNumber: Scalars['contactNumber_String_NotNull_maxLength_20']['input'];
  description: Scalars['description_String_NotNull_maxLength_512']['input'];
  id: Scalars['Int']['input'];
  idMasterCompany: Scalars['Int']['input'];
  industry: Scalars['industry_String_NotNull_maxLength_50']['input'];
  paymentTerms: Scalars['paymentTerms_String_NotNull_maxLength_50']['input'];
  revision: Scalars['Int']['input'];
  suiteNumber: Scalars['suiteNumber_String_NotNull_maxLength_30']['input'];
  taxId: Scalars['taxId_String_NotNull_maxLength_50']['input'];
  txtAddress: Scalars['txtAddress_String_NotNull_maxLength_80']['input'];
  txtCity: Scalars['txtCity_String_NotNull_maxLength_80']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
  txtState: Scalars['txtState_String_NotNull_maxLength_80']['input'];
  txtZipcode: Scalars['txtZipcode_String_NotNull_maxLength_10']['input'];
  website: Scalars['website_String_NotNull_maxLength_180']['input'];
};


/** structure to handle table sms */
export type MutationCompanycategory_DeactivateArgs = {
  idCompany: Scalars['Int']['input'];
  idCompany_category: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanycategory_NewArgs = {
  idCompany: Scalars['Int']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
};


/** structure to handle table sms */
export type MutationCompanycategory_UpdateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
};


/** structure to handle table sms */
export type MutationCompanycostcode_ActivateArgs = {
  idCompany: Scalars['Int']['input'];
  idCompany_costcode: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanycostcode_DeactivateArgs = {
  idCompany: Scalars['Int']['input'];
  idCompany_costcode: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanycostcode_ImportcsvArgs = {
  dataCSV: Scalars['String']['input'];
  idCompany: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanycostcode_NewArgs = {
  costCode: Scalars['costCode_String_NotNull_maxLength_15']['input'];
  idCategory: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
  txtNotes: Scalars['txtNotes_String_NotNull_maxLength_512']['input'];
};


/** structure to handle table sms */
export type MutationCompanycostcode_UpdateArgs = {
  id: Scalars['Int']['input'];
  idCategory: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
  txtNotes: Scalars['txtNotes_String_NotNull_maxLength_512']['input'];
};


/** structure to handle table sms */
export type MutationCompanygroup_DeactivateArgs = {
  idCompany: Scalars['Int']['input'];
  idCompany_group: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanygroup_NewArgs = {
  idCompany: Scalars['Int']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
};


/** structure to handle table sms */
export type MutationCompanygroup_UpdateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
};


/** structure to handle table sms */
export type MutationCompanypayment_DeactivateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanypayment_NewArgs = {
  account: Scalars['account_String_NotNull_maxLength_25']['input'];
  bankName: Scalars['bankName_String_NotNull_maxLength_128']['input'];
  defaultPay: Scalars['Boolean']['input'];
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  holderName: Scalars['holderName_String_NotNull_maxLength_128']['input'];
  idCompany: Scalars['Int']['input'];
  payType: Scalars['payType_String_NotNull_maxLength_25']['input'];
  routing: Scalars['routing_String_NotNull_maxLength_15']['input'];
};


/** structure to handle table sms */
export type MutationCompanypayment_SetdefaultArgs = {
  defaultPay: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanypayment_UpdateArgs = {
  account: Scalars['account_String_NotNull_maxLength_25']['input'];
  bankName: Scalars['bankName_String_NotNull_maxLength_128']['input'];
  defaultPay: Scalars['Boolean']['input'];
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  holderName: Scalars['holderName_String_NotNull_maxLength_128']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
  routing: Scalars['routing_String_NotNull_maxLength_15']['input'];
};


/** structure to handle table sms */
export type MutationCompanyproject_ColoriconArgs = {
  color: Scalars['String']['input'];
  icon: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanyproject_DeactivateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanyproject_DeleteArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanyproject_MovetoArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  idGroup: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanyproject_NewArgs = {
  budgetAllocation?: InputMaybe<Array<Allocatebudget>>;
  idCompany: Scalars['Int']['input'];
  idGroup: Scalars['Int']['input'];
  projectAddress: Scalars['projectAddress_String_NotNull_maxLength_255']['input'];
  projectBudget: Scalars['Float']['input'];
  projectName: Scalars['projectName_String_NotNull_maxLength_128']['input'];
  projectSqft: Scalars['Float']['input'];
};


/** structure to handle table sms */
export type MutationCompanyproject_PinArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  pinyn: Scalars['Boolean']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanyproject_UpdatebudgetArgs = {
  budgetAllocation?: InputMaybe<Array<Allocatebudget>>;
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  projectBudget: Scalars['Float']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanyproject_UpdatedetailArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  idGroup: Scalars['Int']['input'];
  projectAddress: Scalars['projectAddress_String_NotNull_maxLength_255']['input'];
  projectName: Scalars['projectName_String_NotNull_maxLength_128']['input'];
  projectSqft: Scalars['Float']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanyrole_DeactivateArgs = {
  active: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanyrole_NewArgs = {
  idCompany: Scalars['Int']['input'];
  permissionaccess?: InputMaybe<Array<Permissionaccess>>;
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
};


/** structure to handle table sms */
export type MutationCompanyrole_UpdateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  permissionaccess?: InputMaybe<Array<Permissionaccess>>;
  revision: Scalars['Int']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
};


/** structure to handle table sms */
export type MutationPermissionrole_UpdateArgs = {
  access: Scalars['Boolean']['input'];
  idCompany: Scalars['Int']['input'];
  idRole: Scalars['Int']['input'];
  permissionId: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProfile_2faArgs = {
  mobile: Scalars['mobile_String_NotNull_pattern_093093094']['input'];
};


/** structure to handle table sms */
export type MutationProfile_ActivateArgs = {
  mobile: Scalars['String']['input'];
  revision: Scalars['Int']['input'];
  twofa: Scalars['Boolean']['input'];
  verificationCode: Scalars['String']['input'];
};


/** structure to handle table sms */
export type MutationProjectinvoice_DeactivateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectinvoice_DeletefileArgs = {
  idCompany: Scalars['Int']['input'];
  idProjectinvoice_file: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectinvoice_MappingArgs = {
  fileUrl: Scalars['fileUrl_String_NotNull_maxLength_512']['input'];
  idCompany: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectinvoice_NewArgs = {
  amount: Scalars['Float']['input'];
  costCode: Scalars['costCode_String_NotNull_maxLength_15']['input'];
  idCompany: Scalars['Int']['input'];
  idOrder1: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  indvoicedueDate: Scalars['String']['input'];
  invoiceFiles?: InputMaybe<Array<Invoicefile>>;
  invoiceNumber: Scalars['invoiceNumber_String_NotNull_maxLength_25']['input'];
  invoicedDate: Scalars['String']['input'];
};


/** structure to handle table sms */
export type MutationProjectinvoice_UpdateArgs = {
  amount: Scalars['Float']['input'];
  costCode: Scalars['costCode_String_NotNull_maxLength_15']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  idOrder1: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  indvoicedueDate: Scalars['String']['input'];
  invoiceNumber: Scalars['invoiceNumber_String_NotNull_maxLength_25']['input'];
  invoicedDate: Scalars['String']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectinvoice_UploadfilesArgs = {
  idCompany: Scalars['Int']['input'];
  idInvoice: Scalars['Int']['input'];
  invoiceFiles?: InputMaybe<Array<Invoicefile>>;
};


/** structure to handle table sms */
export type MutationProjectmember_DeactivateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectmember_EditArgs = {
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  projectmembers?: InputMaybe<Array<Projectmemberaccess>>;
};


/** structure to handle table sms */
export type MutationProjectmember_InviteArgs = {
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  inviteMembers?: InputMaybe<Array<Projectinvitemember>>;
};


/** structure to handle table sms */
export type MutationProjectorder_DeactivateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectorder_DeletefileArgs = {
  idCompany: Scalars['Int']['input'];
  idProjectorder_file: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectorder_NewArgs = {
  costCode: Scalars['costCode_String_NotNull_maxLength_15']['input'];
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idReason: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  indvoicedueDate: Scalars['String']['input'];
  invoiceNumber: Scalars['invoiceNumber_String_NotNull_maxLength_25']['input'];
  invoicedDate: Scalars['String']['input'];
  listItems?: InputMaybe<Array<Projectorder2>>;
  nontaxable: Scalars['Float']['input'];
  notes: Scalars['notes_String_NotNull_maxLength_255']['input'];
  orderNumber: Scalars['Int']['input'];
  paymentTerms: Scalars['paymentTerms_String_NotNull_maxLength_50']['input'];
  tax: Scalars['Float']['input'];
  taxable: Scalars['Float']['input'];
  taxrate: Scalars['Float']['input'];
  total: Scalars['Float']['input'];
};


/** structure to handle table sms */
export type MutationProjectorder_UpdateArgs = {
  costCode: Scalars['costCode_String_NotNull_maxLength_15']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idReason: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  indvoicedueDate: Scalars['String']['input'];
  invoiceNumber: Scalars['invoiceNumber_String_NotNull_maxLength_25']['input'];
  invoicedDate: Scalars['String']['input'];
  listItems?: InputMaybe<Array<Projectorder2>>;
  nontaxable: Scalars['Float']['input'];
  notes: Scalars['notes_String_NotNull_maxLength_255']['input'];
  paymentTerms: Scalars['paymentTerms_String_NotNull_maxLength_50']['input'];
  revision: Scalars['Int']['input'];
  tax: Scalars['Float']['input'];
  taxable: Scalars['Float']['input'];
  total: Scalars['Float']['input'];
};


/** structure to handle table sms */
export type MutationProjectorder_UploadfilesArgs = {
  idCompany: Scalars['Int']['input'];
  idOrder1: Scalars['Int']['input'];
  orderFiles?: InputMaybe<Array<Orderfile>>;
};


/** structure to handle table sms */
export type MutationProjectpayment_ApproveArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectpayment_DeactivateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectpayment_DeletefileArgs = {
  idCompany: Scalars['Int']['input'];
  idProjectpayment_file: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectpayment_NewArgs = {
  amount: Scalars['Float']['input'];
  billNumber: Scalars['billNumber_String_NotNull_maxLength_25']['input'];
  billyn?: InputMaybe<Scalars['Boolean']['input']>;
  costCode?: InputMaybe<Scalars['String']['input']>;
  dueDate: Scalars['String']['input'];
  idCompany: Scalars['Int']['input'];
  idCompany_payment: Scalars['Int']['input'];
  idInvitedCompany?: InputMaybe<Scalars['Int']['input']>;
  idOrder1: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  paymentFiles?: InputMaybe<Array<Paymentfile>>;
  paymentTerms: Scalars['paymentTerms_String_NotNull_maxLength_50']['input'];
  sentDate: Scalars['String']['input'];
  txtNotes: Scalars['txtNotes_String_NotNull_maxLength_512']['input'];
  vendorEmail?: InputMaybe<Scalars['String']['input']>;
  vendorName?: InputMaybe<Scalars['String']['input']>;
};


/** structure to handle table sms */
export type MutationProjectpayment_OpenArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectpayment_PayArgs = {
  amount: Scalars['Float']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  paidDate: Scalars['String']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectpayment_RejectArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationProjectpayment_UpdateArgs = {
  amount: Scalars['Float']['input'];
  billNumber: Scalars['billNumber_String_NotNull_maxLength_25']['input'];
  costCode?: InputMaybe<Scalars['String']['input']>;
  dueDate: Scalars['String']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  idCompany_payment: Scalars['Int']['input'];
  idOrder1: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  paymentTerms: Scalars['paymentTerms_String_NotNull_maxLength_50']['input'];
  revision: Scalars['Int']['input'];
  sentDate: Scalars['String']['input'];
  txtNotes: Scalars['txtNotes_String_NotNull_maxLength_512']['input'];
};


/** structure to handle table sms */
export type MutationProjectpayment_UploadfilesArgs = {
  idCompany: Scalars['Int']['input'];
  idPayment: Scalars['Int']['input'];
  paymentFiles?: InputMaybe<Array<Paymentfile>>;
};


/** structure to handle table sms */
export type MutationQuickbooks_DownloadvendorsArgs = {
  idCompany: Scalars['Int']['input'];
  realmid: Scalars['String']['input'];
  redirectUri: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


/** structure to handle table sms */
export type MutationQuickbooks_UploadvendorsArgs = {
  accessToken: Scalars['String']['input'];
  refreshToken: Scalars['String']['input'];
};


/** structure to handle table sms */
export type MutationSms_SendArgs = {
  mobile: Scalars['String']['input'];
};


/** structure to handle table sms */
export type MutationSms_VerifyArgs = {
  code: Scalars['String']['input'];
};


/** structure to handle table sms */
export type MutationTest1_AddArgs = {
  active: Scalars['Boolean']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128_format_email']['input'];
};


/** structure to handle table sms */
export type MutationTest1_DeleteArgs = {
  id: Scalars['ID']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationTest1_UpdateArgs = {
  active: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
  revision: Scalars['Int']['input'];
  txtName: Scalars['String']['input'];
};


/** structure to handle table sms */
export type MutationVendor_ArchiveArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationVendor_Contact_DeactivateArgs = {
  idCompany: Scalars['Int']['input'];
  idVendor_contact: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationVendor_File_DeleteArgs = {
  idCompany: Scalars['Int']['input'];
  idVendor_file: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationVendor_InviteArgs = {
  idCompany: Scalars['Int']['input'];
  inviteVendors?: InputMaybe<Array<Invitedvendors>>;
};


/** structure to handle table sms */
export type MutationVendor_NewArgs = {
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  idCompany: Scalars['Int']['input'];
  idInvitedCompany?: InputMaybe<Scalars['Int']['input']>;
  phone: Scalars['phone_String_NotNull_maxLength_20']['input'];
  primaryContact: Scalars['primaryContact_String_NotNull_maxLength_50']['input'];
  suiteNumber: Scalars['suiteNumber_String_NotNull_maxLength_30']['input'];
  txtAddress: Scalars['txtAddress_String_NotNull_maxLength_80']['input'];
  txtCity: Scalars['txtCity_String_NotNull_maxLength_80']['input'];
  txtState: Scalars['txtState_String_NotNull_maxLength_80']['input'];
  txtZipcode: Scalars['txtZipcode_String_NotNull_maxLength_10']['input'];
  vendorName: Scalars['vendorName_String_NotNull_maxLength_128']['input'];
  vendorType: Scalars['vendorType_String_NotNull_maxLength_50']['input'];
  vendorcostcodes?: InputMaybe<Array<Vendorcostcode>>;
  vendorfiles?: InputMaybe<Array<Vendorfile>>;
  website: Scalars['website_String_NotNull_maxLength_180']['input'];
};


/** structure to handle table sms */
export type MutationVendor_UpdateArgs = {
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  phone: Scalars['phone_String_NotNull_maxLength_20']['input'];
  primaryContact: Scalars['primaryContact_String_NotNull_maxLength_50']['input'];
  revision: Scalars['Int']['input'];
  suiteNumber: Scalars['suiteNumber_String_NotNull_maxLength_30']['input'];
  txtAddress: Scalars['txtAddress_String_NotNull_maxLength_80']['input'];
  txtCity: Scalars['txtCity_String_NotNull_maxLength_80']['input'];
  txtState: Scalars['txtState_String_NotNull_maxLength_80']['input'];
  txtZipcode: Scalars['txtZipcode_String_NotNull_maxLength_10']['input'];
  vendorName: Scalars['vendorName_String_NotNull_maxLength_128']['input'];
  vendorType: Scalars['vendorType_String_NotNull_maxLength_50']['input'];
  vendorcostcodes?: InputMaybe<Array<Vendorcostcode>>;
  vendorfiles?: InputMaybe<Array<Vendorfile>>;
  website: Scalars['website_String_NotNull_maxLength_180']['input'];
};


/** structure to handle table sms */
export type MutationVendoradditional_UpdateArgs = {
  discount: Scalars['Float']['input'];
  federalId: Scalars['federalId_String_NotNull_maxLength_25']['input'];
  form1099: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  paymentTerms: Scalars['paymentTerms_String_NotNull_maxLength_50']['input'];
  payto: Scalars['payto_String_NotNull_maxLength_255']['input'];
  revision: Scalars['Int']['input'];
  taxrate: Scalars['Float']['input'];
};


/** structure to handle table sms */
export type MutationVendorcontact_NewArgs = {
  contactName: Scalars['contactName_String_NotNull_maxLength_128']['input'];
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  idCompany: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  notes: Scalars['notes_String_NotNull_maxLength_250']['input'];
  phone: Scalars['phone_String_NotNull_maxLength_20']['input'];
};


/** structure to handle table sms */
export type MutationVendorcontact_UpdateArgs = {
  contactName: Scalars['contactName_String_NotNull_maxLength_128']['input'];
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  notes: Scalars['notes_String_NotNull_maxLength_250']['input'];
  phone: Scalars['phone_String_NotNull_maxLength_20']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationVendorinsurance_DeleteArgs = {
  idCompany: Scalars['Int']['input'];
  idVendor_insurance: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationVendorinsurance_UploadArgs = {
  idCompany: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  insuranceFiles?: InputMaybe<Array<Vendorfile>>;
};


/** structure to handle table sms */
export type MutationVendorpayment_DeactivateArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationVendorpayment_NewArgs = {
  account: Scalars['account_String_NotNull_maxLength_25']['input'];
  bankName: Scalars['bankName_String_NotNull_maxLength_128']['input'];
  defaultPay: Scalars['Boolean']['input'];
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  holderName: Scalars['holderName_String_NotNull_maxLength_128']['input'];
  idCompany: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  payType: Scalars['payType_String_NotNull_maxLength_25']['input'];
  routing: Scalars['routing_String_NotNull_maxLength_15']['input'];
};


/** structure to handle table sms */
export type MutationVendorpayment_SetdefaultArgs = {
  defaultPay: Scalars['Boolean']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationVendorpayment_UpdateArgs = {
  account: Scalars['account_String_NotNull_maxLength_25']['input'];
  bankName: Scalars['bankName_String_NotNull_maxLength_128']['input'];
  defaultPay: Scalars['Boolean']['input'];
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  holderName: Scalars['holderName_String_NotNull_maxLength_128']['input'];
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
  routing: Scalars['routing_String_NotNull_maxLength_15']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** get bankname from routing */
  bankname_routing: Banknameresult;
  /** get category-costcode list */
  categorycostcode_list: Companycategorylist;
  /** get company info for one company */
  company_info: Cominforesult;
  /** get company list */
  company_list: Companylist;
  /** get company members for company */
  company_members: Companymemberresult;
  /** get company roles */
  company_roles: Rolesresult;
  /** get company_category list */
  companycategory_list: Companycategorylist;
  /** get company_costcode list */
  companycostcode_list: Companycostcodelist;
  /** get companygroup list */
  companygroup_list: Companygrouplist;
  /** get company members email */
  companymember_emails: Companyemailsresult;
  /** get companypayment info */
  companypayment_info: Paymentinforesult;
  /** get companypayment list */
  companypayment_list: Paymentlist;
  /** get companyproject info */
  companyproject_info: Projectinforesult;
  /** get companyproject list */
  companyproject_list: Projectlist;
  /** get company role list */
  companyrole_list: Rolelistresult;
  /** get url for a new file */
  get_file_url: FileResponse;
  /** get associated company list */
  getassociatedcompany_list: Associatedcompanylist;
  /** retrieve profile for the loging user */
  profile_info: Resprofile;
  /** get project members for project */
  project_members: Projectmemberresult;
  /** get projectpayment list */
  projectbill_list: Projectpaymentlist;
  /** get project budget list */
  projectbudget_list: Projectbudgetlist;
  /** get projectinvoice attachment */
  projectinvoice_attachment: Invoicefilelist;
  /** get projectinvoice info */
  projectinvoice_info: Projectinvoiceinforesult;
  /** get projectinvoice list */
  projectinvoice_list: Projectinvoicelist;
  /** get projectorder activity */
  projectorder_activity: Orderactivitylist;
  /** get projectorder attachment */
  projectorder_attachment: Orderfilelist;
  /** get projectorder info */
  projectorder_info: Projectorderinforesult;
  /** get projectorder list */
  projectorder_list: Projectorderlist;
  /** get projectorder Number */
  projectorder_newnumber: Projectordernumber;
  /** get projectorder reason list */
  projectorder_reasonlist: Companyreasonlist;
  /** get related Orders */
  projectorder_related: Projectorderlist;
  /** get projectpayment attachment */
  projectpayment_attachment: Paymentfilelist;
  /** get projectpayment info */
  projectpayment_info: Projectpaymentinforesult;
  /** get projectpayment list */
  projectpayment_list: Projectpaymentlist;
  /** query to retrieve an existing row */
  test1_find: Test1;
  /** query to retrieve all existing rows */
  test1_findall: Array<Maybe<Test1>>;
  /** get vendor info for one vendor */
  vendor_info: Vendorinforesult;
  /** get vendor list */
  vendor_list: Vendorlist;
  /** get vendor contact info */
  vendorcontact_info: Vendorcontactinforesult;
  /** get vendor_contact list */
  vendorcontact_list: Vendorcontactlist;
  /** get insurance attachment */
  vendorinsurance_attachment: Vendorinsurancelist;
  /** get vendorpayment info */
  vendorpayment_info: Vendorpaymentinforesult;
  /** get vendorpayment list */
  vendorpayment_list: Vendorpaymentlist;
};


export type QueryBankname_RoutingArgs = {
  idCompany: Scalars['Int']['input'];
  routing: Scalars['String']['input'];
};


export type QueryCategorycostcode_ListArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryCompany_InfoArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCompany_MembersArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryCompany_RolesArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryCompanycategory_ListArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryCompanycostcode_ListArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryCompanygroup_ListArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryCompanymember_EmailsArgs = {
  emaillist?: InputMaybe<Array<Scalars['String']['input']>>;
  idCompany: Scalars['Int']['input'];
};


export type QueryCompanypayment_InfoArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCompanypayment_ListArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryCompanyproject_InfoArgs = {
  id: Scalars['Int']['input'];
};


export type QueryCompanyproject_ListArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryCompanyrole_ListArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryGet_File_UrlArgs = {
  fileName: Scalars['String']['input'];
  folder?: InputMaybe<Folder>;
};


export type QueryGetassociatedcompany_ListArgs = {
  idCompany: Scalars['Int']['input'];
  vendorEmail: Scalars['String']['input'];
};


export type QueryProject_MembersArgs = {
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
};


export type QueryProjectbill_ListArgs = {
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
};


export type QueryProjectbudget_ListArgs = {
  idProject: Scalars['Int']['input'];
};


export type QueryProjectinvoice_AttachmentArgs = {
  idCompany: Scalars['Int']['input'];
  idInvoice: Scalars['Int']['input'];
};


export type QueryProjectinvoice_InfoArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
};


export type QueryProjectinvoice_ListArgs = {
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
};


export type QueryProjectorder_ActivityArgs = {
  idCompany: Scalars['Int']['input'];
  idOrder1: Scalars['Int']['input'];
};


export type QueryProjectorder_AttachmentArgs = {
  idCompany: Scalars['Int']['input'];
  idOrder1: Scalars['Int']['input'];
};


export type QueryProjectorder_InfoArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
};


export type QueryProjectorder_ListArgs = {
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
};


export type QueryProjectorder_NewnumberArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryProjectorder_ReasonlistArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryProjectorder_RelatedArgs = {
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
  paidyn: Scalars['Boolean']['input'];
};


export type QueryProjectpayment_AttachmentArgs = {
  idCompany: Scalars['Int']['input'];
  idPayment: Scalars['Int']['input'];
};


export type QueryProjectpayment_InfoArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
};


export type QueryProjectpayment_ListArgs = {
  idCompany: Scalars['Int']['input'];
  idProject: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
};


export type QueryTest1_FindArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVendor_InfoArgs = {
  id: Scalars['Int']['input'];
};


export type QueryVendor_ListArgs = {
  idCompany: Scalars['Int']['input'];
};


export type QueryVendorcontact_InfoArgs = {
  idVendor_contact: Scalars['Int']['input'];
};


export type QueryVendorcontact_ListArgs = {
  idVendor: Scalars['Int']['input'];
};


export type QueryVendorinsurance_AttachmentArgs = {
  idCompany: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
};


export type QueryVendorpayment_InfoArgs = {
  id: Scalars['Int']['input'];
  idCompany: Scalars['Int']['input'];
};


export type QueryVendorpayment_ListArgs = {
  idCompany: Scalars['Int']['input'];
  idVendor: Scalars['Int']['input'];
};

/** structure to handle table project_payment */
export type _Order_Costcode = {
  __typename?: '_order_costcode';
  costCode: Scalars['String']['output'];
  txtName: Scalars['String']['output'];
};

/** structure to handle table company_project */
export type _Project_Member = {
  __typename?: '_project_member';
  avatar: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  idUser: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
};

/** structure to handle table vendor_account */
export type _Vendor_Costcode = {
  __typename?: '_vendor_costcode';
  costCode: Scalars['String']['output'];
  txtName: Scalars['String']['output'];
};

export type Allocatebudget = {
  budgetAmount: Scalars['Float']['input'];
  budgetPercentage: Scalars['Float']['input'];
  idCategory: Scalars['Int']['input'];
};

export type Associatedcompany = {
  __typename?: 'associatedcompany';
  companyName: Scalars['String']['output'];
  idInvitedCompany: Scalars['Int']['output'];
};

export type Associatedcompanylist = {
  __typename?: 'associatedcompanylist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Associatedcompany>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Banknameresult = {
  __typename?: 'banknameresult';
  code: Scalars['Int']['output'];
  data: Scalars['String']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Cialist = {
  __typename?: 'cialist';
  id: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

export type Combooleanresult = {
  __typename?: 'combooleanresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Cominforesult = {
  __typename?: 'cominforesult';
  code: Scalars['Int']['output'];
  data: Companyinfo;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Company = {
  __typename?: 'company';
  active: Scalars['Boolean']['output'];
  avatar: Scalars['String']['output'];
  companyAccess?: Maybe<Array<Companypermission>>;
  contactNumber: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  description: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idMasterCompany: Scalars['Int']['output'];
  idUserOwner: Scalars['Int']['output'];
  industry: Scalars['String']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  paymentTerms: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  suiteNumber: Scalars['String']['output'];
  taxId: Scalars['String']['output'];
  txtAddress: Scalars['String']['output'];
  txtCity: Scalars['String']['output'];
  txtName: Scalars['String']['output'];
  txtState: Scalars['String']['output'];
  txtZipcode: Scalars['String']['output'];
  website: Scalars['String']['output'];
};

export type Company_Category = {
  __typename?: 'company_category';
  active: Scalars['Boolean']['output'];
  costcodecount: Scalars['Int']['output'];
  costcodelist?: Maybe<Array<Maybe<Company_Costcode>>>;
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

/** structure to handle table company_costcode */
export type Company_Costcode = {
  __typename?: 'company_costcode';
  active: Scalars['Boolean']['output'];
  category: Scalars['String']['output'];
  costCode: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCategory: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
  txtNotes: Scalars['String']['output'];
};

/** structure to handle table company_member */
export type Company_Member = {
  __typename?: 'company_member';
  active: Scalars['Boolean']['output'];
  approvalAmount: Scalars['Float']['output'];
  avatar: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idRole: Scalars['Int']['output'];
  idUser: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  memberType: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

export type Companycategory = {
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
};

export type Companycategorylist = {
  __typename?: 'companycategorylist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Company_Category>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Companycostcodelist = {
  __typename?: 'companycostcodelist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Company_Costcode>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Companyemails = {
  __typename?: 'companyemails';
  email: Scalars['String']['output'];
  memberyn: Scalars['Boolean']['output'];
};

export type Companyemailsresult = {
  __typename?: 'companyemailsresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Companyemails>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Companygroup = {
  __typename?: 'companygroup';
  active: Scalars['Boolean']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  projectcount: Scalars['Int']['output'];
  projectlist?: Maybe<Array<Maybe<Companyproject>>>;
  revision: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

export type Companygrouplist = {
  __typename?: 'companygrouplist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Companygroup>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Companyinfo = {
  __typename?: 'companyinfo';
  comboxIndustry?: Maybe<Array<Industrylist>>;
  comboxPaymentTerms?: Maybe<Array<Paymenttermslist>>;
  company?: Maybe<Company>;
  companyName: Scalars['String']['output'];
};

export type Companylist = {
  __typename?: 'companylist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Company>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Companymemberaccess = {
  approvalAmount: Scalars['Float']['input'];
  idRole: Scalars['Int']['input'];
  idcompany_member: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};

export type Companymemberresult = {
  __typename?: 'companymemberresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Company_Member>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

/** structure to handle table company_payment */
export type Companypayment = {
  __typename?: 'companypayment';
  account: Scalars['String']['output'];
  active: Scalars['Boolean']['output'];
  bankName: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  defaultPay: Scalars['Boolean']['output'];
  email: Scalars['String']['output'];
  holderName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  linkedProjects?: Maybe<Scalars['Int']['output']>;
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  nextAch: Scalars['Int']['output'];
  nextCheck: Scalars['Int']['output'];
  payType: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  routing: Scalars['String']['output'];
};

export type Companypermission = {
  __typename?: 'companypermission';
  access: Scalars['Boolean']['output'];
  permissionId: Scalars['Int']['output'];
  permissionName: Scalars['String']['output'];
};

export type Companyproject = {
  __typename?: 'companyproject';
  active: Scalars['Boolean']['output'];
  canDelete: Scalars['Boolean']['output'];
  color: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  groupName: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idCompany_payment: Scalars['Int']['output'];
  idGroup: Scalars['Int']['output'];
  members?: Maybe<Array<_Project_Member>>;
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  pinyn: Scalars['Boolean']['output'];
  projectAddress: Scalars['String']['output'];
  projectBudget: Scalars['Float']['output'];
  projectName: Scalars['String']['output'];
  projectSqft: Scalars['Float']['output'];
  projectUsed: Scalars['Float']['output'];
  revision: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

export type Companyreason = {
  __typename?: 'companyreason';
  active: Scalars['Boolean']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

export type Companyreasonlist = {
  __typename?: 'companyreasonlist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Companyreason>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

/** structure to handle table company_role */
export type Companyrole = {
  __typename?: 'companyrole';
  access: Scalars['Int']['output'];
  active: Scalars['Boolean']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idRole: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
  usedCount: Scalars['Int']['output'];
};

/** structure to handle responses when updating information */
export type Comresult = {
  __typename?: 'comresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Residrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Costcodedeactivateeresult = {
  __typename?: 'costcodedeactivateeresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Costcodeidrevision = {
  __typename?: 'costcodeidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Costcoderesult = {
  __typename?: 'costcoderesult';
  code: Scalars['Int']['output'];
  data?: Maybe<Costcodeidrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type FileResponse = {
  __typename?: 'fileResponse';
  code: Scalars['Int']['output'];
  data: Scalars['String']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Importcostcode = {
  category: Scalars['category_String_NotNull_maxLength_50']['input'];
  costCode: Scalars['costCode_String_NotNull_maxLength_15']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
  txtNotes: Scalars['txtNotes_String_NotNull_maxLength_512']['input'];
};

/** structure to handle table company */
export type Industrylist = {
  __typename?: 'industrylist';
  id: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

export type Invitedvendors = {
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
};

export type Invitemember = {
  approvalAmount: Scalars['Float']['input'];
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  idRole: Scalars['Int']['input'];
};

export type Invitememberresult = {
  __typename?: 'invitememberresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Invoicefile = {
  fileName: Scalars['fileName_String_NotNull_maxLength_128']['input'];
  fileSize: Scalars['Int']['input'];
  fileType: Scalars['fileType_String_NotNull_maxLength_15']['input'];
  fileUrl: Scalars['fileUrl_String_NotNull_maxLength_512']['input'];
};

export type Invoicefilelist = {
  __typename?: 'invoicefilelist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Projectinvoice_File>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Invoicemapping = {
  __typename?: 'invoicemapping';
  amount: Scalars['Float']['output'];
  costCode: Scalars['String']['output'];
  costCodeName: Scalars['String']['output'];
  idOrder1: Scalars['Int']['output'];
  idProject: Scalars['Int']['output'];
  idVendor: Scalars['Int']['output'];
  indvoicedueDate: Scalars['String']['output'];
  invoiceNumber: Scalars['String']['output'];
  invoicedDate: Scalars['String']['output'];
  orderNumber: Scalars['Int']['output'];
  projectName: Scalars['String']['output'];
  status: Scalars['String']['output'];
  txtAddress: Scalars['String']['output'];
  txtCity: Scalars['String']['output'];
  txtState: Scalars['String']['output'];
  vendorName: Scalars['String']['output'];
};

export type Invoicemappingresult = {
  __typename?: 'invoicemappingresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Invoicemapping>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Orderactivitylist = {
  __typename?: 'orderactivitylist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Projectorder_Activity>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Orderfile = {
  fileName: Scalars['fileName_String_NotNull_maxLength_128']['input'];
  fileSize: Scalars['Int']['input'];
  fileType: Scalars['fileType_String_NotNull_maxLength_15']['input'];
  fileUrl: Scalars['fileUrl_String_NotNull_maxLength_512']['input'];
};

export type Orderfilelist = {
  __typename?: 'orderfilelist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Projectorder_File>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Paymentbooleanresult = {
  __typename?: 'paymentbooleanresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Paymentfile = {
  fileName: Scalars['fileName_String_NotNull_maxLength_128']['input'];
  fileSize: Scalars['Int']['input'];
  fileType: Scalars['fileType_String_NotNull_maxLength_15']['input'];
  fileUrl: Scalars['fileUrl_String_NotNull_maxLength_512']['input'];
};

export type Paymentfilelist = {
  __typename?: 'paymentfilelist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Projectpayment_File>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Paymentidrevision = {
  __typename?: 'paymentidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Paymentinforesult = {
  __typename?: 'paymentinforesult';
  code: Scalars['Int']['output'];
  data: Companypayment;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Paymentlist = {
  __typename?: 'paymentlist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Companypayment>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Paymentresult = {
  __typename?: 'paymentresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Paymentidrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Paymenttermslist = {
  __typename?: 'paymenttermslist';
  id: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

export type Permission = {
  __typename?: 'permission';
  permissionId: Scalars['Int']['output'];
  permissionName: Scalars['String']['output'];
  roleaccess?: Maybe<Array<Permissionrole>>;
};

export type Permissionaccess = {
  access: Scalars['Boolean']['input'];
  permissionId: Scalars['Int']['input'];
};

export type Permissionrole = {
  __typename?: 'permissionrole';
  access: Scalars['Boolean']['output'];
  idRole: Scalars['Int']['output'];
};

/** structure to handle table user account */
export type Profile = {
  __typename?: 'profile';
  active: Scalars['Boolean']['output'];
  avatar: Scalars['String']['output'];
  companyName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  memberyn: Scalars['Boolean']['output'];
  mobile: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  socialMedia: Scalars['Int']['output'];
  socialMediaToken: Scalars['String']['output'];
  twofa: Scalars['Boolean']['output'];
  welcomeyn: Scalars['Boolean']['output'];
};

/** structure to handle table project_invoice */
export type Project_Invoice = {
  __typename?: 'project_invoice';
  active: Scalars['Boolean']['output'];
  amount: Scalars['Float']['output'];
  costCode: Scalars['String']['output'];
  costCodeName: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idOrder1: Scalars['Int']['output'];
  idProject: Scalars['Int']['output'];
  idVendor: Scalars['Int']['output'];
  indvoicedueDate: Scalars['String']['output'];
  invoiceNumber: Scalars['String']['output'];
  invoicedDate: Scalars['String']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  orderNumber: Scalars['Int']['output'];
  projectName: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  txtAddress: Scalars['String']['output'];
  txtCity: Scalars['String']['output'];
  txtState: Scalars['String']['output'];
  vendorName: Scalars['String']['output'];
  vendorType: Scalars['String']['output'];
};

/** structure to handle table project_member */
export type Project_Member = {
  __typename?: 'project_member';
  active: Scalars['Boolean']['output'];
  approvalAmount: Scalars['Float']['output'];
  avatar: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idProject: Scalars['Int']['output'];
  idRole: Scalars['Int']['output'];
  idUser: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

/** structure to handle table project_order1 */
export type Project_Order1 = {
  __typename?: 'project_order1';
  active: Scalars['Boolean']['output'];
  costCode: Scalars['String']['output'];
  costCodeName: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idProject: Scalars['Int']['output'];
  idReason: Scalars['Int']['output'];
  idVendor: Scalars['Int']['output'];
  indvoicedueDate: Scalars['String']['output'];
  invoiceNumber: Scalars['String']['output'];
  invoicedDate: Scalars['String']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  nontaxable: Scalars['Float']['output'];
  notes: Scalars['String']['output'];
  orderNumber: Scalars['Int']['output'];
  paidAmount: Scalars['Float']['output'];
  paymentTerms: Scalars['String']['output'];
  projectName: Scalars['String']['output'];
  remainingAmount: Scalars['Float']['output'];
  revision: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  tax: Scalars['Float']['output'];
  taxable: Scalars['Float']['output'];
  taxrate: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  txtAddress: Scalars['String']['output'];
  txtCity: Scalars['String']['output'];
  txtState: Scalars['String']['output'];
  vendorName: Scalars['String']['output'];
  vendorType: Scalars['String']['output'];
};

export type Project_Order2 = {
  __typename?: 'project_order2';
  active: Scalars['Boolean']['output'];
  amount: Scalars['Float']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idOrder1: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  paidyn: Scalars['Boolean']['output'];
  price: Scalars['Float']['output'];
  qty: Scalars['Float']['output'];
  revision: Scalars['Int']['output'];
  taxyn: Scalars['Boolean']['output'];
  unit: Scalars['String']['output'];
  upc: Scalars['String']['output'];
};

export type Project_Payment = {
  __typename?: 'project_payment';
  account: Scalars['String']['output'];
  active: Scalars['Boolean']['output'];
  amount: Scalars['Float']['output'];
  avatar: Scalars['String']['output'];
  billNumber: Scalars['String']['output'];
  costCode: Scalars['String']['output'];
  costCodeName: Scalars['String']['output'];
  costcodes?: Maybe<Array<_Order_Costcode>>;
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  dueDate: Scalars['String']['output'];
  email: Scalars['String']['output'];
  holderName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idCompany_payment: Scalars['Int']['output'];
  idOrder1: Scalars['Int']['output'];
  idProject: Scalars['Int']['output'];
  idVendor: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  orderDue: Scalars['Float']['output'];
  orderNumber: Scalars['Int']['output'];
  orderStatus: Scalars['String']['output'];
  paidDate: Scalars['String']['output'];
  payType: Scalars['String']['output'];
  paymentTerms: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  primaryContact: Scalars['String']['output'];
  projectName: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  senderAvatar: Scalars['String']['output'];
  senderEmail: Scalars['String']['output'];
  senderFirstname: Scalars['String']['output'];
  senderLastname: Scalars['String']['output'];
  sentDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  txtAddress: Scalars['String']['output'];
  txtCity: Scalars['String']['output'];
  txtNotes: Scalars['String']['output'];
  txtState: Scalars['String']['output'];
  vendorName: Scalars['String']['output'];
  vendorType: Scalars['String']['output'];
};

export type Projectbooleanresult = {
  __typename?: 'projectbooleanresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectbudgetlist = {
  __typename?: 'projectbudgetlist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Projectbudgets>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectbudgets = {
  __typename?: 'projectbudgets';
  active: Scalars['Boolean']['output'];
  budgetAmount: Scalars['Float']['output'];
  budgetPercentage: Scalars['Float']['output'];
  budgetUsed: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCategory: Scalars['Int']['output'];
  idProject: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
};

export type Projectemails = {
  __typename?: 'projectemails';
  email: Scalars['String']['output'];
  memberyn: Scalars['Boolean']['output'];
};

export type Projectemailsresult = {
  __typename?: 'projectemailsresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Projectemails>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectidrevision = {
  __typename?: 'projectidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Projectinforesult = {
  __typename?: 'projectinforesult';
  code: Scalars['Int']['output'];
  data?: Maybe<Companyproject>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectinvitemember = {
  approvalAmount: Scalars['Float']['input'];
  email: Scalars['email_String_NotNull_maxLength_180_format_email']['input'];
  idRole: Scalars['Int']['input'];
  idUser: Scalars['Int']['input'];
};

export type Projectinvitememberresult = {
  __typename?: 'projectinvitememberresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectinvoice_File = {
  __typename?: 'projectinvoice_file';
  active: Scalars['Boolean']['output'];
  avatar: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Int']['output'];
  fileType: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idInvoice: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
};

export type Projectinvoicebooleanresult = {
  __typename?: 'projectinvoicebooleanresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectinvoiceidrevision = {
  __typename?: 'projectinvoiceidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Projectinvoiceinforesult = {
  __typename?: 'projectinvoiceinforesult';
  code: Scalars['Int']['output'];
  data?: Maybe<Project_Invoice>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectinvoicelist = {
  __typename?: 'projectinvoicelist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Project_Invoice>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectinvoiceresult = {
  __typename?: 'projectinvoiceresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Projectinvoiceidrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectlist = {
  __typename?: 'projectlist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Companyproject>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectmemberaccess = {
  approvalAmount: Scalars['Float']['input'];
  idRole: Scalars['Int']['input'];
  idproject_member: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
};

export type Projectmemberresult = {
  __typename?: 'projectmemberresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Project_Member>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectorder2 = {
  amount: Scalars['Float']['input'];
  description: Scalars['String']['input'];
  notes: Scalars['String']['input'];
  paidyn: Scalars['Boolean']['input'];
  price: Scalars['Float']['input'];
  qty: Scalars['Float']['input'];
  taxyn: Scalars['Boolean']['input'];
  unit: Scalars['String']['input'];
};

export type Projectorder_Activity = {
  __typename?: 'projectorder_activity';
  active: Scalars['Boolean']['output'];
  additions: Scalars['String']['output'];
  avatar: Scalars['String']['output'];
  changes: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idOrder1: Scalars['Int']['output'];
  idUser: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
};

export type Projectorder_File = {
  __typename?: 'projectorder_file';
  active: Scalars['Boolean']['output'];
  avatar: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Int']['output'];
  fileType: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idOrder1: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
};

export type Projectorderbooleanresult = {
  __typename?: 'projectorderbooleanresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectorderidrevision = {
  __typename?: 'projectorderidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Projectorderinfo = {
  __typename?: 'projectorderinfo';
  listItems?: Maybe<Array<Project_Order2>>;
  projectOrder?: Maybe<Project_Order1>;
};

export type Projectorderinforesult = {
  __typename?: 'projectorderinforesult';
  code: Scalars['Int']['output'];
  data: Projectorderinfo;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectorderlist = {
  __typename?: 'projectorderlist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Project_Order1>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectordernumber = {
  __typename?: 'projectordernumber';
  code: Scalars['Int']['output'];
  data: Scalars['Int']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectorderresult = {
  __typename?: 'projectorderresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Projectorderidrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectpayment_File = {
  __typename?: 'projectpayment_file';
  active: Scalars['Boolean']['output'];
  avatar: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Int']['output'];
  fileType: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idPayment: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
};

export type Projectpaymentbooleanresult = {
  __typename?: 'projectpaymentbooleanresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectpaymentidrevision = {
  __typename?: 'projectpaymentidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Projectpaymentinforesult = {
  __typename?: 'projectpaymentinforesult';
  code: Scalars['Int']['output'];
  data?: Maybe<Project_Payment>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectpaymentlist = {
  __typename?: 'projectpaymentlist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Project_Payment>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectpaymentresult = {
  __typename?: 'projectpaymentresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Projectpaymentidrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Projectresult = {
  __typename?: 'projectresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Projectidrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Residrevision = {
  __typename?: 'residrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

/** structure to handle responses when updating information */
export type Response = {
  __typename?: 'response';
  code: Scalars['Int']['output'];
  data?: Maybe<Token>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type ResponseQuickbooks = {
  __typename?: 'responseQuickbooks';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Resprofile = {
  __typename?: 'resprofile';
  code: Scalars['Int']['output'];
  data?: Maybe<Profile>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Roleidrevision = {
  __typename?: 'roleidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Rolelistresult = {
  __typename?: 'rolelistresult';
  code: Scalars['Int']['output'];
  data: Rolepermission;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Rolepermission = {
  __typename?: 'rolepermission';
  permissions?: Maybe<Array<Permission>>;
  roles?: Maybe<Array<Companyrole>>;
};

export type Roleresult = {
  __typename?: 'roleresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Roleidrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Rolesresult = {
  __typename?: 'rolesresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Companyrole>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

/** structure to handle table test1 */
export type Test1 = {
  __typename?: 'test1';
  active: Scalars['Boolean']['output'];
  createdDate: Scalars['String']['output'];
  id?: Maybe<Scalars['ID']['output']>;
  revision: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

export type Token = {
  __typename?: 'token';
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type Vendor_Account = {
  __typename?: 'vendor_account';
  active: Scalars['Boolean']['output'];
  avatar: Scalars['String']['output'];
  costcodes?: Maybe<Array<_Vendor_Costcode>>;
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  discount: Scalars['Float']['output'];
  email: Scalars['String']['output'];
  federalId: Scalars['String']['output'];
  form1099: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idInvitedCompany: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  paymentTerms: Scalars['String']['output'];
  payto: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  primaryContact: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  suiteNumber: Scalars['String']['output'];
  taxrate: Scalars['Float']['output'];
  txtAddress: Scalars['String']['output'];
  txtCity: Scalars['String']['output'];
  txtState: Scalars['String']['output'];
  txtZipcode: Scalars['String']['output'];
  vendorName: Scalars['String']['output'];
  vendorType: Scalars['String']['output'];
  website: Scalars['String']['output'];
};

/** structure to handle table vendor_contact */
export type Vendor_Contact = {
  __typename?: 'vendor_contact';
  active: Scalars['Boolean']['output'];
  contactName: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idVendor: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  notes: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
};

export type Vendor_Costcode = {
  __typename?: 'vendor_costcode';
  active: Scalars['Boolean']['output'];
  costCode: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idVendor: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

export type Vendor_File = {
  __typename?: 'vendor_file';
  active: Scalars['Boolean']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileSize: Scalars['Int']['output'];
  fileType: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idVendor: Scalars['Int']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
};

export type Vendorcontactidrevision = {
  __typename?: 'vendorcontactidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Vendorcontactinforesult = {
  __typename?: 'vendorcontactinforesult';
  code: Scalars['Int']['output'];
  data: Vendor_Contact;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorcontactlist = {
  __typename?: 'vendorcontactlist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Vendor_Contact>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorcontactresult = {
  __typename?: 'vendorcontactresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Vendorcontactidrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorcostcode = {
  costCode: Scalars['costCode_String_NotNull_maxLength_15']['input'];
  idCompany: Scalars['Int']['input'];
};

export type Vendordeactivateeresult = {
  __typename?: 'vendordeactivateeresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendordeleteresult = {
  __typename?: 'vendordeleteresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorfile = {
  fileName: Scalars['fileName_String_NotNull_maxLength_128']['input'];
  fileSize: Scalars['Int']['input'];
  fileType: Scalars['fileType_String_NotNull_maxLength_15']['input'];
  fileUrl: Scalars['fileUrl_String_NotNull_maxLength_512']['input'];
};

export type Vendoridrevision = {
  __typename?: 'vendoridrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Vendorinfo = {
  __typename?: 'vendorinfo';
  vendor?: Maybe<Vendor_Account>;
  vendorcostcodes?: Maybe<Array<Vendor_Costcode>>;
  vendorfiles?: Maybe<Array<Vendor_File>>;
};

export type Vendorinforesult = {
  __typename?: 'vendorinforesult';
  code: Scalars['Int']['output'];
  data: Vendorinfo;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorinsurancelist = {
  __typename?: 'vendorinsurancelist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Vendor_File>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorlist = {
  __typename?: 'vendorlist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Vendor_Account>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

/** structure to handle table company_payment */
export type Vendorpayment = {
  __typename?: 'vendorpayment';
  account: Scalars['String']['output'];
  active: Scalars['Boolean']['output'];
  bankName: Scalars['String']['output'];
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  defaultPay: Scalars['Boolean']['output'];
  email: Scalars['String']['output'];
  holderName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idVendor: Scalars['Int']['output'];
  linkedProjects?: Maybe<Scalars['Int']['output']>;
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  nextAch: Scalars['Int']['output'];
  nextCheck: Scalars['Int']['output'];
  payType: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  routing: Scalars['String']['output'];
};

export type Vendorpaymentbooleanresult = {
  __typename?: 'vendorpaymentbooleanresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorpaymentidrevision = {
  __typename?: 'vendorpaymentidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

export type Vendorpaymentinforesult = {
  __typename?: 'vendorpaymentinforesult';
  code: Scalars['Int']['output'];
  data: Vendorpayment;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorpaymentlist = {
  __typename?: 'vendorpaymentlist';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Vendorpayment>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorpaymentresult = {
  __typename?: 'vendorpaymentresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Vendorpaymentidrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Vendorupdateresult = {
  __typename?: 'vendorupdateresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Vendoridrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};
