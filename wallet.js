/* eslint-disable @typescript-eslint/no-var-requires */
const lodash = require("lodash");
const fs = require("fs");

function lineToTransaction(line) {
  if (!line) {
    return null;
  }

  const [id, note, amount, category, wallet, currency, date] = line.split(";");

  return {
    id,
    amount: parseInt(amount),
    note: note || "",
    category,
    wallet,
    currency,
    date,
  };
}

const path =
  "/Users/apple/Documents/FILE_20211219_110542_MoneyLover-2021-12-19.csv";
const content = fs.readFileSync(path).toString();
const transactions = content
  .split("\n")
  .map(lineToTransaction)
  .filter((item) => !!item);

const txGroup = lodash.groupBy(transactions, (item) => {
  const [date, month, year] = item.date.split("/");
  return `${year}-${month}-${date}`;
});

fs.writeFileSync(__dirname + "/transactions.json", JSON.stringify(txGroup));
