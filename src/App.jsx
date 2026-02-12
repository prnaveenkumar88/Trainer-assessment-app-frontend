
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Assessor from "./pages/Assessor";
import Trainer from "./pages/Trainer";
import CreateAssessment from "./pages/CreateAssessment";
import EditAssessment from "./pages/EditAssessment";
import ViewAssessment from "./pages/ViewAssessment";

import AuthGuard from "./components/AuthGuard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Auth />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <AuthGuard allowedRoles={["admin"]}>
              <Admin />
            </AuthGuard>
          }
        />

        <Route
          path="/admin/view/:id"
          element={
            <AuthGuard allowedRoles={["admin"]}>
              <ViewAssessment />
            </AuthGuard>
          }
        />

        {/* ================= ASSESSOR ================= */}
        <Route
          path="/assessor"
          element={
            <AuthGuard allowedRoles={["assessor"]}>
              <Assessor />
            </AuthGuard>
          }
        />

        <Route
          path="/assessor/create"
          element={
            <AuthGuard allowedRoles={["assessor"]}>
              <CreateAssessment />
            </AuthGuard>
          }
        />

        <Route
          path="/assessor/edit/:id"
          element={
            <AuthGuard allowedRoles={["assessor"]}>
              <EditAssessment />
            </AuthGuard>
          }
        />

        {/* ================= TRAINER ================= */}
        <Route
          path="/trainer"
          element={
            <AuthGuard allowedRoles={["trainer"]}>
              <Trainer />
            </AuthGuard>
          }
        />

        <Route
          path="/trainer/view/:id"
          element={
            <AuthGuard allowedRoles={["trainer"]}>
              <ViewAssessment />
            </AuthGuard>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
