"use client";
import { useState } from "react";
import Link from "next/link";
import {
	Menu,
	Upload,
	Package,
	Users,
	Settings,
	LayoutDashboard,
} from "lucide-react";
import DashboardCard from "./Site/DashboardCard";

const Sidebar = () => {
	const [expanded, setExpanded] = useState(false);

	const menuItems = [
		{
			icon: <LayoutDashboard size={22} />,
			path: "/dashboard",
			label: "Dashboard",
		},
		{
			icon: <Upload size={22} />,
			path: "/dashboard/uploads",
			label: "Uploads",
		},
		// { icon: <Users size={22} />, path: "/customers", label: "Customers" },
		// {
		// 	icon: <Settings size={22} />,
		// 	path: "/dashboard/contactus",
		// 	label: "Contact Us",
		// },
	];

	return (
		<aside
			className={`h-screen ${
				expanded ? "w-48" : "w-16"
			} bg-gray-900 dark:bg-gray-800 text-white flex flex-col items-center py-4 gap-6 transition-all`}
		>
			<button
				onClick={() => setExpanded(!expanded)}
				className="p-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
			>
				<Menu size={22} />
			</button>

			{menuItems.map((item, index) => (
				<Link
					key={index}
					href={item.path}
					className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 w-full transition-colors"
				>
					{item.icon}
					{expanded && <span className="text-sm">{item.label}</span>}
				</Link>
			))}
		</aside>
	);
};

export default Sidebar;
