import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen w-full bg-slate-900 text-stone-200">
      <TopBar />
      <div className="flex-1 overflow-auto overflow-x-hidden relative">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
