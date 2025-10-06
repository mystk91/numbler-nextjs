import cron from "node-cron";
import { scramble } from "./scramble";
import { randomString } from "./randomString";
import { connectToDatabase } from "./mongodb";

//if (process.env.NODE_ENV === 'production') {
if (process.env.NODE_ENV === "development") {
  const updateGames = cron.schedule(
    //`0 0 * * *`,
    "*/2 * * * *",
    async () => {
      const db = await connectToDatabase(`daily_games`);
      let dailyGames = db.collection(`daily_games`);
      console.log(`running at` + new Date());
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

  // Calculates the stats of averages of daily games once a day
  const calculateStats = cron.schedule(`0 6 * * *`, async () => {
    const db = await connectToDatabase("analytics");
    const game_stats = db.collection(`game_stats`);
    try {
      const averages: { [key: string]: number | string } = {
        average2: 0,
        average3: 0,
        average4: 0,
        average5: 0,
        average6: 0,
        average7: 0,
      };
      for (let i = 2; i <= 7; i++) {
        try {
          const record = await game_stats.findOne({ digits: i });
          if (record && record.scores) {
            const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
            let gamesTotal = record.gamesTotal ? record.gamesTotal : 0;
            let scoresTotal = record.scoresTotal ? record.scoresTotal : 0;
            let oneCount = 0;
            const scores = record.scores;
            scores.forEach((entry: any) => {
              const score = entry.score;
              // We do these to filter out illegitimate perfect scores, and use the mathematical average instead
              if (score === 1) {
                oneCount++;
              } else {
                scoresTotal += score;
              }
            });
            const legitGames = scores.length - oneCount;
            const legitGamesTotal =
              // This should end up being legitGames / .99... representing the 1 / 100... chance of getting guessing correctly
              Math.floor(
                legitGames / ((Math.pow(10, i) - 1) / Math.pow(10, i))
              );
            // Adding 1 for each game that should have a score of 1
            scoresTotal += legitGamesTotal - legitGames;
            gamesTotal += legitGamesTotal;
            if (!gamesTotal) continue; //Stops us from dividing by zero
            averages[`average${i}`] = (scoresTotal / gamesTotal).toFixed(3);
            // Update the totals in the "averages" record
            await game_stats.updateOne(
              { digits: i },
              { $set: { gamesTotal: gamesTotal, scoresTotal: scoresTotal } }
            );
            // Remove old scores from the "averages" record
            await game_stats.updateOne({ digits: i }, {
              $pull: {
                scores: {
                  createdAt: { $lt: date },
                },
              },
            } as any);
          }
        } catch {}
      }
      const result = await game_stats.findOneAndUpdate(
        { _name: "averages" },
        {
          $set: {
            averages2: averages.average2,
            averages3: averages.average3,
            averages4: averages.average4,
            averages5: averages.average5,
            averages6: averages.average6,
            averages7: averages.average7,
          },
        }
      );
      if (result && result.matchedCount === 0) {
        await game_stats.insertOne({
          _name: "averages",
          averages2: averages.average2,
          averages3: averages.average3,
          averages4: averages.average4,
          averages5: averages.average5,
          averages6: averages.average6,
          averages7: averages.average7,
        });
      }
    } catch {}
  });
  calculateStats.start();

  // Sets all inactive accounts to "status: inactive" every day if they've been inactive for 48 hours
  // We could implement this system later if we wanted
  const manageInactiveAccounts = cron.schedule(
    `0 6 * * *`,
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
