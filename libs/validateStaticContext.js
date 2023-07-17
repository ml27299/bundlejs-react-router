export const validateStaticContext = (route) => async (req, res, next) => {
	try {
		if (!route.model || route.model.length === 0) return next();

		const data = req.staticContext;
		const responses = await Promise.all(
			route.model.filter((model) => !!model).map((model) => model(data))
		);

		responses.forEach((response) => Object.assign(req.staticContext, response));

		return next();
	} catch (err) {
		await res.renderServerError(err);
	}
};
