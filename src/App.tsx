import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./core/layout";
import MyPWAs from "./Routes/AccountPWA/MyPWAs";
import LoginPage from "./Routes/Login/Login";
import EditorPWA from "./Routes/EditorPWA/EditorPWA";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedRoutes from "./Routes/protected-routes";
import Analytics from "./Routes/Analytics/Analytics";
import { ConfigProvider, Empty } from "antd";
import PushDashboard from "./Routes/PushDashbord/PushDashbord";
import PushEditor from "./Routes/PushEditor/PushEditor";
import locale from "antd/es/locale/ru_RU";
import "dayjs/locale/ru";
import updateLocale from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import PushCalendar from "./Routes/PushCalendar/PushCalendar";
import ScheduledPushEditor from "./Routes/SceduledPusheEditor/SceduledPusheEditor";

dayjs.extend(updateLocale);
dayjs.updateLocale("ru", {
  weekStart: 1,
});

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoutes />,
      children: [
        {
          element: <Layout />,
          children: [
            {
              path: "/",
              element: <MyPWAs />,
            },
            {
              path: "/create-PWA",
              element: <EditorPWA />,
            },
            {
              path: "/edit-PWA/:id",
              element: <EditorPWA />,
            },
            {
              path: "/clone-PWA/:cloneId",
              element: <EditorPWA />,
            },
            {
              path: "/analytics",
              element: <Analytics />,
            },
            {
              path: "/push-dashboard",
              element: <PushDashboard />,
            },
            {
              path: "/create-push",
              element: <PushEditor />,
            },
            {
              path: "/edit-push/:id",
              element: <PushEditor />,
            },
            {
              path: "/push-calendar",
              element: <PushCalendar />,
            },
            {
              path: "/create-schedule-push/",
              element: <ScheduledPushEditor />,
            },
            {
              path: "/schedule-push/:id",
              element: <ScheduledPushEditor />,
            },
            {
              path: "/schedule-push-create/:date",
              element: <ScheduledPushEditor />,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  return (
    <ConfigProvider
      locale={locale}
      renderEmpty={() => (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<div className="text-white">Нет данных</div>}
        />
      )}
      theme={{
        components: {
          Table: {
            headerBg: "#515ACA",
            borderColor: "#20223B",
            colorBgContainer: "#20223B",
            colorText: "#FFFFFF",
            headerColor: "#FFFFFF",
            headerSplitColor: "none",
          },
          Select: {
            multipleItemBorderColorDisabled: "#383B66",
            multipleItemColorDisabled: "#FFFFFF",
          },
          Checkbox: {
            colorPrimaryHover: "#161724",
            colorPrimary: "#515ACA",
            colorBorder: "#383B66",
            controlOutline: "#515ACA",
          },
          Radio: {
            colorPrimary: "#515ACA",
            colorText: "#FFFFFF",
            buttonSolidCheckedColor: "#00FF08",
            buttonCheckedBg: "#515ACA",
            colorBgContainer: "#161724",
            colorPrimaryHover: "#161724",
            colorBorder: "#383B66",
            radioSize: 24,
            dotSize: 12,
          },
          Calendar: {
            fullBg: "#20223B",
            itemActiveBg: "#22075e",
            colorText: "#09D913",
            colorTextDisabled: "#919191",
            colorSplit: "#8c8c8c",
            colorPrimary: "#9254de",
            controlItemBgHover: "#391085",
          },
          DatePicker: {
            colorBgContainer: "#20223B",
            colorBorder: "#20223B",
            hoverBorderColor: "#383B66",
            activeBorderColor: "#383B66",
            colorPrimary: "#9254de",
            colorText: "#FFFFFF",
            colorTextHeading: "#FFFFFF",
            colorTextPlaceholder: "#FFFFFF",
            colorBgElevated: "#20223B",
            cellHoverBg: "#9254de",
            controlItemBgActive: "#391085",
            colorTextDisabled: "#919191",
            colorIcon: "#515ACA",
            colorIconHover: "#515ACA",
          },
        },
      }}
    >
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
  );
}

export default App;
