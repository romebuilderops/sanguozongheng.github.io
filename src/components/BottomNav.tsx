import React from 'react';
import { NavLink } from 'react-router-dom';
import { Swords, Users, Dices, ShoppingCart } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { path: '/campaign', label: '战役', icon: Swords },
  { path: '/generals', label: '将领', icon: Users },
  { path: '/gacha', label: '抽卡', icon: Dices },
  { path: '/shop', label: '商店', icon: ShoppingCart },
];



export default function BottomNav() {
  return (
    <div className="flex justify-around items-center bg-slate-800 p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] sticky bottom-0 z-50">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => clsx(
            "flex flex-col items-center justify-center p-1 rounded-md transition-colors",
            isActive ? "text-amber-500" : "text-slate-400 hover:text-amber-400"
          )}
        >
          <item.icon className="w-5 h-5 mb-1" />
          <span className="text-xs">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
