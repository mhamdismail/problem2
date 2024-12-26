const fs = require("fs");
const csv = require("csv-parser");

class BossPrediction {
  constructor(csvFile) {
    this.data = [];
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on("data", (row) => this.data.push(row))
      .on("end", () => {
        console.log("CSV file successfully processed");
      });
  }

  calculateProbability(characteristic, value) {
    const filteredData = this.data.filter(
      (row) => row[characteristic] === value
    );
    if (filteredData.length === 0) {
      return 0.5;
    }
    const meanResult =
      filteredData.reduce((sum, row) => sum + parseFloat(row["result"]), 0) /
      filteredData.length;
    return meanResult;
  }

  probabilityToBeatBoss(suit, animal, fruit) {
    const pSuit = this.calculateProbability("suit", suit);
    const pAnimal = this.calculateProbability("animal", animal);
    const pFruit = this.calculateProbability("fruit", fruit);

    const combinedProbability = pSuit * pAnimal * pFruit;

    return combinedProbability * 100;
  }
}

const predictor = new BossPrediction("s.csv");
setTimeout(() => {
  const result = predictor.probabilityToBeatBoss("Hearts", "Lion", "Mango");
  console.log(`Probability to beat the boss: ${result.toFixed(2)}%`);
}, 2000);
