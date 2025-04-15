
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import Add from "./pages/Add";
import NotFound from "./pages/NotFound";
import { WelcomePopup } from "./components/WelcomePopup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // For testing purposes, uncomment this to reset the welcome popup state
  useEffect(() => {
    console.log("App component mounted - checking welcome popup state");
    localStorage.removeItem('hasShownWelcome');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner position="top-right" closeButton />
        <BrowserRouter>
          <WelcomePopup />
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/auth" element={<Layout><Auth /></Layout>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route 
              path="/dashboard" 
              element={
                <Layout requireAuth={true}>
                  <Dashboard />
                </Layout>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <Layout requireAuth={true}>
                  <Profile />
                </Layout>
              } 
            />
            <Route 
              path="/search" 
              element={
                <Layout requireAuth={true}>
                  <Search />
                </Layout>
              } 
            />
            <Route 
              path="/chat" 
              element={
                <Layout requireAuth={true}>
                  <Chat />
                </Layout>
              } 
            />
            <Route 
              path="/add" 
              element={
                <Layout requireAuth={true}>
                  <Add />
                </Layout>
              } 
            />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
