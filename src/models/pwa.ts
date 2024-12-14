export interface Picture {
  url: string | null;
  preview: string | null;
}

export interface PwaContent {
  appName: string;
  pwaName?: string;
  hasPaidContentTitle: boolean;
  developerName: string;
  countOfDownloads: Record<string, string>;
  countOfReviews: string;
  size: string;
  verified: boolean;
  tags: string[];
  securityUI: boolean;
  lastUpdate: string;
  pwaLink: string;
  rating: string;
  shortDescription: Record<string, string>;
  fullDescription: Record<string, string>;
  countOfReviewsFull: string;
  countOfStars: number;
  appIcon: string;
  age: string;
  hasMenu: boolean;
  hasLoadingScreen: boolean;
  languages?: string[];
  images: {
    id?: string;
    url: string;
    type: string;
  }[];
  reviews: {
    reviewAuthorName: string;
    reviewAuthorIcon?: string;
    reviewAuthorRating: number;
    reviewIconColor?: string;
    reviewText: Record<string, string>;
    reviewDate: string;
    devResponse?: Record<string, string>;
  }[];
  version: string;
  sliders: number[];
  createdAt?: string;
  id?: string;
  _id?: string;
  wideScreens: boolean;
}

export interface PreparedPWADataItem {
  pwaName?: string;
  appName?: string;
  domain?: string;
  geo: string;
  createdAt: Date;
  status: string;
  id: string | undefined;
}

export enum StatusData {
  Completed = "completed",
  Failed = "failed",
  Pending = "pending",
  Active = "active",
}

export enum DomainCheckStatus {
  Active = "active",
  Pending = "pending",
  Moved = "moved",
  Deactivated = "deactivated",
}
