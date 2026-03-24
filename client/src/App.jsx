import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CampaignsList from './pages/CampaignsList';
import CampaignDetail from './pages/CampaignDetail';
import CreateCampaign from './pages/CreateCampaign';
import MyDonations from './pages/MyDonations';
import Admin from './pages/Admin';
import MyTasks from './pages/MyTasks';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  // Admin has its own full-screen sidebar layout — render it outside the main Layout
  if (isAdmin) {
    return <Admin />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/campaigns" element={<CampaignsList />} />
        <Route path="/campaigns/new" element={<CreateCampaign />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
        <Route path="/my-donations" element={<MyDonations />} />
        <Route path="/my-tasks" element={<MyTasks />} />
      </Routes>
    </Layout>
  );
}

export default App;
