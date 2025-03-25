"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { setCookie, deleteCookie } from "cookies-next";
import { app } from "../lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import LoadingSpinner from "./ui/LoadingSpinner";

const auth = getAuth(app);

const AuthContext = createContext<{
	user: User | null;
	logout: () => Promise<void>; // ✅ Added logout function
}>({
	user: null,
	logout: async () => {}, // Placeholder
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	// ✅ Function to log out the user
	const logout = async () => {
		try {
			await signOut(auth);
			deleteCookie("firebaseAuthToken");
			setUser(null);
			router.push("/login"); // Redirect to login after logout
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setUser(user);
			setLoading(false);

			if (user) {
				const token = await user.getIdToken();
				setCookie("firebaseAuthToken", token, {
					maxAge: 60 * 60 * 24,
					path: "/",
				});

				if (pathname === "/login") {
					router.replace("/dashboard");
				}
			} else {
				deleteCookie("firebaseAuthToken");
				if (pathname.startsWith("/dashboard")) {
					router.replace("/login");
				}
			}
		});

		return () => unsubscribe();
	}, [router, pathname]);

	if (loading) {
		return <LoadingSpinner />;
	}

	return (
		<AuthContext.Provider value={{ user, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
