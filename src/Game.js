import React from "react";

const Game = (props) => {
    const game = props.game;
    const maxBet = props.maxBet;
    const homeIsFavored = game.awayOdds < game.homeOdds;
    const bestOdds = Math.round(Math.max(game.awayOdds, game.homeOdds) * 1000) / 10;

    const EVMax = (2 - 355 * 10 ** -6 * Math.pow(100 * (0.77 - 0.5), 2.045)) * 0.77 - 1;
    const EVMin = 0;
    const EVRange = EVMax - EVMin;

    const gameOddsEV = (2 - 355 * 10 ** -6 * Math.pow(100 * (bestOdds / 100 - 0.5), 2.045)) * (bestOdds / 100) - 1;
    const bet = Math.floor(maxBet * (gameOddsEV / EVRange));
    if (bet > maxBet) bet = maxBet;

    return (
        <div className="Game">
            {game.awayTeamName} vs {game.homeTeamName} ({bestOdds}% in favor of{" "}
            {homeIsFavored ? game.homeTeamName : game.awayTeamName}) [{bet}]
        </div>
    );
};

export default Game;
