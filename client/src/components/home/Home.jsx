import React, { useEffect, useState, useCallback } from 'react';

const GameCard = ({ game, rating, handleRating }) => {
  return (
    <div className="game-item" style={{ margin: '20px', textAlign: 'center', width: '90%' }}>
      <img 
        src={game.image} 
        alt={game.name} 
        style={{ width: '100%', maxWidth: '400px', height: 'auto', margin: '0 auto' }} 
      />
      <h3 style={{ fontSize: '24px' }}>{game.name}</h3>
      <div>
        {Array.from({ length: 5 }, (_, idx) => (
          <span
            key={idx + 1}
            onClick={() => handleRating(idx + 1)}
            className={`star ${idx < rating ? 'selected' : ''}`}
            style={{ cursor: 'pointer', fontSize: '30px' }} 
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

const TodoList = () => {
  const [ratedGames, setRatedGames] = useState([]);
  const [unratedGames, setUnratedGames] = useState([]); 
  const [currentGames, setCurrentGames] = useState([]);
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');
  const [ratings, setRatings] = useState([0, 0]);
  const [view, setView] = useState('unrated');
  
  const API_KEY = '37487a6982c54377bebdd3abbd810aca';

  const fetchGames = useCallback(async () => {
    try {
      const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}`);
      const data = await response.json();
      const gameData = data.results.map((game) => ({
        id: game.id,
        name: game.name,
        image: game.background_image,
        userRating: 0,
      }));
      setGames(gameData);
      setCurrentGames(getRandomGames(gameData));
    } catch (error) {
      console.error('Error fetching the games:', error);
    }
  }, [API_KEY]);

  useEffect(() => {
    setRatedGames([]);
    setUnratedGames([]);
    setSearch('');
    fetchGames();
  }, [fetchGames]);

  const getRandomGames = (gameList) => {
    const shuffled = gameList.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2); 
  };

  const addRating = () => {
    currentGames.forEach((currentGame, index) => {
      const ratingValue = ratings[index];
      const newGame = {
        text: currentGame.name,
        rated: ratingValue > 0,
        rating: ratingValue,
      };

      if (ratingValue > 0) {
        setRatedGames((prevRatedGames) => [...prevRatedGames, newGame]);
      } else {
        setUnratedGames((prevUnratedGames) => [...prevUnratedGames, newGame]);
      }
    });
    fetchNewGames();
  };

  const fetchNewGames = () => {
    const remainingGames = games.filter(game => !currentGames.some(current => current.id === game.id));
    setCurrentGames(getRandomGames(remainingGames));
    setRatings([0, 0]); 
  };

  const handleRating = (index, ratingValue) => {
    setRatings(prevRatings => {
      const newRatings = [...prevRatings];
      newRatings[index] = ratingValue;
      return newRatings;
    });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleGameSelection = (game) => {
    setCurrentGames([game]);
    setSearch('');
  };

  const toggleView = (event) => {
    setView(event.target.value);
  };

  const displayGames = view === 'unrated' ? unratedGames : ratedGames;

  const markAsRated = (index) => {
    const gameToMark = displayGames[index];

    if (view === 'rated') {
      setRatedGames((prev) => prev.filter((_, i) => i !== index));
      setUnratedGames((prev) => [
        ...prev,
        { text: gameToMark.text, rated: false, rating: 0 } 
      ]);
    } else {
      setRatedGames((prev) => [...prev, { ...gameToMark, rated: true }]);
      setUnratedGames((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const markAsUnrated = (index) => {
    const gameToUnmark = displayGames[index];
    setUnratedGames((prev) => [
      ...prev,
      { text: gameToUnmark.text, rated: false, rating: 0 } 
    ]);
    setRatedGames((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="todo-list">
      <h2>Rate any Steam Game</h2>

      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search for a game..."
          value={search}
          onChange={handleSearch}
        />

        {search && filteredGames.length > 0 && (
          <ul style={{ 
            position: 'absolute', 
            zIndex: '1', 
            backgroundColor: 'white', 
            border: '1px solid #ccc', 
            listStyle: 'none', 
            padding: '0', 
            margin: '0', 
            maxHeight: '150px',
            overflowY: 'auto',
            width: '100%'
          }}>
            {filteredGames.map((game) => (
              <li key={game.id} style={{ padding: '8px', cursor: 'pointer' }}>
                <button 
                  onClick={() => handleGameSelection(game)}
                  style={{ textDecoration: 'none', color: 'black', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {game.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2>Current Games</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {currentGames.map((game, index) => (
          <GameCard 
            key={game.id} 
            game={game} 
            rating={ratings[index]}
            handleRating={(ratingValue) => handleRating(index, ratingValue)} 
          />
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={addRating} style={{ margin: '20px auto', padding: '10px 20px', fontSize: '16px' }}>
          Submit Rating
        </button>
      </div>

      <h2>Rated Games</h2>
      <div>
        <label htmlFor="game-view">Select view:</label>
        <select id="game-view" value={view} onChange={toggleView}>
          <option value="unrated">Unrated Games</option>
          <option value="rated">Rated Games</option>
        </select>
      </div>

      <ul>
        {displayGames.map((game, index) => (
          <li key={index}>
            <span style={{ textDecoration: game.rated ? 'none' : 'line-through' }}>
              {game.text} - Rated: {game.rating} ★
            </span>
            <button onClick={() => markAsRated(index)}>
              {view === 'unrated' ? 'Mark as Rated' : 'Mark as Unrated'}
            </button>
            <button onClick={() => {
              if (view === 'unrated') {
                setUnratedGames(unratedGames.filter((_, i) => i !== index));
              } else {
                markAsUnrated(index); 
              }
            }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;