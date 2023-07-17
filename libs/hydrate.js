import ReactDOM from "react-dom";
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { getResources } from "bundlejs";

function Main({ routes, staticContext, App }) {
	useEffect(() => {
		const jssStylesElem = document.querySelector("#jss-server-side");
		if (jssStylesElem) {
			jssStylesElem.parentElement.removeChild(jssStylesElem);
		}
	}, []);

	return (
		<Router>
			<App routes={routes} staticContext={staticContext} />
		</Router>
	);
}

export const hydrate = async function (routes, currentRoute, App) {
	let configuredRoutes = [];
	configuredRoutes = configuredRoutes.concat(routes);

	const currentRouteIndex = configuredRoutes.findIndex(
		(route) => route.path === currentRoute.path
	);

	const type = currentRoute.ssr ? "hydrate" : "render";

	try {
		configuredRoutes[currentRouteIndex] = await getResources({
			currentRoute: configuredRoutes[currentRouteIndex],
		});
	} catch (err) {
		throw err;
	}

	console.log({ configuredRoutes });

	const appStateElem = document.querySelector("#app-page-state");
	const staticContext = JSON.parse(appStateElem.innerHTML || "{}") || {};

	ReactDOM[type](
		<Main routes={configuredRoutes} App={App} staticContext={staticContext} />,
		document.getElementById("root")
	);
};
