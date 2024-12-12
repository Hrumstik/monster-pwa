import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./core/layout";
import MyPWAs from "@routes/AccountPWA/MyPWAs";
import LoginPage from "@routes/Login/Login";
import EditorPWA from "@routes/EditorPWA/EditorPWA";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedRoutes from "./routes/protected-routes";

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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
