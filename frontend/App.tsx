import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import InvestorRegisterPage from './pages/InvestorRegisterPage';
import BrokerRegisterPage from './pages/BrokerRegisterPage';
import BondDetailPage from './pages/BondDetailPage';
import PaymentPage from './pages/PaymentPage';
import { Bond, Broker } from './types';

export type Page =
  | 'home'
  | 'login'
  | 'investor-register'
  | 'broker-register'
  | 'bond-detail'
  | 'payment';

export interface AppState {
  page: Page;
  selectedBond?: Bond;
  selectedBroker?: Broker;
}

const AppInner = () => {
  const { user, logout } = useAuth();
  const [appState, setAppState] = useState<AppState>({ page: 'home' });

  const navigate = (page: Page, extra?: Partial<AppState>) =>
    setAppState({ page, ...extra });

  switch (appState.page) {
    case 'login':
      return <LoginPage navigate={navigate} />;
    case 'investor-register':
      return <InvestorRegisterPage navigate={navigate} />;
    case 'broker-register':
      return <BrokerRegisterPage navigate={navigate} />;
    case 'bond-detail':
      return (
        <BondDetailPage
          bond={appState.selectedBond!}
          navigate={navigate}
        />
      );
    case 'payment':
      return (
        <PaymentPage
          bond={appState.selectedBond!}
          broker={appState.selectedBroker!}
          navigate={navigate}
        />
      );
    default:
      return <LandingPage navigate={navigate} user={user} logout={logout} />;
  }
};

const App = () => (
  <AuthProvider>
    <AppInner />
  </AuthProvider>
);

export default App;
