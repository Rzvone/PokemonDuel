import React, { useState, useEffect, useRef } from "react";
import UsersPokemon from "./UsersPokemon";

const Pokemon = ({
  location,
  getPokemon,
  pokemon,
  collect,
  setUserPokemons,
  userPokemons,
  setFetchSuccess,
}) => {
  const areaUrl = useRef("");
  const encountersUrl = useRef("");
  const [isLoading, setIsLoading] = useState(true);
  const [memoized, setMemoized] = useState(false);
  const randomValue = React.useMemo(() => Math.random(), []);
  const initialHp = React.useMemo(() => {
    if (memoized) {
      return pokemon.stats[0].base_stat;
    }
  }, [memoized]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(location.url);
      const res = await response.json();
      res.areas.length !== 0
        ? (areaUrl.current =
            res.areas[Math.floor(randomValue * res.areas.length)]?.url)
        : setFetchSuccess(false);
    };
    const fetchArea = async () => {
      const response = await fetch(areaUrl.current);
      const res = await response.json();
      encountersUrl.current =
        res.pokemon_encounters[
          Math.floor(randomValue * res.pokemon_encounters.length)
        ].pokemon?.url;
      console.log(encountersUrl);
    };
    const fetchPokemon = async () => {
      const response = await fetch(encountersUrl.current);
      const res = await response.json();
      if (!collect) {
        getPokemon(res);
        setMemoized(true);
      } else {
        setUserPokemons([...userPokemons, encountersUrl.current]);
      }
    };
    const fetchAll = async () => {
      await fetchData();
      await fetchArea();
      await fetchPokemon();
      setIsLoading(false);
    };
    fetchAll();
  }, [location.url, randomValue, collect]);


  return (
    <>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="card enemy-card" id="enemy-card">
          <img
              src={pokemon.sprites?.front_default}
              className="d-block w-50 card-img-top enemy-img"
              alt={pokemon.name}
          />
          <div className="card-body">
            <h1 id="pokeName">{pokemon.name}</h1>
            <p>HP: {pokemon.stats[0].base_stat.toFixed(0)}</p>
            <p id="health" className="health-bar">
              ATT: {pokemon.stats[1].base_stat.toFixed(0)}
            </p>
            <p id="health" className="health-bar">
              DEF: {pokemon.stats[2].base_stat.toFixed(0)}
            </p>
            {pokemon.stats[0].base_stat.toFixed(2) <= initialHp * 0.3 ? (
              <progress
                className="nes-progress is-error"
                value={pokemon.stats[0].base_stat.toFixed(2)}
                max={initialHp}
              ></progress>
            
            ) : (
              <progress
                className="nes-progress is-success"
                value={pokemon.stats[0].base_stat.toFixed(2)}
                max={initialHp}
              ></progress>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Pokemon;
