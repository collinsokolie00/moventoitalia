"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteLoadingTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentRoute = `${pathname}?${searchParams.toString()}`;
  const [pendingFromRoute, setPendingFromRoute] = useState<string | null>(null);
  const pending = pendingFromRoute === currentRoute;

  useEffect(() => {
    const clearPendingNavigation = () => setPendingFromRoute(null);
    const clearWhenVisible = () => {
      if (document.visibilityState === "visible") clearPendingNavigation();
    };

    window.addEventListener("popstate", clearPendingNavigation);
    window.addEventListener("pageshow", clearPendingNavigation);
    document.addEventListener("visibilitychange", clearWhenVisible);
    return () => {
      window.removeEventListener("popstate", clearPendingNavigation);
      window.removeEventListener("pageshow", clearPendingNavigation);
      document.removeEventListener("visibilitychange", clearWhenVisible);
    };
  }, []);

  useEffect(() => {
    const begin = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (
        !anchor ||
        anchor.target ||
        anchor.download ||
        anchor.hasAttribute("data-no-route-loading")
      ) return;

      const destination = new URL(anchor.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname.startsWith("/admin") ||
        `${destination.pathname}${destination.search}` ===
          `${window.location.pathname}${window.location.search}`
      ) return;

      setPendingFromRoute(currentRoute);
    };

    document.addEventListener("click", begin, true);
    return () => {
      document.removeEventListener("click", begin, true);
    };
  }, [currentRoute]);

  if (!pending) return null;

  return (
    <div
      className="movento-route-loading pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-[#f7fbff]/96"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="movento-route-loading__mark rounded-3xl border border-blue-100 bg-[#fffdf7] px-7 py-5 shadow-lg shadow-blue-950/10">
        <Image
          src="/movento-logo.png"
          alt=""
          width={1716}
          height={889}
          className="h-16 w-auto"
          priority
        />
      </div>
    </div>
  );
}
