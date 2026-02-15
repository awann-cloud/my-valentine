const { useState } = React;

// ✅ DATA LANGSUNG DIDEFINISIKAN (TIDAK PERLU FETCH DARI SERVER!)
const letterData = {"to":"Nindiaa Sayanggkuu","from":"Calonn Suami kamu","headline":"Happy Valentine's Day :3","body":["Setiap hari sama kamu selalu berasa spesial, tapi hari ini aku mau bikin sesuatu yang benar-benar cuma buat kita berdua.","Mungkin website kecil ini nggak sebanding sama semua kebaikann yang kamu kasih ke aku, tapi di setiap kata di sini ada rasa sayang yang nggak bisa aku jelasin satu-satu.","Makasih sayangg udahh selalu ada dann support aku sampai sekarang, aku mauu selamanya sama kamu... Aku sayang kamu bangetttt, semoga kita bisa terus bareng-bareng sampai tua nanti, aamiin."],"closing":"I love you, today and every day. 💌"};
const memoriesData = [{"title":"Ulang Tahun Kamu","date":"17/08/2025","description":"Iyaa hari ituu spesiall banget buat aku, karenaa akuu bisaa ngerayain ulang tahun kamu untuk pertama kalinyaa.","imageUrl":"/images/CIMG1147.jpg"},{"title":"Ini kita udah dekett","date":"Suatu hari saat kuliahh","description":"kamuu ingett kann waktuu ituu kitaa nyarii tempat yangg enakk buatt ngobrol berduaa, alhasill kitaa dapet di dalem ruangg bacaa, mooment inii buktinyaa.","imageUrl":"/images/WIN_20250212_13_12_16_Pro.jpg"}];
const playlistData = [{"title":"kota ini tak sama tanpamu","artist":"Nadhif Basalamah","url":"https://www.youtube.com/watch?v=grp6FCnioMM","youtubeId":"grp6FCnioMM"},{"title":"Spontan","artist":"DÉABDIL dan Arseri Music","url":"https://www.youtube.com/watch?v=n0sxFjzZLIw","youtubeId":"n0sxFjzZLIw"},{"title":"Marsha endeber","artist":"песенки для детей","url":"https://www.youtube.com/watch?v=zDfCtociDtA","youtubeId":"zDfCtociDtA"}];

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
  // ✅ STATE LANGSUNG DIISI DENGAN DATA (Tidak ada loading!)
  const [letter] = useState(letterData);
  const [memories] = useState(memoriesData);
  const [playlist] = useState(playlistData);
  const [showIntro, setShowIntro] = useState(true);
  const [playingIndex, setPlayingIndex] = useState(null);

  // ✅ TIDAK PERLU useEffect! Data ready dari awal.

  if (showIntro) {
    return <IntroScreen onOpen={() => setShowIntro(false)} />;
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