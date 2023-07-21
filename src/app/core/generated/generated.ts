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
  contactNumber_String_NotNull_maxLength_20: { input: any; output: any; }
  description_String_NotNull_maxLength_512: { input: any; output: any; }
  industry_String_NotNull_maxLength_50: { input: any; output: any; }
  mobile_String_NotNull_pattern_093093094: { input: any; output: any; }
  paymentTerms_String_NotNull_maxLength_50: { input: any; output: any; }
  suiteNumber_String_NotNull_maxLength_30: { input: any; output: any; }
  taxId_String_NotNull_maxLength_50: { input: any; output: any; }
  txtAddress_String_NotNull_maxLength_80: { input: any; output: any; }
  txtCity_String_NotNull_maxLength_80: { input: any; output: any; }
  txtName_String_NotNull_maxLength_128: { input: any; output: any; }
  txtName_String_NotNull_maxLength_128_format_email: { input: any; output: any; }
  txtState_String_NotNull_maxLength_80: { input: any; output: any; }
  txtZipcode_String_NotNull_maxLength_10: { input: any; output: any; }
  website_String_NotNull_maxLength_180: { input: any; output: any; }
};

/** structure to handle table sms */
export type Mutation = {
  __typename?: 'Mutation';
  /** new company details */
  company_new: Comresult;
  /** update company details */
  company_update: Comresult;
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
  /** retrieve profile for the loging user */
  profile_info: Profile;
  /** query to retrieve an existing row */
  test1_find: Test1;
  /** query to retrieve all existing rows */
  test1_findall: Array<Maybe<Test1>>;
};


export type QueryTest1_FindArgs = {
  id: Scalars['ID']['input'];
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

export type Companydetails = {
  __typename?: 'companydetails';
  comboxIndustry?: Maybe<Array<comboxIndustry>>;
  comboxPaymentTerms?: Maybe<Array<comboxPaymentTerms>>;
  company?: Maybe<Company>;
  companyName: Scalars['String']['output'];
};

/** structure to handle responses when updating information */
export type Comresult = {
  __typename?: 'comresult';
  code: Scalars['Int']['output'];
  data?: Maybe<Residrevision>;
  error: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
};

/** structure to handle table company */
export type comboxIndustry = {
  __typename?: 'comboxIndustry';
  id: Scalars['Int']['output'];
  txtName: Scalars['String']['output'];
};

export type comboxPaymentTerms = {
  __typename?: 'comboxPaymentTerms';
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
  lastName: Scalars['String']['output'];
  mobile: Scalars['String']['output'];
  password: Scalars['Int']['output'];
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
