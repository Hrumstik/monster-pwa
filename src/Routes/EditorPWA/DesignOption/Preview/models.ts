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
  hasPaidContentTitle: boolean;
  securityUI: boolean;
  lastUpdate: string;
  rating: string;
  shortDescription: string;
  fullDescription: string;
  version: string;
  wideScreens: boolean;
  hasMenu: boolean;
  age: string;
  darkTheme?: boolean;
  autoTheme?: boolean;
  videoUrl?: string;
}
