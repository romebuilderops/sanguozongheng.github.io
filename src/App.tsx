import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import CityMap from './pages/CityMap';
import Campaign from './pages/Campaign';
import Combat from './pages/Combat';
import Generals from './pages/Generals';
import Gacha from './pages/Gacha';
import Shop from './pages/Shop';
import Bag from './pages/Bag';
import Help from './pages/Help';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/combat" element={<Combat />} />
        
        {/* Pages with Layout (TopBar & BottomNav) */}
        <Route element={<Layout />}>
          <Route path="/city" element={<CityMap />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/generals" element={<Generals />} />
          <Route path="/gacha" element={<Gacha />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/bag" element={<Bag />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
