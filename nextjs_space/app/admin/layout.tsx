'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Users,
  MessageSquare,
  Mail,
  LogOut,
  Menu,
  X,
  Zap,
  ShoppingCart,
  UserCog,
  FileType,
  BarChart3,
  Settings,
  Headphones,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Sales Analytics', icon: BarChart3 },
  { href: '/admin/quotes', label: 'Quote Requests', icon: FileText },
  { href: '/admin/invoices', label: 'Invoices', icon: Receipt },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/team', label: 'Team', icon: UserCog },
  { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
  { href: '/admin/support-tickets', label: 'Support Tickets', icon: Headphones },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/email-templates', label: 'Email Templates', icon: FileType },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [status, pathname, router]);

  // Don't show the layout on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the dashboard if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/admin/login' });
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gradient-to-b from-green-700 via-green-600 to-teal-600 text-white">
        <div className="p-6 border-b border-green-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/energenius-badge.png"
                alt="EnerGenius"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">EnerGenius</h1>
              <p className="text-xs text-green-100">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? 'bg-white text-green-700 font-semibold shadow-md'
                    : 'text-green-50 hover:bg-green-600/50'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-500">
          <div className="px-4 py-3 bg-green-800/30 rounded-lg mb-3">
            <p className="text-sm font-medium">{session?.user?.name || 'Admin User'}</p>
            <p className="text-xs text-green-100 truncate">
              {session?.user?.email}
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-green-50 hover:bg-green-600/50 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-700 via-green-600 to-teal-600 text-white transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-green-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/energenius-badge.png"
                alt="EnerGenius"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">EnerGenius</h1>
              <p className="text-xs text-green-100">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:bg-green-600/50 rounded p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? 'bg-white text-green-700 font-semibold shadow-md'
                    : 'text-green-50 hover:bg-green-600/50'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-green-500">
          <div className="px-4 py-3 bg-green-800/30 rounded-lg mb-3">
            <p className="text-sm font-medium">{session?.user?.name || 'Admin User'}</p>
            <p className="text-xs text-green-100 truncate">
              {session?.user?.email}
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-green-50 hover:bg-green-600/50 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Sales Back Office
              </h2>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{session?.user?.name || 'Admin'}</span>
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
