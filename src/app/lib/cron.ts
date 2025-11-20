import cron from "node-cron";
import { scramble } from "./scramble";
import { randomString } from "./randomString";
import { connectToDatabase } from "./mongodb";

export default function startCronJobs() {
  if (process.env.NODE_ENV === "production") {
    const updateGames = cron.schedule(
      `0 0 * * *`,
      //"*/5 * * * *",
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
            const scores = todaysGame.scores ? todaysGame.scores : [];
            let scoresTotal = 0;
            let oneCount = 0;
            scores.forEach((score: number) => {
              // We do these to filter out illegitimate perfect scores, and use the mathematical average instead
              if (score === 1) {
                oneCount++;
              } else {
                scoresTotal += score;
              }
            });
            let legitGames = scores.length - oneCount;
            const legitGamesTotal =
              // This should end up being legitGames / .99... representing the 1 / 100... chance of getting guessing correctly
              Math.floor(
                legitGames / ((Math.pow(10, i) - 1) / Math.pow(10, i))
              );
            // Adding 1 for each game that should have a score of 1
            scoresTotal += legitGamesTotal - legitGames;
            if (legitGamesTotal === 0) legitGames++;
            const average = (scoresTotal / legitGamesTotal).toFixed(3);

            await oldGames.insertOne({
              average: average,
              gamesPlayed: legitGamesTotal,
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
                  scores: [],
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
    const calculateStats = cron.schedule(`0 5 * * *`, async () => {
      //const calculateStats = cron.schedule(`*/5 * * * *`, async () => {
      const db = await connectToDatabase("analytics");
      const game_stats = db.collection(`game_stats`);
      const current_metrics = db.collection(`current_metrics`);
      try {
        const averages: { [key: string]: number | string } = {
          average2: 0,
          average3: 0,
          average4: 0,
          average5: 0,
          average6: 0,
          average7: 0,
        };
        const totalGamesPlayed: { [key: string]: number | string } = {
          digits2: 0,
          digits3: 0,
          digits4: 0,
          digits5: 0,
          digits6: 0,
          digits7: 0,
        };
        for (let i = 2; i <= 7; i++) {
          try {
            // Gets todays scores and resets its scores
            const record = await game_stats.findOneAndUpdate(
              { digits: i },
              { $set: { scores: [] } },
              { returnDocument: "before" }
            );
            if (record && record.scores) {
              let gamesTotal = record.gamesTotal ? record.gamesTotal : 0;
              let scoresTotal = record.scoresTotal ? record.scoresTotal : 0;
              let oneCount = 0;
              const scores = record.scores;
              scores.forEach((score: number) => {
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
              totalGamesPlayed[`digits${i}`] = legitGamesTotal;
              if (!gamesTotal) continue; //Stops us from dividing by zero
              averages[`average${i}`] = (scoresTotal / gamesTotal).toFixed(3);
              // Update the totals in the "averages" record
              await game_stats.updateOne(
                { digits: i },
                { $set: { gamesTotal: gamesTotal, scoresTotal: scoresTotal } }
              );
            }
          } catch {}
        }
        await game_stats.updateOne(
          { name: "averages" },
          {
            $set: {
              averages2: averages.average2,
              averages3: averages.average3,
              averages4: averages.average4,
              averages5: averages.average5,
              averages6: averages.average6,
              averages7: averages.average7,
            },
          },
          { upsert: true }
        );
        await current_metrics.updateOne(
          { name: "weekly_games_played" },
          {
            $inc: {
              digits2: Number(totalGamesPlayed.digits2),
              digits3: Number(totalGamesPlayed.digits3),
              digits4: Number(totalGamesPlayed.digits4),
              digits5: Number(totalGamesPlayed.digits5),
              digits6: Number(totalGamesPlayed.digits6),
              digits7: Number(totalGamesPlayed.digits7),
            },
          },
          { upsert: true }
        );
      } catch {}
    });
    calculateStats.start();

    // Tabulates the past days user visits
    const updateDailyAnalytics = cron.schedule(
      `0 6 * * *`,
      //`*/5 * * * *`,
      async () => {
        const db = await connectToDatabase("analytics");
        const current_metrics = db.collection("current_metrics");
        const daily_metrics = db.collection("daily_metrics");
        const today = new Date(
          new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
          })
        );
        today.setDate(today.getDate() - 1);
        const dateString = `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        // Retrieve today's metrics and resets them
        const todaysMetrics = await current_metrics.findOneAndUpdate(
          { name: "daily_visitors" },
          {
            $set: {
              daily_visitors: 0,
              new_visitors: 0,
            },
          },
          { returnDocument: "before" }
        );
        // Creates a new entry for today's data, tabulates them into the weekly metrics
        if (todaysMetrics) {
          await daily_metrics.insertOne({
            date: dateString,
            daily_visitors: todaysMetrics.daily_visitors || 0,
            new_visitors: todaysMetrics.new_visitors || 0,
          });
          await current_metrics.updateOne(
            { name: "weekly_visitors" },
            {
              $inc: {
                weekly_visitors: todaysMetrics.daily_visitors || 0,
                new_visitors: todaysMetrics.new_visitors || 0,
              },
            },
            { upsert: true }
          );
        }
      },
      {
        timezone: "America/New_York",
      }
    );
    updateDailyAnalytics.start();

    // Tabulates the past weeks user visits
    const updateWeeklyAnalytics = cron.schedule(
      `0 7 * * 1`,
      //`*/12 * * * *`,
      async () => {
        const db = await connectToDatabase("analytics");
        const current_metrics = db.collection("current_metrics");
        const weekly_metrics = db.collection("weekly_metrics");
        const weekly_games = db.collection("weekly_games");
        const today = new Date(
          new Date().toLocaleString("en-US", {
            timeZone: "America/New_York",
          })
        );
        const date = new Date(today);
        date.setDate(date.getDate() - 7);
        const dateString = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        // Retrieves this week's metrics and resets them
        const weeklyMetrics = await current_metrics.findOneAndUpdate(
          { name: "weekly_visitors" },
          {
            $set: {
              weekly_visitors: 0,
              new_visitors: 0,
            },
          },
          { returnDocument: "before" }
        );
        // Creates a new entry for this weeks's data, tabulates them into totals
        if (weeklyMetrics) {
          await weekly_metrics.insertOne({
            weekOf: dateString,
            weekly_visitors: weeklyMetrics.weekly_visitors || 0,
            new_visitors: weeklyMetrics.new_visitors || 0,
          });

          // Add to overall totals
          await current_metrics.updateOne(
            { name: "total_visitors" },
            {
              $inc: {
                total_visitors: weeklyMetrics.weekly_visitors || 0,
                total_new_visitors: weeklyMetrics.new_visitors || 0,
              },
            },
            { upsert: true }
          );
        }
        // Retrieves this week's games and resets them
        const weeklyGames = await current_metrics.findOneAndUpdate(
          { name: "weekly_games_played" },
          {
            $set: {
              digits2: 0,
              digits3: 0,
              digits4: 0,
              digits5: 0,
              digits6: 0,
              digits7: 0,
            },
          },
          { returnDocument: "before" }
        );
        // Creates a new entry for this weeks's game data, tabulates them into totals
        if (weeklyGames) {
          const totalWeeklyGames =
            (weeklyGames.digits2 || 0) +
            (weeklyGames.digits3 || 0) +
            (weeklyGames.digits4 || 0) +
            (weeklyGames.digits5 || 0) +
            (weeklyGames.digits6 || 0) +
            (weeklyGames.digits7 || 0);

          await weekly_games.insertOne({
            weekOf: dateString,
            digits2: weeklyGames.digits2 || 0,
            digits3: weeklyGames.digits3 || 0,
            digits4: weeklyGames.digits4 || 0,
            digits5: weeklyGames.digits5 || 0,
            digits6: weeklyGames.digits6 || 0,
            digits7: weeklyGames.digits7 || 0,
            total_game: totalWeeklyGames,
          });

          // Add to overall totals
          await current_metrics.updateOne(
            { name: "total_games_played" },
            {
              $inc: {
                digits2: weeklyGames.digits2 || 0,
                digits3: weeklyGames.digits3 || 0,
                digits4: weeklyGames.digits4 || 0,
                digits5: weeklyGames.digits5 || 0,
                digits6: weeklyGames.digits6 || 0,
                digits7: weeklyGames.digits7 || 0,
                total_games: totalWeeklyGames,
              },
            },
            { upsert: true }
          );
        }
      },
      {
        timezone: "America/New_York",
      }
    );
    updateWeeklyAnalytics.start();

    // Reset daily email counter
    const resetEmailCounter = cron.schedule(`0 5 * * *`, async () => {
      const db = await connectToDatabase("analytics");
      const current_metrics = db.collection("current_metrics");
      await current_metrics.updateOne(
        { name: "emails_sent" },
        { $set: { emails_sent: 0 } }
      );
    });
    resetEmailCounter.start();

    // Sets all inactive accounts to "status: inactive" every day if they've been inactive for 48 hours
    // We could implement this system later if we wanted
    const manageInactiveAccounts = cron.schedule(
      `0 6 * * *`,
      async () => {
        console.log("Running inactive accounts cleanup...");
        const db = await connectToDatabase("accounts");
        let accounts = db.collection(`accounts`);
        const currentDate = new Date();
        const twoDaysAgo = new Date(
          currentDate.getTime() - 48 * 60 * 60 * 1000
        );
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
    //manageInactiveAccounts.start();
  }
}
