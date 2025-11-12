import { Toaster } from "@/components/ui/sonner";
// Removed Convex auth; keep UI-only routing
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import "./types/global.d.ts";




 


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    <Toaster />
  </StrictMode>,
);
