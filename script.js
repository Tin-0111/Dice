let currentBet = {};
let selectedToken = 0;
let balance = 5000;
let hasBetOdd = false;
let hasBetEven = false;
let hasBetSmall = false;
let hasBetBig = false;

function updateBalanceDisplay() {
    document.getElementById('balance').innerText = balance;
}

function placeBet(bet) {
    if (selectedToken === 0) {
        alert('Please select a token amount first.');
        return;
    }
    if (selectedToken > balance) {
        alert('You do not have enough balance to place this bet.');
        return;
    }

    // Check for conflicting bets
    if ((bet === 'odd' && hasBetEven) || (bet === 'even' && hasBetOdd)) {
        alert('You cannot bet on both Odd and Even.');
        return;
    }
    if ((bet === 'small' && hasBetBig) || (bet === 'big' && hasBetSmall)) {
        alert('You cannot bet on both Small and Big.');
        return;
    }

    // Update bet flags
    if (bet === 'odd') hasBetOdd = true;
    if (bet === 'even') hasBetEven = true;
    if (bet === 'small') hasBetSmall = true;
    if (bet === 'big') hasBetBig = true;

    if (!currentBet[bet]) {
        currentBet[bet] = 0;
    }
    currentBet[bet] += selectedToken;
    balance -= selectedToken;
    updateBalanceDisplay();
    document.getElementById('bet-info').innerText = `You placed a bet of ${selectedToken} on ${bet}. Total on ${bet}: ${currentBet[bet]}`;
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
        } else if (bet === 'odd' || bet === 'even') {
            if (sum % 2 === 0 && bet === 'even') {
                resultMessage += `Bet on Even: You Win ${amount * 2}\n`;
                winnings += amount * 2;
            } else if (sum % 2 !== 0 && bet === 'odd') {
                resultMessage += `Bet on Odd: You Win ${amount * 2}\n`;
                winnings += amount * 2;
            } else {
                resultMessage += `Bet on ${bet}: You Lose ${amount}\n`;
            }
        } else if (bet.startsWith('double')) {
            const number = parseInt(bet.split('-')[1]);
            const count = diceResults.filter(die => die === number).length;
            if (count >= 2) {
                resultMessage += `Bet on Double ${number}: You Win ${amount * 10}\n`;
                winnings += amount * 10;
            } else {
                resultMessage += `Bet on Double ${number}: You Lose ${amount}\n`;
            }
        } else if (bet.startsWith('triple')) {
            const number = parseInt(bet.split('-')[1]);
            if (diceResults.every(die => die === number)) {
                resultMessage += `Bet on Triple ${number}: You Win ${amount * 180}\n`;
                winnings += amount * 180;
            } else {
                resultMessage += `Bet on Triple ${number}: You Lose ${amount}\n`;
            }
        } else if (bet === 'any-triple') {
            if (dice1 === dice2 && dice2 === dice3) {
                resultMessage += `Bet on Any Triple: You Win ${amount * 30}\n`;
                winnings += amount * 30;
            } else {
                resultMessage += `Bet on Any Triple: You Lose ${amount}\n`;
            }
        } else if (bet.startsWith('total')) {
            const total = parseInt(bet.split('-')[1]);
            const payouts = {
                4: 62, 5: 31, 6: 18, 7: 12, 8: 8, 9: 7, 10: 6,
                11: 6, 12: 7, 13: 8, 14: 12, 15: 18, 16: 31, 17: 62
            };
            if (sum === total) {
                resultMessage += `Bet on Total ${total}: You Win ${amount * payouts[total]}\n`;
                winnings += amount * payouts[total];
            } else {
                resultMessage += `Bet on Total ${total}: You Lose ${amount}\n`;
            }
        } else if (bet.startsWith('single')) {
            const number = parseInt(bet.split('-')[1]);
            const count = diceResults.filter(die => die === number).length;
            if (count > 0) {
                resultMessage += `Bet on Single ${number}: You Win ${amount * count}\n`;
                winnings += amount * (count + 1);
            } else {
                resultMessage += `Bet on Single ${number}: You Lose ${amount}\n`;
            }
        }
    }

    balance += winnings;
    updateBalanceDisplay();

    document.getElementById('result').innerText = resultMessage;
    currentBet = {};
    hasBetOdd = false;
    hasBetEven = false;
    hasBetSmall = false;
    hasBetBig = false;
    document.getElementById('roll-dice').disabled = true;
}
