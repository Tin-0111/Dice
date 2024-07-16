let currentBet = null;

function placeBet(bet) {
    currentBet = bet;
    document.getElementById('bet-info').innerText = `You have placed a bet on ${bet}.`;
    document.getElementById('roll-dice').disabled = false;
}

function rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    const sum = dice1 + dice2 + dice3;
    const diceResults = [dice1, dice2, dice3];

    document.getElementById('dice-result').innerText = `Dice Results: ${dice1}, ${dice2}, ${dice3} (Sum: ${sum})`;

    let resultMessage = '';

    // Small or Big bet
    if (currentBet === 'small' || currentBet === 'big') {
        if (sum === 3 || sum === 18) {
            resultMessage = 'Dealer Wins with 3 or 18 - You Lose!';
        } else if (currentBet === 'small' && sum >= 4 && sum <= 10) {
            resultMessage = 'Result: Small (4-10) - You Win!';
        } else if (currentBet === 'big' && sum >= 11 && sum <= 17) {
            resultMessage = 'Result: Big (11-17) - You Win!';
        } else {
            resultMessage = 'You Lose!';
        }
    }

    // Double bet
    if (currentBet.startsWith('double')) {
        const number = parseInt(currentBet.split('-')[1]);
        const count = diceResults.filter(die => die === number).length;
        if (count >= 2) {
            resultMessage = `Result: Double ${number} - You Win!`;
        } else {
            resultMessage = 'You Lose!';
        }
    }

    // Triple bet
    if (currentBet.startsWith('triple')) {
        const number = parseInt(currentBet.split('-')[1]);
        const count = diceResults.filter(die => die === number).length;
        if (count === 3) {
            resultMessage = `Result: Triple ${number} - You Win!`;
        } else {
            resultMessage = 'You Lose!';
        }
    }

    // Any triple bet
    if (currentBet === 'any-triple') {
        const counts = {};
        diceResults.forEach(die => counts[die] = (counts[die] || 0) + 1);
        if (Object.values(counts).some(count => count === 3)) {
            resultMessage = 'Result: Any Triple - You Win!';
        } else {
            resultMessage = 'You Lose!';
        }
    }

    // Total bet
    if (currentBet.startsWith('total')) {
        const number = parseInt(currentBet.split('-')[1]);
        if (sum === number) {
            resultMessage = `Result: Total ${number} - You Win!`;
        } else {
            resultMessage = 'You Lose!';
        }
    }

    // Single bet
    if (currentBet.startsWith('single')) {
        const number = parseInt(currentBet.split('-')[1]);
        const count = diceResults.filter(die => die === number).length;
        if (count > 0) {
            resultMessage = `Result: Single ${number} appeared ${count} time(s) - You Win!`;
        } else {
            resultMessage = 'You Lose!';
        }
    }

    document.getElementById('result').innerText = resultMessage;
    document.getElementById('roll-dice').disabled = true;
    currentBet = null;
    document.getElementById('bet-info').innerText = 'Place your bet!';
}
