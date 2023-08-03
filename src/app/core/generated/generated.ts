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
  avatar_String_NotNull_maxLength_512: { input: any; output: any; }
  category_String_NotNull_maxLength_50: { input: any; output: any; }
  contactNumber_String_NotNull_maxLength_20: { input: any; output: any; }
  costCode_String_NotNull_maxLength_15: { input: any; output: any; }
  description_String_NotNull_maxLength_512: { input: any; output: any; }
  email_String_NotNull_maxLength_128_format_email: { input: any; output: any; }
  industry_String_NotNull_maxLength_50: { input: any; output: any; }
  mobile_String_NotNull_pattern_093093094: { input: any; output: any; }
  paymentTerms_String_NotNull_maxLength_50: { input: any; output: any; }
  suiteNumber_String_NotNull_maxLength_30: { input: any; output: any; }
  taxId_String_NotNull_maxLength_50: { input: any; output: any; }
  txtAddress_String_NotNull_maxLength_80: { input: any; output: any; }
  txtCity_String_NotNull_maxLength_80: { input: any; output: any; }
  txtName_String_NotNull_maxLength_128: { input: any; output: any; }
  txtName_String_NotNull_maxLength_128_format_email: { input: any; output: any; }
  txtNotes_String_NotNull_maxLength_512: { input: any; output: any; }
  txtState_String_NotNull_maxLength_80: { input: any; output: any; }
  txtZipcode_String_NotNull_maxLength_10: { input: any; output: any; }
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
  /** deactivate company_member */
  company_member_deactivate: Invitememberresult;
  /** manage company_member access */
  company_member_edit: Invitememberresult;
  /** new company_invitedmember */
  company_member_invite: Invitememberresult;
  /** new company details */
  company_new: Comresult;
  /** update company details */
  company_update: Comresult;
  /** import company_costcode from QuickBooks */
  companycostcode_import: Costcoderesult;
  /** import company_costcode from CSV */
  companycostcode_importcsv: Costcoderesult;
  /** new company_costcode */
  companycostcode_new: Costcoderesult;
  /** update company_costcode */
  companycostcode_update: Costcoderesult;
  /** to activate the user profile */
  profile_2fa?: Maybe<Scalars['Boolean']['output']>;
  /** to activate the user profile */
  profile_activate: Response;
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
};


/** structure to handle table sms */
export type MutationCompany_Member_DeactivateArgs = {
  id: Scalars['Int']['input'];
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
export type MutationCompanycostcode_ImportArgs = {
  idCompany: Scalars['Int']['input'];
  importCostcodes?: InputMaybe<Array<Importcostcode>>;
};


/** structure to handle table sms */
export type MutationCompanycostcode_ImportcsvArgs = {
  dataCSV: Scalars['String']['input'];
  idCompany: Scalars['Int']['input'];
};


/** structure to handle table sms */
export type MutationCompanycostcode_NewArgs = {
  category: Scalars['category_String_NotNull_maxLength_50']['input'];
  costCode: Scalars['costCode_String_NotNull_maxLength_15']['input'];
  idCompany: Scalars['Int']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
  txtNotes: Scalars['txtNotes_String_NotNull_maxLength_512']['input'];
};


/** structure to handle table sms */
export type MutationCompanycostcode_UpdateArgs = {
  category: Scalars['category_String_NotNull_maxLength_50']['input'];
  id: Scalars['Int']['input'];
  revision: Scalars['Int']['input'];
  txtName: Scalars['txtName_String_NotNull_maxLength_128']['input'];
  txtNotes: Scalars['txtNotes_String_NotNull_maxLength_512']['input'];
};


/** structure to handle table sms */
export type MutationProfile_2faArgs = {
  mobile: Scalars['mobile_String_NotNull_pattern_093093094']['input'];
};


/** structure to handle table sms */
export type MutationProfile_ActivateArgs = {
  companyName: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  mobile: Scalars['String']['input'];
  revision: Scalars['Int']['input'];
  twofa: Scalars['Boolean']['input'];
  verificationCode: Scalars['String']['input'];
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

export type Query = {
  __typename?: 'Query';
  /** get company details for the loging user */
  company_details: Companydetails;
  /** get company details for one company */
  company_info: Companydetails;
  /** get company list */
  company_list: Companylist;
  /** get company members for company */
  company_members: Companymemberresult;
  /** get company members for company */
  company_roles: Companyrolesresult;
  /** get company_category list */
  companycategory_list: Companycategorylist;
  /** get company_costcode list */
  companycostcode_list: Companycostcodelist;
  /** get company members email */
  companymember_emails: Companyemailsresult;
  /** get url for a new file */
  get_file_url: FileResponse;
  /** retrieve profile for the loging user */
  profile_info: Resprofile;
  /** query to retrieve an existing row */
  test1_find: Test1;
  /** query to retrieve all existing rows */
  test1_findall: Array<Maybe<Test1>>;
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


export type QueryCompanymember_EmailsArgs = {
  emaillist?: InputMaybe<Array<Scalars['String']['input']>>;
  idCompany: Scalars['Int']['input'];
};


export type QueryGet_File_UrlArgs = {
  fileName: Scalars['String']['input'];
  folder?: InputMaybe<Folder>;
};


export type QueryTest1_FindArgs = {
  id: Scalars['ID']['input'];
};

export type Cialist = {
  __typename?: 'cialist';
  id: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

export type Company = {
  __typename?: 'company';
  active: Scalars['Boolean']['output'];
  avatar: Scalars['String']['output'];
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
  costcodelist?: Maybe<Array<Maybe<Company_Costcode>>>;
  createdBy: Scalars['Int']['output'];
  createdDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCategory: Scalars['Int']['output'];
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
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  idCompany: Scalars['Int']['output'];
  idRole: Scalars['Int']['output'];
  idUser: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  modifiedBy: Scalars['Int']['output'];
  modifiedDate: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

export type Company_Role = {
  __typename?: 'company_role';
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
  data?: Maybe<Array<Company_Category>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Companydetails = {
  __typename?: 'companydetails';
  comboxIndustry?: Maybe<Array<Industrylist>>;
  comboxPaymentTerms?: Maybe<Array<Paymenttermslist>>;
  company?: Maybe<Company>;
  companyName: Scalars['String']['output'];
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

export type Companyrolesresult = {
  __typename?: 'companyrolesresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Array<Company_Role>>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

/** structure to handle responses when updating information */
export type Comresult = {
  __typename?: 'comresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Residrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Costcodeidrevision = {
  __typename?: 'costcodeidrevision';
  id: Scalars['Int']['output'];
  revision: Scalars['Int']['output'];
};

/** structure to handle responses when updating information */
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

export type Invitemember = {
  approvalAmount: Scalars['Float']['input'];
  email: Scalars['email_String_NotNull_maxLength_128_format_email']['input'];
  idRole: Scalars['Int']['input'];
};

export type Invitememberresult = {
  __typename?: 'invitememberresult';
  code: Scalars['Int']['output'];
  data: Scalars['Boolean']['output'];
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

export type Paymenttermslist = {
  __typename?: 'paymenttermslist';
  id: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

/** structure to handle table user account */
export type Profile = {
  __typename?: 'profile';
  active: Scalars['Boolean']['output'];
  avatar: Scalars['String']['output'];
  companyName: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  lastName: Scalars['String']['output'];
  memberyn: Scalars['Boolean']['output'];
  mobile: Scalars['String']['output'];
  revision: Scalars['Int']['output'];
  socialMedia: Scalars['Int']['output'];
  socialMediaToken: Scalars['String']['output'];
  twofa: Scalars['Boolean']['output'];
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

export type Resprofile = {
  __typename?: 'resprofile';
  code: Scalars['Int']['output'];
  data?: Maybe<Profile>;
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
