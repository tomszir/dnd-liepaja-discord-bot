const logger = require('@/logger');

class Random {
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static fromDiceString(string) {
    const [times, amount] = string.split('d');

    logger.debug('Time & Amount: ', { times, amount });

    if (!times && !amount) {
      return Random.randomInt(1, 20);
    }

    if (!times) {
      return Random.randomInt(1, parseInt(amount));
    }

    if (!amount) {
      return [...Array(parseInt(times)).keys()].map(() => Random.randomInt(1, 20));
    }

    return [...Array(parseInt(times)).keys()].map(() => Random.randomInt(1, parseInt(amount)));
  }
}

module.exports = Random;
