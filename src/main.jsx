import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SidebarProvider } from "./context/Sidebarcontext";
import { ToastProvider } from "./context/ToastContext.jsx";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <BrowserRouter>
      <ToastProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
