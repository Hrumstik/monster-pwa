import { CloudflareData } from "./user";

export enum DomainOptions {
  OwnDomain = "ownDomain",
  BuyDomain = "buyDomain",
}
export interface AddDomainResponse {
  message: string;
  nsRecords: {
    name: string;
  }[];
  domain: string;
}

export interface DomainData extends CloudflareData {
  pwaId: string;
}

export enum PwaStatus {
  BUILDED = "BUILDED",
  BUILD_FAILED = "BUILD_FAILED",
  WAITING_NS = "WAITING_NS",
  ACTIVE = "ACTIVE",
}
