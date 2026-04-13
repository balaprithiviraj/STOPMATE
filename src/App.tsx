import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AlarmPage from './pages/AlarmPage';
import CommunityPage from './pages/CommunityPage';
import GuardianPage from './pages/GuardianPage';
import SOSPage from './pages/SOSPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AlarmPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="guardian" element={<GuardianPage />} />
          <Route path="sos" element={<SOSPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
