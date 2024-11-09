export enum PWAInstallState {
  idle = "idle",
  installing = "installing",
  installed = "installed",
  downloaded = "downloaded",
  downloading = "downloading",
}

export enum PwaViews {
  Main = "Main",
  Reviews = "Reviews",
  About = "About",
}

export interface PreviewPwaContent {
  appName?: string;
  developerName?: string;
  countOfDownloads?: string;
  countOfReviews?: string;
  size: string;
  verified: boolean;
  //   tags: string[];
  securityUI: boolean;
  lastUpdate: string;
  //   pwaLink: string;
  rating: string;
  description: string;
  countOfReviewsFull: string;
  //   languages?: string[];
  //   images: {
  //     url: string;
  //   }[];
  //   reviews: {
  //     reviewAuthorName: string;
  //     reviewAuthorIcon?: string;
  //     reviewAuthorRating: number;
  //     reviewIconColor: string;
  //     reviewText: string;
  //     reviewDate: string;
  //   }[];
  version: string;
  //   sliders: number[];
}
