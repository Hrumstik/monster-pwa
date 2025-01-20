import { LiaSitemapSolid } from "react-icons/lia";
import { SiPivotaltracker } from "react-icons/si";
import { MdColorLens } from "react-icons/md";
import { MdOutlineAnalytics } from "react-icons/md";
import { FaRocketchat } from "react-icons/fa";
import { Step } from "@shared/elements/Steps/Steps";

export enum EditorPWATabs {
  Domain = "domain",
  Tracker = "tracker",
  Design = "design",
  Analytics = "analytics",
  Push = "push",
}

export const getTabIcon = (
  tab: EditorPWATabs,
  isPassed: boolean,
  isActive: boolean
) => {
  const color = isPassed ? "#00FF11" : isActive ? "white" : "#919191";

  switch (tab) {
    case EditorPWATabs.Domain:
      return <LiaSitemapSolid color={color} style={{ fontSize: "20px" }} />;
    case EditorPWATabs.Tracker:
      return <SiPivotaltracker color={color} style={{ fontSize: "20px" }} />;
    case EditorPWATabs.Design:
      return <MdColorLens color={color} style={{ fontSize: "20px" }} />;
    case EditorPWATabs.Analytics:
      return <MdOutlineAnalytics color={color} style={{ fontSize: "20px" }} />;
    case EditorPWATabs.Push:
      return <FaRocketchat color={color} style={{ fontSize: "20px" }} />;
  }
};

export const stepsInitialState: Step[] = [
  // {
  //   label: "ТРЕКЕР",
  //   id: EditorPWATabs.Tracker,
  //   isClickable: true,
  //   icon: getTabIcon(EditorPWATabs.Tracker, false, false),
  //   isPassed: false,
  // },
  {
    label: "ОФОРМЛЕНИЕ",
    id: EditorPWATabs.Design,
    isClickable: true,
    icon: getTabIcon(EditorPWATabs.Design, false, true),
    isPassed: false,
  },
  {
    label: "Аналитика",
    id: EditorPWATabs.Analytics,
    isClickable: true,
    icon: getTabIcon(EditorPWATabs.Analytics, false, false),
    isPassed: false,
  },
  {
    label: "ДОМЕН",
    id: EditorPWATabs.Domain,
    isClickable: true,
    icon: getTabIcon(EditorPWATabs.Domain, false, false),
    isPassed: false,
  },
  // {
  //   label: "PUSH УВЕДОМЛЕНИЯ",
  //   id: EditorPWATabs.Push,
  //   isClickable: true,
  //   icon: getTabIcon(EditorPWATabs.Push, false, false),
  //   isPassed: false,
  // },
];

export const editingStepsInitialState: Step[] = [
  {
    label: "ОФОРМЛЕНИЕ",
    id: EditorPWATabs.Design,
    isClickable: true,
    icon: getTabIcon(EditorPWATabs.Design, false, true),
    isPassed: false,
  },
  {
    label: "Аналитика",
    id: EditorPWATabs.Analytics,
    isClickable: true,
    icon: getTabIcon(EditorPWATabs.Analytics, false, false),
    isPassed: false,
  },
];
