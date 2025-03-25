"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { useRouter } from "next/navigation";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function CsvUploader() {
	const { user } = useAuth();
	const router = useRouter();
	const [file, setFile] = useState<File | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [authAction, setAuthAction] = useState<
		"upload-csv" | "upload-mcsv" | null
	>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [isClient, setIsClient] = useState(false);

	// remove if  hydration mismatch occuer
	useEffect(() => setIsClient(true), []);
	useEffect(() => {
		if (!isClient) return;
		if (user === undefined) return;
		if (!user) {
			router.push("/login");
		}
	}, [user, router, isClient]);

	//dynamic api handling for 2 cards
	const handleUpload = async () => {
		if (!file) {
			setError("Please select a file first.");
			return;
		}

		setIsLoading(true);
		setError("");
		setSuccessMessage("");

		try {
			const formData = new FormData();
			formData.append("file", file);

			const apiUrl =
				authAction === "upload-csv"
					? "/api/putCsv/insertNCsv"
					: "/api/putCsv/insertMCsv";

			const res = await fetch(apiUrl, {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			if (res.ok) {
				setSuccessMessage("CSV uploaded successfully!");
			} else {
				setError(data.error || "Upload failed");
			}
		} catch (err) {
			setError("An error occurred while uploading.");
		} finally {
			setIsLoading(false);
		}
	};

	// reauth to upload
	const reauthenticate = async () => {
		if (!user || !password) {
			setError("Password is required.");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			if (!auth.currentUser) {
				throw new Error("No authenticated user found.");
			}

			if (!user.email) {
				throw new Error("User email is missing.");
			}

			const credential = EmailAuthProvider.credential(user.email, password);
			await reauthenticateWithCredential(auth.currentUser, credential);
			setIsModalOpen(false);

			if (authAction) {
				await handleUpload();
			}
		} catch (error) {
			setError("Re-authentication failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Prevent UI mismatch when rendering
	if (!isClient) {
		return <p className="text-center mt-6">Loading user data...</p>;
	}

	return (
		<div>
			<a
				href="/dashboard"
				className="text-base font-semibold text-blue-600 underline dark:text-blue-500 hover:no-underline cursor-pointer"
			>
				dashboard
			</a>
			{" / "}

			<a
				href="/dashboard/uploads"
				className="text-base font-semibold text-blue-600 underline dark:text-blue-500 hover:no-underline cursor-pointer"
			>
				uploads
			</a>
			<div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-4 sm:p-6">
				<h2 className="text-2xl font-semibold">CSV Upload Dashboard</h2>
				<p className="text-gray-600 dark:text-gray-300 mt-2">
					To sync sheets upload respective .csv files through below cards
					<br />
					<br />
					To upload CSV files, re-authentication is required.
				</p>

				<div className="flex flex-col md:flex-row gap-6 mt-6">
					{/* upload and insert regular price sheet CSV */}
					<div className="w-full md:w-1/2 lg:max-w-lg p-4 bg-gray-100 dark:bg-gray-800 shadow rounded-lg">
						<h3 className="text-lg font-semibold">Upload REGULAR CSV File</h3>
						<input
							type="file"
							accept=".csv"
							onChange={(e) => setFile(e.target.files?.[0] || null)}
							className="mt-2 block w-full rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
							required
						/>
						<div className="flex justify-center mt-6">
							<button
								onClick={() => {
									setAuthAction("upload-csv");
									setIsModalOpen(true);
								}}
								className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full transition transform hover:scale-105"
							>
								Upload CSV
							</button>
						</div>
					</div>

					{/* Upload M-CSV */}
					<div className="w-full md:w-1/2 lg:max-w-lg p-4 bg-green-100 dark:bg-green-200 shadow rounded-lg">
						<h3 className="text-lg font-semibold text-green-600">
							Upload MASTER Price Sheet-CSV File
						</h3>
						<input
							type="file"
							accept=".csv"
							onChange={(e) => setFile(e.target.files?.[0] || null)}
							className="mt-2 block w-full rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
						<div className="flex justify-center mt-6">
							<button
								onClick={() => {
									setAuthAction("upload-mcsv");
									setIsModalOpen(true);
								}}
								className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full transition transform hover:scale-105"
							>
								Upload MASTER-CSV
							</button>
						</div>
					</div>
				</div>

				{/* Success Message */}
				{successMessage && (
					<div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
						{successMessage}
					</div>
				)}

				{/* Error Message */}
				{error && (
					<div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
						{error}
					</div>
				)}

				{/* reauth Modal */}
				{isClient && isModalOpen && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
						<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm">
							<h3 className="text-lg font-semibold">Re-authenticate</h3>
							<p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
								Enter your password to continue.
							</p>
							<div className="mt-2 relative">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter password"
									className="block w-full rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
									disabled={isLoading}
									required
								/>
								<button
									onClick={() => setShowPassword(!showPassword)}
									className="absolute top-1/2 right-3 transform -translate-y-1/2"
									disabled={isLoading}
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>

							<div className="flex justify-end mt-4 space-x-4">
								<button
									onClick={() => setIsModalOpen(false)}
									className="bg-gray-400 text-white px-4 py-2 rounded-md"
								>
									Cancel
								</button>
								<button
									onClick={reauthenticate}
									className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
								>
									{isLoading ? (
										<Loader2 className="animate-spin w-5 h-5" />
									) : (
										"Confirm"
									)}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
