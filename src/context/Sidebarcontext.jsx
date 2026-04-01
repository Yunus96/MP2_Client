// src/context/SidebarContext.js
// Shared state so Header (hamburger) and Sidebar (close button / overlay)
// can talk to each other without prop drilling through App.
import { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  function open()   { setIsOpen(true);  }
  function close()  { setIsOpen(false); }
  function toggle() { setIsOpen((v) => !v); }

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}