"use client";
import React, { useState, ReactNode } from "react";
import { pageConfig } from "./pageConfig";
import {
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function App({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] =
    useState(false);

  const [activePath, setActivePath] = useState("/dashboard");

  const getCurrentPageName = () => {
    const activeItem = pageConfig
      .flatMap((section) => section.items)
      .find((item) => item.path === activePath);

    return activeItem ? activeItem.name : "Dashboard";
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setActivePath(path);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* --- Mobile Overlay --- */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/*  SIDEBAR */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0 w-56
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${desktopSidebarCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Sidebar Header */}
        <div
          className={`flex relative items-center h-16 px-0 border-b border-gray-200 ${
            desktopSidebarCollapsed ? "justify-between" : "justify-center"
          }`}
        >
          <div
            className={`flex items-center text-textxprimary overflow-hidden whitespace-nowrap ${
              desktopSidebarCollapsed ? "justify-center w-full" : ""
            }`}
          >
            
            <span
              className={`text-xl font-bold transition-opacity duration-300 ${
                desktopSidebarCollapsed
                  ? ""
                  : "opacity-100 w-auto"
              }`}
            >
              Eato
            </span>
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() =>
              setDesktopSidebarCollapsed(!desktopSidebarCollapsed)
            }
            className={` absolute hidden lg:flex p-1.5 rounded-md text-gray-500 hover:bg-gray-100 ${
              desktopSidebarCollapsed ? "hidden -right-4" : "block right-3"
            }`}
          >
            <PanelLeftClose size={20} />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden absolute right-3 text-gray-500 hover:text-gray-700 ml-auto"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto ">
          {pageConfig.map((section, idx) => (
            <div key={idx} className={idx > 0 ? "mt-6" : ""}>
              {!desktopSidebarCollapsed && (
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase mb-2">
                  {section.section}
                </p>
              )}

              {section.items.map((item, itemIdx) => {
                const isActive = activePath === item.path;

                return (
                  <div
                    key={itemIdx}
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-all
                      ${
                        isActive
                          ? "bg-textxsecondary/50 text-textxprimary"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                      ${desktopSidebarCollapsed ? "justify-center" : ""}
                    `}
                  >
                    <span
                      className={`${
                        desktopSidebarCollapsed ? "" : "mr-3"
                      } flex-shrink-0`}
                    >
                      {item.icon}
                    </span>

                    {!desktopSidebarCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Logout */}
          <div className="mt-8 pt-4 border-t border-gray-100">
            <div
              onClick={() => console.log("Logout")}
              className={`
                flex items-center p-3 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-100
                ${desktopSidebarCollapsed ? "justify-center" : ""}
              `}
            >
              <LogOut size={22} />
              {!desktopSidebarCollapsed && (
                <span className="ml-3 font-medium">Logout</span>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center flex-1">
            {/* Mobile Sidebar Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 mr-2 rounded-md text-gray-400 hover:bg-gray-500 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page Title (mobile) */}
            <h1 className="text-xl font-semibold text-gray-900">
              {getCurrentPageName()}
            </h1>
          </div>

          {/* Profile / Notification */}
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-textxprimary rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* MAIN PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
