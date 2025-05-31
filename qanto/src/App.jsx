import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import ReportIssue from "./components/ReportIssue";
import MyIssues from "./components/MyIssues";
import Proposals from "./components/Proposals";
import CityMap from "./components/Map";
import UserProtectWrapper from "./components/auth/userAuthWrapper";
import { DashboardLayout } from "./components/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <UserProtectWrapper>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/report"
          element={
            <UserProtectWrapper>
              <DashboardLayout>
                <ReportIssue />
              </DashboardLayout>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/my-issues"
          element={
            <UserProtectWrapper>
              <DashboardLayout>
                <MyIssues />
              </DashboardLayout>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/proposals"
          element={
            <UserProtectWrapper>
              <DashboardLayout>
                <Proposals />
              </DashboardLayout>
            </UserProtectWrapper>
          }
        />
        <Route
          path="/map"
          element={
            <UserProtectWrapper>
              <DashboardLayout>
                <CityMap />
              </DashboardLayout>
            </UserProtectWrapper>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
