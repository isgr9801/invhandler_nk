"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NotFoundPage = () => {
	const router = useRouter();
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				return prev > 0 ? prev - 1 : prev;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (countdown === 0) {
			router.push("/");
		}
	}, [countdown, router]);

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
			<h1 className="text-6xl font-bold">404</h1>
			<p className="text-xl justify-center mt-2">
				Something went wrong !
				<br /> page not found....
			</p>
			<p className="mt-2 text-gray-500">
				Redirecting to home in {countdown} seconds...
			</p>
		</div>
	);
};

export default NotFoundPage;
