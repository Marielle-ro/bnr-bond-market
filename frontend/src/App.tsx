import React, { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import InvestorRegisterPage from "./pages/InvestorRegisterPage";
import BrokerRegisterPage from "./pages/BrokerRegisterPage";
import InvestorDashboardPage from "./pages/InvestorDashboardPage";
import BrowseBondsPage from "./pages/BrowseBondsPage";
import BrokerSelectPage from "./pages/BrokerSelectPage";
import PaymentPage from "./pages/PaymentPage";
import BrokerDashboardPage from "./pages/BrokerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { BondType, BrokerBondListing } from "./types";

export type Page =
  | "home"
  | "login/admin"
  | "login/investor"
  | "login/broker"
  | "register/investor"
  | "register/broker"
  | "investor/dashboard"
  | "investor/browse"
  | "investor/broker-select"
  | "investor/checkout"
  | "broker/dashboard"
  | "admin/dashboard";

export interface AppState {
  page: Page;
  selectedBond?: BondType;
  selectedBrokerListing?: BrokerBondListing;
}

const AppInner = () => {
  const [appState, setAppState] = useState<AppState>({ page: "home" });

  const navigate = (page: Page, extra?: Partial<AppState>) =>
    setAppState({ page, ...extra });

  const { page } = appState;

  if (page === "login/admin")    return <LoginPage navigate={navigate} role="ADMIN" />;
  if (page === "login/investor") return <LoginPage navigate={navigate} role="INVESTOR" />;
  if (page === "login/broker")   return <LoginPage navigate={navigate} role="BROKER" />;

  if (page === "register/investor") return <InvestorRegisterPage navigate={navigate} />;
  if (page === "register/broker")   return <BrokerRegisterPage navigate={navigate} />;

  if (page === "investor/dashboard") return <InvestorDashboardPage navigate={navigate} />;
  if (page === "investor/browse")    return <BrowseBondsPage navigate={navigate} />;

  if (page === "investor/broker-select") {
    return appState.selectedBond
      ? <BrokerSelectPage navigate={navigate} bond={appState.selectedBond} />
      : <BrowseBondsPage navigate={navigate} />;
  }

  if (page === "investor/checkout") {
    return appState.selectedBond && appState.selectedBrokerListing
      ? <PaymentPage navigate={navigate} bond={appState.selectedBond} brokerListing={appState.selectedBrokerListing} />
      : <BrowseBondsPage navigate={navigate} />;
  }

  if (page === "broker/dashboard") return <BrokerDashboardPage navigate={navigate} />;
  if (page === "admin/dashboard")  return <AdminDashboardPage navigate={navigate} />;

  return <LandingPage navigate={navigate} />;
};

const App = () => (
  <AuthProvider>
    <AppInner />
  </AuthProvider>
);

export default App;
