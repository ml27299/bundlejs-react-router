import React from "react";

import { Switch, Route as RouteServer } from "react-router-dom";

import { fixRouteOrder } from "bundlejs/dist/utils";

const App = ({ routes = [] }) => {
	if (!Array.isArray(routes)) routes = [routes];
	routes = fixRouteOrder(routes);

	return (
		<Switch>
			{routes.map(({ component, ...route }) => {
				return (
					<RouteServer
						render={() => {
							const Component = component(route);
							return <Component />;
						}}
						{...route}
						key={route.path}
					/>
				);
			})}
		</Switch>
	);
};

export default App;
