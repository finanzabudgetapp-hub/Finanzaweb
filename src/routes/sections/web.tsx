import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { RouteObject } from "react-router";

const HomePage = lazy(() => import("@/pages/website/home"));

export const webRoutes: RouteObject[] = [
	{
		path: "/",
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<Outlet />
			</Suspense>
		),
		children: [
			{
				index: true, // 👈 this makes it the default "/" route
				element: <HomePage />,
			},
			{
				path: "home", // optional: "/home" will also show same page
				element: <HomePage />,
			},
		],
	},
];
