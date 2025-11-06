import { Navigate, type RouteObject } from "react-router";
import { authRoutes } from "./auth";
import { webRoutes } from "./web";
import { dashboardRoutes } from "./dashboard";
import { mainRoutes } from "./main";

export const routesSection: RouteObject[] = [
	// Web
	...webRoutes,
	// Auth
	...authRoutes,
	// Dashboard
	...dashboardRoutes,
	// Main
	...mainRoutes,
	// No Match
	{ path: "*", element: <Navigate to="/404" replace /> },
];
