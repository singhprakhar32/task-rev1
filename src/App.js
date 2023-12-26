import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupComponent from "./components/SignupComponent";

function App() {
    const appRouter = createBrowserRouter([
        {
          path: "/",
          element: <SignupComponent />,
        },
      ]);
  return (
    <div>
    <RouterProvider router={appRouter} />
  </div>
  );
}

export default App;