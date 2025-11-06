import { Suspense, lazy } from "react";
import { Outlet } from "react-router";
import type { RouteObject } from "react-router";

const HomePage = lazy(() => import("@/pages/website/home"));
const webCustom: RouteObject[] = [
	{
		path: "home",
		element: <HomePage />,
	},
];

export const webRoutes: RouteObject[] = [
	{
		path: "/",
		element: (
			<Suspense>
				<Outlet />
			</Suspense>
		),
		children: <HomePage />,
	},
];

