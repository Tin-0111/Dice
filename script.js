let funds = 10000;
let currentTokenValue = 0;
let bets = {};

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
            bets[betType] += currentTokenValue;
            funds -= currentTokenValue;
            updateFunds();
            updateBetSummary();
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
}

function rollDice() {
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
        if (checkWin(betType, total)) {
            const payout = betAmount * parseInt(document.querySelector(`.bet-btn[data-type="${betType}"]`).getAttribute('data-payout'));
            funds += payout;
            winSummary.innerHTML += `<p style="color: red;">${betType} 베팅 승리! +${payout} 토큰</p>`;
        } else {
            loseSummary.innerHTML += `<p style="color: blue;">${betType} 베팅 패배. -${betAmount} 토큰</p>`;
        }
    }

    resultSummary.appendChild(winSummary);
    resultSummary.appendChild(loseSummary);
    bets = {};
    updateFunds();
    updateBetSummary();
}

function checkWin(betType, total) {
    if (betType === 'small') {
        return total >= 4 && total <= 10;
    } else if (betType === 'big') {
        return total >= 11 && total <= 17;
    }
    // 추가적인 베팅 유형 확인 로직 구현
    return false;
}
