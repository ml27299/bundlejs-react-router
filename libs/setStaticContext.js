export const setStaticContext =
	(route) =>
	(req, res) =>
	async (data = {}) => {
		req.staticContext = Object.assign({}, req.staticContext || {}, data);
	};
