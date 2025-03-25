"use client";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

export default function ThemeClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return <div />; // Prevent hydration mismatch

	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
		</ThemeProvider>
	);
}
