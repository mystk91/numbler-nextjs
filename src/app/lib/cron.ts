import cron from "node-cron";
import { scramble } from "./scramble";
import { randomString } from "./randomString";
import { connectToDatabase } from "./mongodb";

//if (process.env.NODE_ENV === 'production') {
if (process.env.NODE_ENV === "development") {
  const updateGames = cron.schedule(
    `0 0 * * *`,
    //"*/2 * * * *",
    async () => {
      const db = await connectToDatabase(`daily_games`);
      let dailyGames = db.collection(`daily_games`);
      let date = new Date().toLocaleString("en-US", {
        timeZone: "America/New_York",
      });
      for (let i = 2; i <= 7; i++) {
        let unscrambled = Math.floor(
          Math.random() * Math.pow(10, i)
        ).toString();
        while (unscrambled.length < i) {
          unscrambled = "0" + unscrambled;
        }
        let todaysGame = await dailyGames.findOne({ digits: i });
        let oldGames = db.collection(`old_games_` + i);
        // Checks to see we already have games in the DB
        if (todaysGame) {
          await oldGames.insertOne({
            digits: todaysGame.digits,
            unscrambled: todaysGame.unscrambled,
            correctNumber: todaysGame.correctNumber,
            gameId: todaysGame.gameId,
            date: date,
          });

          let oldGameIdNumber = todaysGame.gameId.slice(
            todaysGame.gameId.length - 5,
            todaysGame.gameId.length
          );
          let newGameIdNumber = String(Number(oldGameIdNumber) + 1);
          while (newGameIdNumber.length < 5) {
            newGameIdNumber = "0" + newGameIdNumber;
          }
          let newGameId = i + randomString(6) + newGameIdNumber;
          await dailyGames.updateOne(
            { digits: i },
            {
              $set: {
                digits: i,
                correctNumber: scramble(unscrambled),
                unscrambled: unscrambled,
                gameId: newGameId,
                date: date,
              },
            }
          );
        } else {
          // Creates the initial game if we don't have any games at all in the DB
          await dailyGames.insertOne({
            digits: i,
            unscrambled: unscrambled,
            correctNumber: scramble(unscrambled),
            gameId: i + randomString(6) + `00001`,
            date: date,
          });
        }
      }
    },
    {
      timezone: "America/New_York",
    }
  );
  updateGames.start();

  // Sets all inactive accounts to "status: inactive" every day if they've been inactive for 48 hours
  const manageInactiveAccounts = cron.schedule(
    `0 3 * * *`,
    async () => {
      console.log("Running inactive accounts cleanup...");
      const db = await connectToDatabase("accounts");
      let accounts = db.collection(`accounts`);
      const currentDate = new Date();
      const twoDaysAgo = new Date(currentDate.getTime() - 48 * 60 * 60 * 1000);
      const result = await accounts.updateMany(
        {
          status: "active",
          $or: [
            { lastActiveAt: { $lt: twoDaysAgo } },
            { lastActiveAt: { $exists: false } },
          ],
        },
        {
          $set: {
            status: "inactive",
          },
        }
      );
      console.log(
        `Marked ${result.modifiedCount} accounts as inactive at ${currentDate}`
      );
    },
    {
      timezone: "America/New_York",
    }
  );

  manageInactiveAccounts.start();
}
