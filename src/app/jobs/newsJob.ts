import cron from "node-cron";
import { newsDataService } from "../modules/newsData/newsData.service";

const initNewsJob = () => {
  cron.schedule("0 * * * *", async () => {
    // eslint-disable-next-line no-console
    console.log("Running hourly news update...");
    try {
      await newsDataService.fetchNews();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Hourly news update failed:", err);
    }
  });
};

export default initNewsJob;
