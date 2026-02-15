const { useEffect, useState } = React;

function IntroScreen({ onOpen }) {
  const [hearts, setHearts] = useState([]);

  const createHeart = () => {
    const newHeart = {
      id: Date.now() + Math.random(),
      left: Math.random() * 100,
      duration: Math.random() * 2 + 3,
      size: Math.random() * 1.5 + 1,
    };
    
    setHearts(prev => [...prev, newHeart]);
    
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, (newHeart.duration + 0.5) * 1000);
  };

  const handleLoveClick = () => {
    const heartCount = Math.floor(Math.random() * 5) + 8;
    for (let i = 0; i < heartCount; i++) {
      setTimeout(() => {
        createHeart();
      }, i * 100);
    }
  };

  return (
    <div className="intro">
      <div className="intro__overlay" />
      <button className="intro__about-btn" onClick={onOpen}>Massage</button>
      <div className="intro__content">
        <div className="intro__poem-container">
          <div className="intro__poem">
            <span className="intro__poem-line">pencet sebanyakk yang sayangg mauu...</span>
          </div>
          <div className="intro__button-container">
            <button className="intro__love-button" onClick={handleLoveClick}>
              <span className="intro__button-text">love</span>
              <span className="intro__pixel-heart"></span>
            </button>
          </div>
        </div>
      </div>
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="intro__falling-heart"
          style={{
            left: `${heart.left}vw`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}rem`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
}

function App() {
  const [letter, setLetter] = useState(null);
  const [memories, setMemories] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // --- TAMBAHAN BARU: STATE UNTUK PLAYLIST ---
  // Ini remote control kita. Isinya nomor urut lagu yang lagi main.
  const [playingIndex, setPlayingIndex] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [letterRes, memoriesRes, playlistRes] = await Promise.all([
          fetch('/api/love-letter'),
          fetch('/api/memories'),
          fetch('/api/playlist'),
        ]);

        const [letterJson, memoriesJson, playlistJson] = await Promise.all([
          letterRes.json(),
          memoriesRes.json(),
          playlistRes.json(),
        ]);

        setLetter(letterJson);
        setMemories(memoriesJson);
        setPlaylist(playlistJson);
      } catch (e) {
        console.error('Failed to load Valentine data', e);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  if (showIntro) {
    return <IntroScreen onOpen={() => setShowIntro(false)} />;
  }

  if (loading) {
    return (
      <div className="page page--loading">
        <p>Menyiapkan kejutan buat kamu...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="page__back-btn" onClick={() => setShowIntro(true)}>
        Back
      </button>
      
      <header className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <h1>Happy Valentine&apos;s Day</h1>
          <p>Website kecil ini cuma buat kamu ❤️</p>
        </div>
      </header>

      <main className="content">
        {letter && (
          <section className="card card--letter">
            <h2>{letter.headline}</h2>
            <p className="card__to">Untuk: {letter.to}</p>
            <div className="card__body">
              {letter.body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <p className="card__closing">{letter.closing}</p>
            <p className="card__from">Dari: {letter.from}</p>
          </section>
        )}

        <section className="card">
          <h2>Kenangan Kita</h2>
          <div className="memories">
            {memories.map((m, idx) => (
              <div key={idx} className="memory">
                {m.imageUrl && (
                <div className="memory__image-wrap">
                  <img
                    className="memory__image"
                    
                    /* BAGIAN INI KUNCINYA */
                    src={m.imageUrl} 
                    alt={m.title}
                  />
                </div>
                )}
                <h3>{m.title}</h3>
                <p className="memory__date">{m.date}</p>
                <p>{m.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- BAGIAN PLAYLIST YANG SUDAH DIPERBAIKI --- */}
        <section className="card">
          <h2>laguu kita</h2>
          <ul className="playlist">
            {playlist.map((song, idx) => (
              <li key={idx} className="playlist__item-wrapper">
                <div className="playlist__item">
                  <div>
                    <span className="playlist__title">{song.title}</span>
                    <span className="playlist__artist"> — {song.artist}</span>
                  </div>
                  
                  {song.youtubeId && (
                    <button 
                      className="playlist__link"
                      onClick={() => {
                        // LOGIKA: Kalau diklik lagi, tutup (null). 
                        // Kalau klik lagu lain, ganti index-nya.
                        if (playingIndex === idx) {
                          setPlayingIndex(null);
                        } else {
                          setPlayingIndex(idx);
                        }
                      }}
                    >
                      {/* Text tombol berubah otomatis */}
                      {playingIndex === idx ? 'Tutup' : 'Putar'}
                    </button>
                  )}
                </div>

                {/* LOGIKA CONDITIONAL RENDERING */}
                {/* Iframe HANYA dibuat di memori browser kalau indexnya cocok */}
                {song.youtubeId && playingIndex === idx && (
                  <div className="playlist__player-container">
                    <iframe
                      className="playlist__player"
                      // autoplay=1 akan jalan karena iframe baru saja "lahir"
                      src={`https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`} 
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>
          Dibuat dengan ❤️
        </p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
