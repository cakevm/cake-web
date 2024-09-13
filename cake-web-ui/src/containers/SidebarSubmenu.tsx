import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SubmenuItem {
    path: string;
    name: string;
    icon: React.ReactNode;
}

interface SidebarSubmenuProps {
    submenu?: SubmenuItem[];
    name: string;
    icon: React.ReactNode;
}

const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({ submenu, name, icon }) => {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (submenu.some((m) => m.path === location.pathname)) {
            setIsExpanded(true);
        }
    }, [location.pathname, submenu]);

    return (
        <div className="flex flex-col">
            <div className="block w-full" onClick={() => setIsExpanded(!isExpanded)}>
                {icon} {name}
                <ChevronDownIcon
                    className={
                        "delay-400 float-right mt-1 h-5 w-5 transition-all duration-500 " +
                        (isExpanded ? "rotate-180" : "")
                    }
                />
            </div>

            <div className={`w-full ${isExpanded ? "" : "hidden"}`}>
                <ul className="menu-compact menu">
                    {submenu.map((m, k) => (
                        <li key={k}>
                            <Link to={m.path}>
                                {m.icon} {m.name}
                                {location.pathname === m.path && (
                                    <span
                                        className="absolute inset-y-0 left-0 my-1 w-1 rounded-r-md bg-primary"
                                        aria-hidden="true"
                                    ></span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SidebarSubmenu;