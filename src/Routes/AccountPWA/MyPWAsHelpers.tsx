import { PwaStatus } from "@models/domain";

export enum MyPWAsTabs {
  All = "all",
  Active = "active",
  Built = "built",
  BuildFailed = "buildFailed",
  WaitingNS = "waitingNS",
}

export const getTabText = (tab: MyPWAsTabs) => {
  switch (tab) {
    case MyPWAsTabs.All:
      return "Все";
    case MyPWAsTabs.Active:
      return "Активные";
    case MyPWAsTabs.Built:
      return "Собранные";
    case MyPWAsTabs.BuildFailed:
      return "Неудачные сборки";
    case MyPWAsTabs.WaitingNS:
      return "Ожидающие NS";
    default:
      return "";
  }
};

export const getPwaStatus = (status: PwaStatus) => {
  switch (status) {
    case PwaStatus.BUILDED:
      return "PWA собран";
    case PwaStatus.BUILD_FAILED:
      return "Ошибка сборки";
    case PwaStatus.WAITING_NS:
      return "Ожидание NS";
    case PwaStatus.ACTIVE:
      return "Активен";
    default:
      return "PWA собран";
  }
};

export interface PWAData {
  name: string;
  domain: string;
  geo: string;
  createdAt: Date;
  status: "Active" | "Draft" | "Stopped";
  id: string;
}

export const mokePWA_Data: PWAData[] = [
  {
    name: "Best slots",
    domain: "bestslots.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Active",
    id: "1",
  },
  {
    name: "Nine casino",
    domain: "ninecasino.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Draft",
    id: "2",
  },
  {
    name: "Casino 7771",
    domain: "casino777.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Stopped",
    id: "3",
  },
  {
    name: "Best slots 2",
    domain: "bestslots.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Active",
    id: "4",
  },
  {
    name: "Nine casino 9",
    domain: "ninecasino.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Draft",
    id: "5",
  },
  {
    name: "Casino 777",
    domain: "casino777.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Stopped",
    id: "6",
  },
];
