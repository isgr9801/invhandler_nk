"use client";

import { useEffect } from "react";

export default function DarkModeProvider() {
	useEffect(() => {
		const isDarkMode = localStorage.getItem("theme") === "dark";
		if (isDarkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, []);

	return null;
}
