require("dotenv").config();

const schedule = require("node-schedule");
const { scrapeAccounts } = require("./utils/scrape");

const DEBUG = process.env.DEBUG == "true";

(async () => {
  if (DEBUG) {
    await scrapeAccounts();
  } else {
    schedule.scheduleJob(`0 */3 * * * *`, scrapeAccounts);
  }
})();
