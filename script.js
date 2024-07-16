body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    text-align: center;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 800px;
}

button {
    padding: 10px 20px;
    margin: 5px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}

.bet-buttons, .token-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.bet-buttons button, .token-buttons button {
    flex: 1 1 calc(33.333% - 10px);
    margin: 5px;
}

h2 {
    margin-top: 20px;
}

.red {
    color: red;
}

.balance {
    margin-bottom: 20px;
}

@media (max-width: 600px) {
    .bet-buttons button, .token-buttons button {
        flex: 1 1 calc(50% - 10px);
    }
}
