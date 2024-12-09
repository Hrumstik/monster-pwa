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
  pwas: {
    domainName?: string;
    pwaContentId: string;
  }[];
}

export interface CloudflareData {
  domain: string;
  email: string;
  gApiKey: string;
}
