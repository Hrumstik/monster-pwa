export enum MyPWAsTabs {
  All = "all",
  Active = "active",
  Draft = "draft",
  Stopped = "stopped",
  CreatedAt = "createdAt",
  Status = "status",
}

export const getTabText = (tab: MyPWAsTabs) => {
  switch (tab) {
    case MyPWAsTabs.All:
      return "Все";
    case MyPWAsTabs.Active:
      return "Активные";
    case MyPWAsTabs.Draft:
      return "Черновики";
    case MyPWAsTabs.Stopped:
      return "Остановленн";
    case MyPWAsTabs.CreatedAt:
      return "Дата создания";
    case MyPWAsTabs.Status:
      return "Статус";
  }
};

export interface PWAData {
  name: string;
  domain: string;
  geo: string;
  createdAt: Date;
  status: "Active" | "Draft" | "Stopped";
}

export const mokePWA_Data: PWAData[] = [
  {
    name: "Best slots",
    domain: "bestslots.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Active",
  },
  {
    name: "Nine casino",
    domain: "ninecasino.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Draft",
  },
  {
    name: "Casino 7771",
    domain: "casino777.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Stopped",
  },
  {
    name: "Best slots 2",
    domain: "bestslots.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Active",
  },
  {
    name: "Nine casino 9",
    domain: "ninecasino.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Draft",
  },
  {
    name: "Casino 777",
    domain: "casino777.com",
    geo: "RU",
    createdAt: new Date(),
    status: "Stopped",
  },
];
