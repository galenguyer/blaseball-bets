import React from "react";
import useSWR from "swr";
import logo from "./logo.svg";
import Game from "./Game";
import "./App.css";

const url = "https://blase.nyaa.gay/api/v1/latest/streamData";

const App = () => {
    const { data: latestStreamData, error: sdError } = useSWR(url);
    const { data: gameData, error: gError } = useSWR(
        () => "https://api.sibr.dev/chronicler/v1/games?season=" + latestStreamData.value.games.sim.season
    );

    const [maxBet, setMaxBet] = React.useState(100);
    const [useSimple, setUseSimple] = React.useState(true);

    React.useEffect(() => {
        if (maxBet > 1000) setMaxBet(1000);
        else if (maxBet < 0) setMaxBet(0);
    }, [maxBet]);

    if (sdError || gError)
        return (
            <div className="App">
                <h1>Wins per Win</h1>
                <h1>An error occurred</h1>
            </div>
        );
    if (!latestStreamData || !gameData)
        return (
            <div className="App">
                <h1>Wins per Win</h1>
                <h1>Loading latest data...</h1>
            </div>
        );

    let playedGames = [];
    gameData.data.map((game) => {
        if (game.endTime != null) playedGames.push(game.data);
    });

    const day = latestStreamData.value.games.sim.day + 2;
    const tomorrow = latestStreamData.value.games.tomorrowSchedule;

    tomorrow.sort(function (a, b) {
        return (
            Math.max(b.homeOdds - b.awayOdds, b.awayOdds - b.homeOdds) -
            Math.max(a.homeOdds - a.awayOdds, a.awayOdds - a.homeOdds)
        );
    });

    return (
        <div className="App">
            <h1>BlaseBets (Day {day})</h1>
            <label>Max Bet: </label>
            <input
                className="Input"
                type={"number"}
                value={maxBet}
                onChange={(event) => setMaxBet(event.target.value)}
            ></input>
            <label>Simple Betting: </label>
            <input
                className="Input"
                type="checkbox"
                checked={useSimple}
                onChange={(event) => setUseSimple(event.target.checked)}
            />
            {tomorrow.map((game) => (
                <Game game={game} maxBet={maxBet} useSimple={useSimple} playedGames={playedGames} />
            ))}
            <br />
            <div className="Comment" style={{ marginBottom: "1rem" }}>
                "confidence" is what percentage of the time a game with similar odds (within one percentage point) was
                won by the favored team
            </div>
            <div className="Comment" style={{ marginBottom: "1rem" }}>
                Created by MasterChief_John-117#1911 &nbsp;|&nbsp; Source available on{" "}
                <a href="https://github.com/galenguyer/blaseball-bets">github!</a>
            </div>
        </div>
    );
};

export default App;
