export interface Picture {
  url: string | null;
  preview: string | null;
}

export interface PwaContent {
  appName: string;
  developerName: string;
  countOfDownloads: string;
  countOfReviews: string;
  size: string;
  verified: boolean;
  tags: string[];
  securityUI: boolean;
  lastUpdate: string;
  pwaLink: string;
  rating: string;
  description: string;
  countOfReviewsFull: string;
  countOfStars: number;
  appIcon: string;
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
    reviewText: string;
    reviewDate: string;
  }[];
  version: string;
  sliders: number[];
  createdAt?: string;
  id?: string;
  _id?: string;
}

export interface PreparedPWADataItem {
  name: string;
  domain: string;
  geo: string;
  createdAt: Date;
  status: string;
  id: string | undefined;
};
