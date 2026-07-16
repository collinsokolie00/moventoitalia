"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navigation = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Service Areas", href: "/service-areas" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
];

type NavigationLinksProps = {
    mobile?: boolean;
    onNavigate?: () => void;
};

function isActivePath(pathname: string, href: string) {
    if (href === "/") {
        return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavigationLinks({
    mobile = false,
    onNavigate,
}: NavigationLinksProps) {
    const pathname = usePathname();

    if (mobile) {
        return (
            <div className="flex flex-col gap-2">
                {navigation.map((item) => {
                    const active = isActivePath(pathname, item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            aria-current={active ? "page" : undefined}
                            className={[
                                "flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold transition",
                                active
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-800 hover:bg-slate-50 hover:text-blue-700",
                            ].join(" ")}
                        >
                            <span>{item.label}</span>

                            {active && (
                                <span className="h-2 w-2 rounded-full bg-blue-600" />
                            )}
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => {
                const active = isActivePath(pathname, item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
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