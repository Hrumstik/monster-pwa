import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./core/layout";
import MyPWAs from "./Routes/AccountPWA/MyPWAs";
import LoginPage from "./Routes/Login/Login";
import EditorPWA from "./Routes/EditorPWA/EditorPWA";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedRoutes from "./Routes/protected-routes";
import Analytics from "./Routes/Analytics/Analytics";
import { ConfigProvider } from "antd";

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
      theme={{
        components: {
          Table: {
            bodySortBg: "#20223B",
            headerBg: "#515ACA",
            borderColor: "#20223B",
            colorBgContainer: "#20223B",
            colorText: "#FFFFFF",
            headerColor: "#FFFFFF",
            headerSplitColor: "none",
            rowHoverBg: "#383B66",
          },
          Select: {
            colorBorder: "#383B66",
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
