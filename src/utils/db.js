require("dotenv").config();

const knex = require("knex")({
  client: "mysql",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});

async function logBalance({ account, balance }) {
  const toLog = {
    account,
    balance,
  };

  return await knex("balances").insert(toLog);
}

async function getAccounts() {
  try {
    const result = await knex.where({ active: 1 }).select().table("accounts");
    return result.reduce((acc, { id, user, address, pool, active }) => {
      acc.push({
        id,
        user,
        address,
        pool,
        active,
      });
      return acc;
    }, []);
  } catch (e) {
    console.log("getAccounts error", e);
  }
  return [];
}

module.exports = { logBalance, getAccounts };
