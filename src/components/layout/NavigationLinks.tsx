"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { ChromeLink } from "@/lib/database/site-chrome";
import {
    isNavigationPathActive,
    localePath,
    type Locale,
} from "@/lib/i18n/config";

type NavigationLinksProps = {
    navigation: ChromeLink[];
    mobile?: boolean;
    onNavigate?: () => void;
    locale: Locale;
};

export default function NavigationLinks({
    navigation,
    mobile = false,
    onNavigate,
    locale,
}: NavigationLinksProps) {
    const pathname = usePathname();

    if (mobile) {
        return (
            <nav
                aria-label={locale==="it"?"Collegamenti di navigazione mobile":"Mobile navigation links"}
                className="grid grid-cols-2 gap-3"
            >
                {navigation.map((item) => {
                    const href = localePath(locale, item.href);
                    const active = isNavigationPathActive(pathname, href);

                    return (
                        <Link
                            key={item.href}
                            href={href}
                            onClick={onNavigate}
                            aria-current={active ? "page" : undefined}
                            className={[
                                "relative flex min-h-14 min-w-0 items-center justify-center overflow-hidden rounded-2xl border px-3 py-3 text-center text-sm font-semibold leading-snug transition",
                                active
                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700",
                            ].join(" ")}
                        >
                            <span className="min-w-0 break-words">
                                {item.label}
                            </span>

                            {active && (
                                <span
                                    aria-hidden="true"
                                    className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-600"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>
        );
    }

    return (
        <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => {
                const href = localePath(locale, item.href);
                const active = isNavigationPathActive(pathname, href);

                return (
                    <Link
                        key={item.href}
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={[
                            "relative py-2 text-sm font-semibold transition",
                            active
                                ? "text-blue-700"
                                : "text-slate-700 hover:text-blue-700",
                        ].join(" ")}
                    >
                        {item.label}

                        <span
                            aria-hidden="true"
                            className={[
                                "absolute -bottom-1 left-0 h-0.5 rounded-full bg-blue-700 transition-all duration-200",
                                active ? "w-full" : "w-0",
                            ].join(" ")}
                        />
                    </Link>
                );
            })}
        </nav>
    );
}
