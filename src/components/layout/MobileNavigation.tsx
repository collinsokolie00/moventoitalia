"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import NavigationLinks from "./NavigationLinks";

export default function MobileNavigation() {
    const [isOpen, setIsOpen] = useState(false);

    function closeMenu() {
        setIsOpen(false);
    }

    return (
        <div className="lg:hidden">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-800 transition hover:border-blue-300 hover:text-blue-700"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 top-full border-t border-slate-200 bg-white shadow-xl">
                    <div className="mx-auto max-w-7xl px-5 py-5">
                        <NavigationLinks mobile onNavigate={closeMenu} />

                        <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                            <Link
                                href="/quote"
                                onClick={closeMenu}
                                className="flex items-center justify-center rounded-full border border-blue-700 px-5 py-3 text-sm font-bold text-blue-700"
                            >
                                Get an Estimate
                            </Link>

                            <Link
                                href="/booking"
                                onClick={closeMenu}
                                className="flex items-center justify-center rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white"
                            >
                                Book a Move
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}