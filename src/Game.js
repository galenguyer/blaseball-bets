import React from "react";

const Game = (props) => {
    const game = props.game;
    const maxBet = props.maxBet;
    const playedGames = props.playedGames;
    const homeIsFavored = game.awayOdds < game.homeOdds;
    const bestOdds = Math.round(Math.max(game.awayOdds, game.homeOdds) * 1000) / 10;

    let bet = 0;
    if (props.useSimple) {
        if (bestOdds >= 60) bet = Math.round(maxBet);
        else if (bestOdds >= 57) bet = Math.round(maxBet * 0.75);
        else if (bestOdds >= 55) bet = Math.round(maxBet * 0.5);
        else bet = Math.round(maxBet * 0.25);
    } else {
        const EVMax = (2 - 355 * 10 ** -6 * Math.pow(100 * (0.77 - 0.5), 2.045)) * 0.77 - 1;
        const EVMin = 0;
        const EVRange = EVMax - EVMin;

        const gameOddsEV = (2 - 355 * 10 ** -6 * Math.pow(100 * (bestOdds / 100 - 0.5), 2.045)) * (bestOdds / 100) - 1;
        bet = Math.floor(maxBet * (gameOddsEV / EVRange));
    }

    if (bet > maxBet) bet = maxBet;

    let matchingOddsCount = 0;
    let correctCount = 0;
    playedGames.forEach((playedGame) => {
        let gameOdds = Math.round(Math.max(playedGame.awayOdds, playedGame.homeOdds) * 1000) / 10;
        if (Math.abs(gameOdds - bestOdds) <= 1) {
            matchingOddsCount++;
            if (
                (playedGame.awayOdds > playedGame.homeOdds && playedGame.awayScore > playedGame.homeScore) ||
                (playedGame.homeOdds > playedGame.awayOdds && playedGame.homeScore > playedGame.awayScore)
            ) {
                correctCount++;
            }
        }
    });

    const confidence = Math.round((correctCount / matchingOddsCount) * 100);

    return (
        <div className="Game">
            <p>
                {game.awayTeamName} vs {game.homeTeamName}
                <br />
                {bestOdds}% in favor of <b>{homeIsFavored ? game.homeTeamName : game.awayTeamName}</b> ({confidence}%
                confidence)
                <br />
                Recommended bet: <b>{bet}</b>
            </p>
        </div>
    );
};

export default Game;
