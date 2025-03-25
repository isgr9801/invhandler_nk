// "use client";
// import { ThemeProvider } from "next-themes";
// import { AuthProvider } from "../context/AuthContext";
// import "../styles/globals.css";
// import { useState, useEffect } from "react";

// export default function RootLayout({
// 	children,
// }: {
// 	children: React.ReactNode;
// }) {
// 	const [mounted, setMounted] = useState(false);

// 	useEffect(() => {
// 		setMounted(true);
// 	}, []);

// 	return (
// 		<html lang="en" suppressHydrationWarning>
// 			<head>
// 				<link rel="icon" href="/favicon.ico" />
// 			</head>
// 			<body>
// 				<AuthProvider>
// 					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
// 						<div
// 							className={
// 								mounted ? "" : "opacity-0 transition-opacity duration-500"
// 							}
// 						>
// 							{children}
// 						</div>
// 					</ThemeProvider>
// 				</AuthProvider>
// 			</body>
// 		</html>
// 	);
// }

import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import ThemeClientProvider from "../components/ThemeClientProvider";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body>
				<AuthProvider>
					<ThemeClientProvider>{children}</ThemeClientProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
