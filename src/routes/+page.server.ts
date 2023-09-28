export const load = async (event) => {
	let clientIp = '';

	const extras = {
		address_header: '',
		xff_depth: 0,
		req_headers: {},
		isHeaderExist: false,
		address_header_value: '',
		addresses: [],
		req: {},
		req_connection: {},
		req_socket: {},
		req_info: {},
	}
	
	try {
		const address_header = process.env['ADDRESS_HEADER'].toLowerCase();
		extras.address_header = address_header;
		console.log('\naddress_header: ', address_header);

		const xff_depth = parseInt(process.env['XFF_DEPTH'] || '1', 10);
		extras.xff_depth = xff_depth;
		console.log('\nxff_depth: ', xff_depth);

		const req = event.request;

		// req.headers[address_header] = '123.234.234.546'; // only for local testing
		extras.req_headers = req.headers;
		console.log('\nreq.headers: ', req.headers);

		event.getClientAddress = () => {
			if (address_header) {
				extras.isHeaderExist = address_header in req.headers;
				console.log('\nIs Address header exist?: ', address_header in req.headers);
				if (!(address_header in req.headers)) {
					throw new Error(
						`Address header was specified with ${
							'ADDRESS_HEADER'
						}=${address_header} but is absent from request`
					);
				}

				const value = /** @type {string} */ (req.headers[address_header]) || '';
				extras.address_header_value = value;
				console.log('\naddress_header value: ', value);

				if (address_header === 'x-forwarded-for') {
					const addresses = value.split(',');
					extras.addresses = addresses;
					console.log('\naddresses: ', addresses);

					if (xff_depth < 1) {
						throw new Error(`${'XFF_DEPTH'} must be a positive integer`);
					}

					if (xff_depth > addresses.length) {
						throw new Error(
							`${'XFF_DEPTH'} is ${xff_depth}, but only found ${
								addresses.length
							} addresses`
						);
					}
					return addresses[addresses.length - xff_depth].trim();
				}

				return value;
			}

			// ignore typescript errors
			console.log('\nreq', req);
			extras.req = req;
			console.log('\nreq.connection: ', req.connection);
			extras.req_connection = req.connection;
			console.log('req.socket: ', req.socket);
			extras.req_socket = req.socket;
			console.log('req.info: ', req.info);
			extras.req_info = req.info;

			return (
				req.connection?.remoteAddress ||
				// @ts-expect-error
				req.connection?.socket?.remoteAddress ||
				req.socket?.remoteAddress ||
				// @ts-expect-error
				req.info?.remoteAddress
			);
		}

		clientIp = event.getClientAddress();
	} catch (error: any) {
		clientIp = error;
	}
	
	return { clientIp, extras: JSON.stringify(extras) };
};