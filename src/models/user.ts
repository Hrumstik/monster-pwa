import { PwaStatus } from "./domain";

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  __v: 0;
  updatedAt: string;
  cfAccounts: { email: string; gApiKey: string }[];
  pwas: {
    domainName?: string;
    pwaContentId: string;
    readyDomainId?: string;
    nsRecords: {
      name: string;
      _id: string;
    }[];
    status: PwaStatus;
  }[];
}

export interface CloudflareData {
  _id?: string;
  domain: string;
  email?: string;
  gApiKey?: string;
}
