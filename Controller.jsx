import React, { useEffect, useContext, useState } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { setStaticContext as setStaticContextLib } from "./libs/setStaticContext";
import { validateStaticContext } from "./libs/validateStaticContext";
import { renderServerError } from "./";
import { searchToObject } from "@bundlejs/core/dist/utils";

import { getResources } from "@bundlejs/core";
import Queue from "./libs/Queue";

import useDidMountEffect from "./hooks/useDidMountEffect";

const queue = new Queue();

const Controller = ({
	req = {},
	routes,
	route,
	StaticContext,
	onStaticContextChange,
	onLoading = () => {},
	...props
}) => {
	const initialStaticContext = useContext(StaticContext);
	const [staticContext, setStaticContext] = useState(initialStaticContext);
	const location = useLocation();
	const init = (route, staticContext) =>
		async function () {
			const { params } = matchPath(location.pathname, route);
			req.path = location.pathname;
			req.url = location.pathname;
			req.query = searchToObject(location.search);
			req.params = params;
			req.route = route;
			req.staticContext = staticContext;
			req = { ...req, ...location };

			const res = {
				redirect: (path) => {
					window.location.href = path;
				},
				renderServerError: (err) => {
					console.error(err);
					setError(renderServerError(err, req.staticContext));
				},
			};

			req.setStaticContext = setStaticContextLib(route)(req, res);
			res.setStaticContext = setStaticContextLib(route)(req, res);

			const next = () => () => {
				console.log("req.staticContext", req.staticContext);
				onStaticContextChange(req.staticContext, route);
				setStaticContext(req.staticContext);
			};

			onLoading(true, route);

			await getResources({ currentRoute: route });

			const responses = await Promise.all(route.controller);
			await Promise.all(
				responses
					.flat()
					.map(
						(controller) =>
							new Promise((resolve) => controller(req, res, resolve))
					)
			);

			(await validateStaticContext(route)(req, res, next))();
		};

	useDidMountEffect(() => {
		onLoading(true, route);
		queue.add(init(route, initialStaticContext), onLoading, route);
	}, [location.pathname]);

	useEffect(() => {
		if (route.ssr || !route.controller) {
			onLoading(false), route;
			return;
		}
		onLoading(true, route);
		queue.add(init(route, staticContext), onLoading, route);
	}, []);

	const backgroundProps = route.background ? route.background.props : {};
	const Background = route.background
		? route.background.value
		: (props) => <React.Fragment>{props.children}</React.Fragment>;

	return (
		<StaticContext.Provider value={staticContext}>
			<Background {...backgroundProps}>{props.children}</Background>
		</StaticContext.Provider>
	);
};

export default Controller;
