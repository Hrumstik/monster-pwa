import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./core/layout";
import MyPWAs from "./Routes/AccountPWA/MyPWAs";
import LoginPage from "./Routes/Login/Login";
import EditorPWA from "./Routes/EditorPWA/EditorPWA";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  const router = createBrowserRouter([
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
