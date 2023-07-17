import React from "react";

const NetworkError = ({ error, message, statusCode = 500 }) => {
	const isProduction = process.env.NODE_ENV === "production";
	let errorMessage = message;

	if (!errorMessage || isProduction) {
		switch (statusCode) {
			case 404:
				errorMessage = "Page Not Found";
				break;
			case 503:
				errorMessage = "NearMe Unavailable";
				break;
			case 500:
			default:
				errorMessage = "Internal Server Error";
		}
	}

	return (
		<div id="wrapper">
			<div className="w1">
				<div className="main">
					<section className="info-section normal home mb32">
						<div className="container-fluid">
							<h1 className="text-center mb32">Error {statusCode}</h1>
							<div className="text-center clearfix hidden-xs">
								<span
									className="subtitle"
									style={
										isProduction || errorMessage.length < 30
											? {}
											: { borderTop: "none" }
									}
								>
									{errorMessage}
								</span>
							</div>
							{error && (
								<pre style={{ width: "%100", height: "%100" }}>
									{JSON.stringify(error, null, 2)}
								</pre>
							)}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default NetworkError;
