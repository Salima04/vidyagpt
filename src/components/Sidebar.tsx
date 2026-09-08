'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  Database, Globe, Settings, ChevronLeft, ChevronRight, LogOut,
  Bell, User, AlertTriangle, Building2, MessageSquare, BarChart3, Bot
} from 'lucide-react';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const workspaceItems: NavItem[] = [
  { label: 'Properties', href: '/properties', icon: <Building2 size={20} /> },
  { label: 'Knowledge Base', href: '/knowledge-base-management', icon: <Database size={20} />, badge: 3 },
  { label: 'Website Crawl', href: '/website-crawl-management', icon: <Globe size={20} />, badge: 1 },
  { label: 'Chat Logs', href: '/chat-logs', icon: <MessageSquare size={20} /> },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 size={20} /> },
  { label: 'Test AI Agent', href: '/chatbot-configuration', icon: <Bot size={20} /> },
];

const systemItems: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

function NavLink({ item, collapsed, pathname }: { item: NavItem; collapsed: boolean; pathname: string }) {
  const isActive = item.href === '/'
    ? pathname === '/'
    : pathname.startsWith(item.href);

  return (
    <li>
      <Link
        href={item.href}
        className={`relative flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-500 transition-all duration-150 group ${
          isActive
            ? 'bg-primary/10 text-primary font-600' :'text-muted-foreground hover:bg-muted hover:text-foreground'
        } ${collapsed ? 'justify-center px-2' : ''}`}
        title={collapsed ? item.label : undefined}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
        {!collapsed && item.badge !== undefined && item.badge > 0 && (
          <span className="ml-auto bg-danger text-danger-foreground text-xs font-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
            {item.badge}
          </span>
        )}
        {collapsed && item.badge !== undefined && item.badge > 0 && (
          <span className="absolute top-1 right-1 bg-danger text-danger-foreground text-xs font-700 rounded-full w-4 h-4 flex items-center justify-center">
            {item.badge}
          </span>
        )}
        {collapsed && (
          <span className="absolute left-full ml-2 px-2 py-1 bg-foreground text-card text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
            {item.label}
          </span>
        )}
      </Link>
    </li>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    router.push('/sign-up-login');
  };

  return (
    <>
      <aside
        className={`relative flex flex-col bg-card border-r border-border h-screen sticky top-0 sidebar-transition flex-shrink-0 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-2.5 px-4 py-4 border-b border-border min-h-[64px] ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <div className="flex-shrink-0">
            <AppLogo size={32} />
          </div>
          {!collapsed && (
            <span className="font-extrabold text-lg tracking-tight text-foreground leading-none">
              VidyaGPT
            </span>
          )}
        </div>

        {/* Institute badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 bg-secondary rounded-md">
            <p className="text-xs font-500 text-muted-foreground uppercase tracking-wider leading-none mb-0.5">
              Institute
            </p>
            <p className="text-sm font-600 text-secondary-foreground truncate">
              IIHM — Kolkata Campus
            </p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          {/* Workspace section */}
          {!collapsed && (
            <p className="text-xs font-600 text-muted-foreground uppercase tracking-widest px-2 mb-2">
              Workspace
            </p>
          )}
          <ul className="space-y-0.5 mb-4">
            {workspaceItems.map((item) => (
              <NavLink key={`nav-${item.href}`} item={item} collapsed={collapsed} pathname={pathname} />
            ))}
          </ul>

          {/* System section */}
          {!collapsed && (
            <p className="text-xs font-600 text-muted-foreground uppercase tracking-widest px-2 mb-2">
              System
            </p>
          )}
          <ul className="space-y-0.5">
            {systemItems.map((item) => (
              <NavLink key={`nav-${item.href}`} item={item} collapsed={collapsed} pathname={pathname} />
            ))}
          </ul>

          {/* Alerts section */}
          {!collapsed && (
            <>
              <p className="text-xs font-600 text-muted-foreground uppercase tracking-widest px-2 mt-5 mb-2">
                Alerts
              </p>
              <ul className="space-y-0.5">
                <li>
                  <button className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-500 text-muted-foreground hover:bg-warning-muted hover:text-warning transition-all duration-150">
                    <AlertTriangle size={20} className="flex-shrink-0 text-warning" />
                    <span className="flex-1 text-left truncate">Conflicts</span>
                    <span className="ml-auto bg-warning text-warning-foreground text-xs font-700 rounded-full w-5 h-5 flex items-center justify-center">
                      4
                    </span>
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-500 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-150">
                    <Bell size={20} className="flex-shrink-0" />
                    <span className="flex-1 text-left truncate">Notifications</span>
                    <span className="ml-auto bg-primary text-primary-foreground text-xs font-700 rounded-full w-5 h-5 flex items-center justify-center">
                      7
                    </span>
                  </button>
                </li>
              </ul>
            </>
          )}
        </nav>

        {/* User + Logout */}
        <div
          className={`border-t border-border px-2 py-3 flex items-center gap-2.5 ${
            collapsed ? 'justify-center flex-col' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-600 text-foreground truncate leading-tight">Arjun Mehta</p>
              <p className="text-xs text-muted-foreground truncate">admin@iihm.ac.in</p>
            </div>
          )}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-danger transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-10"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={12} className="text-muted-foreground" />
          ) : (
            <ChevronLeft size={12} className="text-muted-foreground" />
          )}
        </button>
      </aside>

      {/* Logout confirmation */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Sign Out"
        description="Are you sure you want to sign out? Any unsaved changes will be lost."
        confirmLabel="Sign Out"
        isDestructive={false}
        onConfirm={handleLogout}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}