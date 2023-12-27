import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Routes, Route, Navigate } from "react-router-dom";
import TaskComponent from "./components/TaskComponent";
import SignupComponent from "./components/SignupComponent";

const isAuthenticated = () => {
  return localStorage.getItem('jwtToken') !== null;
};

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <SignupComponent />,
    },
    {
      path: "/task-listing",
      element: <TaskComponent />,
    },
  ]);

  useEffect(() => {
    // Check authentication and redirect to the appropriate route
    if (!isAuthenticated()) {
      appRouter.navigate("/");
    }
  }, [appRouter]);

  return (
    <div>
      <RouterProvider router={appRouter}>
        <Routes>
          <Route path="/" element={<SignupComponent />} />
          <Route path="/task-listing" element={<TaskComponent />} />
          {/* Add any additional routes as needed */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </RouterProvider>
    </div>
  );
}

export default App;
