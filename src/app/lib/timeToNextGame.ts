//Returns a message telling how much time until the next game will be available
//This appears on the button at the bottom once game ends
export function timeToNextGame() {
  let date = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  let easternTime = new Date(date).getTime();
  let easternMidnight = new Date(date).setHours(24, 0, 0, 0);
  let timeToNextGame = Math.ceil(
    (easternMidnight - easternTime) / (1000 * 60 * 60)
  );
  let message;
  if (timeToNextGame <= 1) {
    message = `New Puzzle Soon`;
  } else {
    message = `New Puzzle in ${timeToNextGame} Hours`;
  }
  return message;
}
