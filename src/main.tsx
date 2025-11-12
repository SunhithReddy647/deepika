import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
// Removed Convex auth; keep UI-only routing
import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import Home from "./pages/Home.tsx";
import NotFound from "./pages/NotFound.tsx";
import "./types/global.d.ts";




function RouteSyncer() {
  const location = useLocation();
  const navLock = useRef(false);
  const suppressPostRef = useRef(false);

  useEffect(() => {
    if (suppressPostRef.current) {
      suppressPostRef.current = false;
      return;
    }
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname, source: "vly-iframe" },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.source !== window.parent) return;
      if (event.data?.source === "vly-iframe") return;

      if (event.data?.type === "navigate") {
        if (navLock.current) return;
        navLock.current = true;

        suppressPostRef.current = true;
        try {
          if (event.data.direction === "back") window.history.back();
          if (event.data.direction === "forward") window.history.forward();
        } finally {
          // Release the lock shortly after to avoid loops
          setTimeout(() => {
            navLock.current = false;
          }, 300);
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
        <BrowserRouter>
          <RouteSyncer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
    </InstrumentationProvider>
  </StrictMode>,
);