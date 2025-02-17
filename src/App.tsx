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
            colorBorder: "#383B66",
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
