import React, { useState, useEffect } from "react";
import Pokemon from "./components/Pokemon";
import UsersPokemon from "./components/UsersPokemon";
import "./App.css";

function App() {
  const [locations, setLocations] = useState({});
  const [location, setLocation] = useState(null);
  const [pokemon, setPokemon] = useState({});
  const [pokemons, setPokemons] = useState([]);
  const [pressed, setPressed] = useState(false);
  const [playerPoke, setPlayerPoke] = useState({});
  const [turn, setTurn] = useState(false);
  const [userPokemons, setUserPokemons] = useState([
    "https://pokeapi.co/api/v2/pokemon/blissey",
    "https://pokeapi.co/api/v2/pokemon/regidrago",
    "https://pokeapi.co/api/v2/pokemon/guzzlord",
  ]);
  const [over, setOver] = useState(false);
  const [collect, setCollect] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(true);

  useEffect(() => {
    const getLocations = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/location");
      const res = await response.json();
      setLocations(res);
    };
    getLocations();
  }, []);
  console.log(pokemon);
  console.log(playerPoke);

  const getB = () => {
    let num = Math.floor(Math.random() * 2) + 1;
    if (num === 2) {
      num++;
    }
    return num;
  };

  const getD = () => {
    let num = Math.floor(Math.random() * 3) + 2;
    if (num === 3) {
      num++;
    }
    return num;
  };

  const returnHome = () => {
    setPressed(false);
    setLocation(false);
    setOver(false);
    setCollect(false);
    setFetchSuccess(true);
  };

  const battle = () => {
    setTurn(!turn);
    if (turn) {
      setPokemon((player) => {
        const copy = JSON.parse(JSON.stringify(player));
        const B = player.stats[getB()].base_stat;
        const D = player.stats[getD()].base_stat;
        const Z = Math.floor(Math.random() * (255 - 217 + 1)) + 217;
        if (
          copy.stats[0].base_stat >=
          ((((2 / 5 + 2) * B * 60) / D / 50 + 2) * Z) / 255
        ) {
          copy.stats[0].base_stat -=
            ((((2 / 5 + 2) * B * 60) / D / 50 + 2) * Z) / 255;
        } else {
          copy.stats[0].base_stat = 0;
          setCollect(true);
          setOver(true);
        }
        return copy;
      });
    } else {
      setPlayerPoke((player) => {
        const copy = JSON.parse(JSON.stringify(player));
        const B = player.stats[getB()].base_stat;
        const D = player.stats[getD()].base_stat;
        const Z = Math.floor(Math.random() * (255 - 217 + 1)) + 217;
        if (
          copy.stats[0].base_stat >=
          ((((2 / 5 + 2) * B * 60) / D / 50 + 2) * Z) / 255
        ) {
          copy.stats[0].base_stat -=
            ((((2 / 5 + 2) * B * 60) / D / 50 + 2) * Z) / 255;
        } else {
          copy.stats[0].base_stat = 0;
          setCollect(false);
          setOver(true);
        }
        return copy;
      });
    }
  };

  return (
    <div className="App">
      {!location ? (
        locations.results &&
        locations.results.map((location, index) => (
          <div key={index}>
            <button
              onClick={() => setLocation(location)}
              type="button"
              className="nes-btn is-success nes-pointer"
              id="location-btn"
            >
              {location.name.split("-").join(" ")}
            </button>
          </div>
        ))
      ) : fetchSuccess ? (
        <>
          <Pokemon
            location={location}
            getPokemon={setPokemon}
            pokemon={pokemon}
            collect={collect}
            setUserPokemons={setUserPokemons}
            userPokemons={userPokemons}
            setFetchSuccess={setFetchSuccess}
          />
          {pressed ? (
            over ? (
              !turn ? (
                <div id="bg-white">
                  <div className="nes-container with-title is-centered">
                    <p className="title">DUEL ENDED</p>
                    <p>You have won the fight and now the pokémon is yours! </p>
                    <span className="nes-text is-success">CONGRATULATIONS!</span>
                  </div>
                </div>
              ) : (
                <div id="bg-white">
                  <div className="nes-container with-title is-centered">
                    <p className="title">DUEL ENDED</p>
                    <span className="nes-text is-error">YOU'VE LOST!</span>
                    <p>Go to other locations to improve your pokémon collection!</p>
                  </div>
                </div>
              )
            ) : (
              <div id="bg-white">
                <div className="nes-container with-title is-centered">
                  <p className="title">DUEL BEGINS</p>
                  <p>
                    We've gathered here today to witness this legendary duel!
                  </p>
                  <p>MAY THE MIGHTIEST PLAYER WIN!</p>
                </div>
              </div>
            )
          ) : (
            <div id="bg-white">
              <div className="nes-container with-title is-centered">
                <p className="title">INCOMING CHALLENGE</p>
                <p>CHOOSE YOUR POKEMON FOR THE DUEL!</p>
              </div>
            </div>
          )}
          <UsersPokemon
            pokemons={pokemons}
            setPokemons={setPokemons}
            pressed={pressed}
            setPressed={setPressed}
            playerPoke={playerPoke}
            setPlayerPoke={setPlayerPoke}
            userPokemons={userPokemons}
          />
          {pressed && !over ? (
            !turn ? (
              <button
                onClick={() => battle()}
                type="button"
                id="fight-button"
                className="nes-btn is-success"
              >
                Defense
              </button>
            ) : (
              <button
                onClick={() => battle()}
                id="fight-button"
                type="button"
                className="nes-btn is-error"
              >
                Attack
              </button>
            )
          ) : (
            <button
              onClick={() => returnHome()}
              className="back btn btn-primary"
              id="back-btn"
            >
              Back to path
            </button>
          )}
        </>
      ) : (
        <>
          <div className="go-back-msg">
            <i className="nes-kirby"></i>
            <div className="nes-balloon from-left">
              <p>This location doesn't seem to have any pokémon</p>
            </div>
          </div>
          <button
            onClick={() => returnHome()}
            className="back btn btn-primary"
            id="back-btn-bottom"
          >
            Back to path
          </button>
        </>
      )}
    </div>
  );
}

export default App;
