export function getTodayString(): string {
  const currenttime = new Date();
  const month = `${currenttime.getMonth()}`.padStart(2, "0");
  const date = `${currenttime.getDate()}`.padStart(2, "0");
  return `${currenttime.getFullYear()}-${month}-${date}`;
}
