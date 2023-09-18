export const load = async (event) => {
	let clientIp = '';
	try {
		clientIp = event.getClientAddress();
	} catch (error: any) {
		clientIp = error;
	}
	return { clientIp };
};