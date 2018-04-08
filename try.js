const {NodeClient, WalletClient} = require('bclient');

const client = new WalletClient({ port: 5000, path: '/bwallet' })

client.getAccount("primary", "ivy").then(console.log)