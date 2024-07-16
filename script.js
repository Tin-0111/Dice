let funds = 10000;
let currentTokenValue = 0;
let bets = {};
let totalBetAmount = 0;

document.querySelectorAll('.token-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentTokenValue = parseInt(btn.getAttribute('data-value'));
    });
});

document.querySelectorAll('.bet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentTokenValue > 0) {
            const betType = btn.getAttribute('data-type');
            const payout = parseInt(btn.getAttribute('data-payout'));
            if (!bets[betType]) {
                bets[betType] = 0;
            }
            if (funds >= currentTokenValue) {
                bets[betType] += currentTokenValue;
                totalBetAmount += currentTokenValue;
                funds -= currentTokenValue;
                updateFunds();
                updateBetSummary();
            } else {
                alert("보유 자금이 부족합니다.");
            }
        } else {
            alert("토큰을 먼저 선택하세요.");
        }
    });
});

document.getElementById('roll-dice-btn').addEventListener('click', rollDice);

function updateFunds() {
    document.getElementById('funds').textContent = funds;
}

function updateBetSummary() {
    const betSummary = document.getElementById('bet-summary');
    betSummary.innerHTML = '<h3>현재 베팅:</h3>';
    for (const betType in bets) {
        betSummary.innerHTML += `<p>${betType}: ${bets[betType]} 토큰</p>`;
    }
    document.getElementById('current-bet-amount').textContent = totalBetAmount;
}

function rollDice() {
    if (totalBetAmount === 0) {
        alert("베팅을 먼저 하세요.");
        return;
    }
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2 + dice3;
    const resultSummary = document.getElementById('result-summary');
    resultSummary.innerHTML = `<h3>주사위 결과: ${dice1}, ${dice2}, ${dice3} (총합: ${total})</h3>`;
    const winSummary = document.createElement('div');
    const loseSummary = document.createElement('div');

    for (const betType in bets) {
        const betAmount = bets[betType];
        if (checkWin(betType, total, dice1, dice2, dice3)) {
            const payout = calculatePayout(betType, betAmount, dice1, dice2, dice3);
            funds += payout + betAmount;
            winSummary.innerHTML += `<p class="red-text">${betType} 베팅 승리! +${payout + betAmount} 토큰</p>`;
        } else {
            loseSummary.innerHTML += `<p style="color: blue;">${betType} 베팅 패배. -${betAmount} 토큰</p>`;
        }
    }

    resultSummary.appendChild(winSummary);
    resultSummary.appendChild(loseSummary);
    bets = {};
    totalBetAmount = 0;
    updateFunds();
    updateBetSummary();
    highlightWinningBets();
}

function checkWin(betType, total, dice1, dice2, dice3) {
    if (betType === 'small') {
        return total >= 4 && total <= 10 && !isTriple(dice1, dice2, dice3);
    } else if (betType === 'big') {
        return total >= 11 && total <= 17 && !isTriple(dice1, dice2, dice3);
    } else if (betType === 'triple-any') {
        return isTriple(dice1, dice2, dice3);
    } else if (betType.startsWith('triple-')) {
        const number = parseInt(betType.split('-')[1]);
        return dice1 === number && dice2 === number && dice3 === number;
    } else if (betType.startsWith('double-')) {
        const number = parseInt(betType.split('-')[1]);
        return (dice1 === number && dice2 === number) || (dice1 === number && dice3 === number) || (dice2 === number && dice3 === number);
    } else if (!isNaN(parseInt(betType))) {
        return total === parseInt(betType);
    } else if (betType.startsWith('one-')) {
        const number = parseInt(betType.split('-')[1]);
        return [dice1, dice2, dice3].filter(dice => dice === number).length > 0;
    } else if (betType.startsWith('pair-')) {
        const [num1, num2] = betType.split('-')[1].split('-').map(n => parseInt(n));
        return ([dice1, dice2, dice3].includes(num1) && [dice1, dice2, dice3].includes(num2));
    } else if (betType === 'odd') {
        return total % 2 !== 0;
    } else if (betType === 'even') {
        return total % 2 === 0;
    }
    return false;
}

function isTriple(dice1, dice2, dice3) {
    return dice1 === dice2 && dice2 === dice3;
}

function calculatePayout(betType, betAmount, dice1, dice2, dice3) {
    if (betType.startsWith('one-')) {
        const number = parseInt(betType.split('-')[1]);
        const count = [dice1, dice2, dice3].filter(dice => dice === number).length;
        if (count === 1) return betAmount;
        if (count === 2) return betAmount * 3;
        if (count === 3) return betAmount * 5;
    } else {
        return betAmount * parseInt(document.querySelector(`.bet-btn[data-type="${betType}"]`).getAttribute('data-payout'));
    }
}

function highlightWinningBets() {
    const winningBets = document.querySelectorAll('.red-text');
    winningBets.forEach(bet => {
        const betType = bet.textContent.split(' ')[0];
        const button = document.querySelector(`.bet-btn[data-type="${betType}"]`);
        if (button) {
            button.style.backgroundColor = 'red';
        }
    });
    setTimeout(() => {
        document.querySelectorAll('.bet-btn').forEach(button => {
            button.style.backgroundColor = '#27ae60';
        });
    }, 2000);
}
