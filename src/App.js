import React from "react";
import useSWR from "swr";
import logo from "./logo.svg";
import Game from "./Game";
import "./App.css";

const url = "https://blase.nyaa.gay/api/v1/latest/streamData";

function App() {
    const { data: result, error } = useSWR(url);

    if (error)
        return (
            <div className="App">
                <h1>BlaseBets</h1>
                <h1>An error occurred</h1>
            </div>
        );
    if (!result)
        return (
            <div className="App">
                <h1>BlaseBets</h1>
                <h1>Loading latest data...</h1>
            </div>
        );

    const day = result.value.games.sim.day + 2;
    const tomorrow = result.value.games.tomorrowSchedule;
    const maxBet = 100;

    return (
        <div className="App">
            <h1>BlaseBets (Day {day})</h1>
            {tomorrow.map((game) => (
                <Game game={game} maxBet={maxBet} />
            ))}
            <br />
            <div className="Comment" style={{ marginBottom: "1rem" }}>
                Created by MasterChief_John-117#1911 &nbsp;|&nbsp; Source available on{" "}
                <a href="https://github.com/galenguyer/blaseball-bets">github!</a>
            </div>
        </div>
    );
}

export default App;
