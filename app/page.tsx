"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function HomePage() {
	const { user } = useAuth();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	const { theme, setTheme, systemTheme } = useTheme();
	const resolvedTheme = theme === "system" ? systemTheme : theme;

	useEffect(() => {
		if (user) {
			router.replace("/dashboard");
		}
		setIsLoading(false);
	}, [user, router]);

	if (isLoading) return null;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
			{/* Toggle */}
			<div className="absolute top-4 right-4">
				<button
					onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
					className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
				>
					{resolvedTheme === "dark" ? (
						<Sun className="w-6 h-6" />
					) : (
						<Moon className="w-6 h-6" />
					)}
				</button>
			</div>

			<h1 className="text-5xl font-bold mb-5">Welcome to </h1>
			<h2 className="text-4xl text-purple-800 font-bold mb-5">
				{" "}
				Bikaji's Buisness Dashboard{" "}
			</h2>
			<p className="text-lg text-center mb-20">
				Confirm the autherization by sign in...
			</p>
			<button
				onClick={() => router.push("/login")}
				className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
			>
				Sign In
			</button>
		</div>
	);
}
