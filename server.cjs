process.env.SOCKET_PATH = process.env.PORT;
delete process.env.PORT;

import('./index.js'); // the ./ is required for IIS
