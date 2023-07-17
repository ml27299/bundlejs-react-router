export const renderServerError = (err, staticContext = {}) => {
	console.error(JSON.stringify(err || {}, null, 2));
	console.log(`\n${err?.stack || "no error stack"}`);

	const statusCode =
		err?.networkError?.statusCode ||
		(err?.graphQLErrors ? err?.graphQLErrors[0]?.statusCode : false) ||
		staticContext.statusCode ||
		err?.code;

	const message = err?.networkError?.message || err?.message || "";

	return {
		error: err,
		message,
		statusCode,
	};
};
