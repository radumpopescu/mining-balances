const { makeRequest } = require("./functions");
const { logBalance, getAccounts } = require("./db");

function processLongEthNumber(n) {
  return Math.round(n / 100000000000) / 10000000;
}

async function scrapeAccounts() {
  const accounts = await getAccounts();

  console.log(`Getting balances ${new Date()}`);
  accounts.forEach(async ({ id, address, pool }) => {
    let balance;
    try {
      switch (pool) {
        case 1: // Ethermine
          balance = await ethermineBalance(address);
          console.log("ethermine", balance);
          break;
        case 2: // Ezil
          balance = await ezilBalance(address);
          console.log("ezil", balance);
          break;
        case 3: // F2Pool
          balance = await f2poolBalance(address);
          console.log("f2pool", balance);
          break;
        case 4: // Hiveon
          balance = await hiveonBalance(address);
          console.log("hiveon", balance);
          break;
        case 5: // Flexpool
          balance = await flexpoolBalance(address);
          console.log("flexpool", balance);
          break;
        case 6: // Nicehash
          console.log("TODO");
          break;
      }
      logBalance({ account: id, balance });
    } catch (e) {
      console.log("error", e);
    }
  });
}

async function ethermineBalance(address) {
  const response = await makeRequest({
    url: `https://api.ethermine.org/miner/${address}/dashboard`,
  });
  const { data } = response.data;

  if (data) {
    return processLongEthNumber(data.currentStatistics.unpaid);
  }
  return 0;
}

async function ezilBalance(address) {
  const response = await makeRequest({
    url: `https://billing.ezil.me/balances/${address}`,
  });
  const { eth, zil } = response.data;

  if (eth) {
    return eth;
  }
  return 0;
}

async function f2poolBalance(address) {
  const response = await makeRequest({
    url: `https://api.f2pool.com/eth/${address}`,
  });
  const { balance } = response.data;

  if (balance) {
    return balance;
  }
  return 0;
}

async function hiveonBalance(address) {
  if (address.indexOf("0x") == 0) {
    address = address.substr(2);
  }
  const response = await makeRequest({
    url: `https://hiveon.net/api/v1/stats/miner/${address}/ETH/billing-acc`,
  });
  const { totalUnpaid } = response.data;

  if (totalUnpaid) {
    return totalUnpaid;
  }
  return 0;
}

async function flexpoolBalance(address) {
  const response = await makeRequest({
    url: `https://flexpool.io/api/v1/miner/${address}/balance/`,
  });
  const { result } = response.data;

  if (result) {
    return processLongEthNumber(result);
  }
  return 0;
}

module.exports = { scrapeAccounts };
