let currentBet = {};
let selectedToken = 0;

function placeBet(bet) {
    if (selectedToken === 0) {
        alert('Please select a token amount first.');
        return;
    }
    if (!currentBet[bet]) {
        currentBet[bet] = 0;
    }
    currentBet[bet] += selectedToken;
    document.getElementById('bet-info').innerText = `You have placed ${selectedToken} on ${bet}. Total on ${bet}: ${currentBet[bet]}`;
    document.getElementById('roll-dice').disabled = false;
    selectedToken = 0;
}

function selectToken(amount) {
    selectedToken = amount;
    document.getElementById('bet-info').innerText = `Selected token amount: ${selectedToken}`;
}

function rollDice() {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    const sum = dice1 + dice2 + dice3;
    const diceResults = [dice1, dice2, dice3];

    document.getElementById('dice-result').innerText = `Dice Results: ${dice1}, ${dice2}, ${dice3} (Sum: ${sum})`;

    let resultMessage = '';
    let winnings = 0;

    // Evaluate all bets
    for (const bet in currentBet) {
        const amount = currentBet[bet];
        if (bet === 'small' || bet === 'big') {
            if (sum === 3 || sum === 18) {
                resultMessage += `Bet on ${bet}: Dealer Wins with 3 or 18 - You Lose ${amount}\n`;
            } else if (bet === 'small' && sum >= 4 && sum <= 10) {
                resultMessage += `Bet on Small (4-10): You Win ${amount * 2}\n`;
                winnings += amount * 2;
            } else if (bet === 'big' && sum >= 11 && sum <= 17) {
                resultMessage += `Bet on Big (11-17): You Win ${amount * 2}\n`;
                winnings += amount * 2;
            } else {
                resultMessage += `Bet on ${bet}: You Lose ${amount}\n`;
            }
        } else if (bet.startsWith('double')) {
            const number = parseInt(bet.split('-')[1]);
            const count = diceResults.filter(die => die === number).length;
            if (count >= 2) {
                resultMessage += `Bet on Double ${number}: You Win ${amount * 11}\n`;
                winnings += amount * 11;
            } else {
                resultMessage += `Bet on Double ${number}: You Lose ${amount}\n`;
            }
        } else if (bet.startsWith('triple')) {
            const number = parseInt(bet.split('-')[1]);
            const count = diceResults.filter(die => die === number).length;
            if (count === 3) {
                resultMessage += `Bet on Triple ${number}: You Win ${amount * 180}\n`;
                winnings += amount * 180;
            } else {
                resultMessage += `Bet on Triple ${number}: You Lose ${amount}\n`;
            }
        } else if (bet === 'any-triple') {
            const counts = {};
            diceResults.forEach(die => counts[die] = (counts[die] || 0) + 1);
            if (Object.values(counts).some(count => count === 3)) {
                resultMessage += `Bet on Any Triple: You Win ${amount * 30}\n`;
                winnings += amount * 30;
            } else {
                resultMessage += `Bet on Any Triple: You Lose ${amount}\n`;
            }
        } else if (bet.startsWith('total')) {
            const number = parseInt(bet.split('-')[1]);
            if (sum === number) {
                resultMessage += `Bet on Total ${number}: You Win ${amount * getTotalPayout(number)}\n`;
                winnings += amount * getTotalPayout(number);
            } else {
                resultMessage += `Bet on Total ${number}: You Lose ${amount}\n`;
            }
        } else if (bet.startsWith('single')) {
            const number = parseInt(bet.split('-')[1]);
            const count = diceResults.filter(die => die === number).length;
            if (count > 0) {
                resultMessage += `Bet on Single ${number}: Appeared ${count} time(s) - You Win ${amount * (count + 1)}\n`;
                winnings += amount * (count + 1);
            } else {
                resultMessage += `Bet on Single ${number}: You Lose ${amount}\n`;
            }
        }
    }

    document.getElementById('result').innerText = resultMessage + `\nTotal Winnings: ${winnings}`;
    document.getElementById('roll-dice').disabled = true;
    currentBet = {};
    document.getElementById('bet-info').innerText = 'Place your bet and select a token amount!';
}

function getTotalPayout(total) {
    const payouts = {
        4: 62, 5: 31, 6: 18, 7: 12, 8: 8, 9: 7,
        10: 6, 11: 6, 12: 7, 13: 8, 14: 12, 15: 18,
        16: 31, 17: 62
    };
    return payouts[total] || 1;
}
