import "@babel/polyfill";
import { db } from "./credentials/mongodb-connect";
import User from "./model/User";

import { getBasicProfileData } from "./utilities/getBasicProfileData";
import dotenv from "dotenv";
import { openBrowser } from "./utilities/openBrowser";
import { loginInstagram } from "./utilities/loginAction";
dotenv.config();

db.once("open", async () => {
  const main = async () => {
    const { page, browser } = await openBrowser();
    await loginInstagram(page);
    while (true) {
      const userToCrawl = await User.findOne({
        $and: [
          { isPrivate: { $exists: false } },
          { isError: { $exists: false } },
        ],
      }).lean();
      const basicProfileData = await getBasicProfileData(
        userToCrawl.username,
        page
      );
      const profileDataKeys = Object.keys(basicProfileData);
      for (let i = 0; i < profileDataKeys.length; i++) {
        userToCrawl[profileDataKeys[i]] = basicProfileData[profileDataKeys[i]];
      }
      await User.updateOne({ _id: userToCrawl._id }, userToCrawl);
      await page.waitFor(10000);
    }
  };
  await main();
  db.close();
  process.exit();
});
