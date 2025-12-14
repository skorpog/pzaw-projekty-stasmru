const albums = require("../models/album");

const testAlbums = [
  {
    artist: "Metallica",
    title: "Black Album",
    releaseDate: "1991-08-12",
    description: "„Black Album” to idealna brama do świata metalu – prosty, mocny, melodyjny i emocjonalny. Pokazuje, że metal może być zarówno agresywny, jak i piękny. Dzięki niemu miliony ludzi na świecie pokochały ten gatunek. Na płycie znajdziesz zarówno ciężkie utwory “Sad But True”, jak i emocjonalne ballady “The Unforgiven”, “Nothing Else Matters”. Dzięki temu każdy może znaleźć coś dla siebie – i powoli wejść w klimat metalu bez zniechęcenia.",
    totalDuration: "62:27",
    spotifyLink: "https://open.spotify.com/album/3dck2tBxGfxj9m3CguDgjb?si=5AdGbqB1TqyH-6orbRQlvQ",
    songs: [
      "Enter Sandman",
      "Sad But True",
      "Holier Than Thou",
      "The Unforgiven",
      "Wherever I May Roam",
      "Don't Tread on Me",
      "Through the Never",
      "Nothing Else Matters",
      "Of Wolf and Man",
      "The God That Failed",
      "My Friend of Misery",
      "The Struggle Within"
    ]
  },
  {
    artist: "Iron Maiden",
    title: "The Number of the Beast",
    releaseDate: "1982-03-22",
    description: "„The Number of the Beast” to jeden z najważniejszych albumów w historii heavy metalu i idealny punkt startowy dla początkujących fanów gatunku. To właśnie tutaj Iron Maiden pokazuje pełnię swojej mocy – melodyjne, ale energiczne gitary, charakterystyczny wokal Bruce’a Dickinsona i epickie, opowiadające historie teksty. Album jest doskonałym wprowadzeniem do klasycznego brzmienia metalu: szybkie, chwytliwe riffy i potężne refreny sprawiają, że łatwo się w niego wciągnąć. Utwory takie jak “Run to the Hills” czy “The Number of the Beast” są ponadczasowe i natychmiast rozpoznawalne, a epicki finał “Hallowed Be Thy Name” pokazuje emocjonalną głębię zespołu. Dzięki temu albumowi początkujący słuchacz może zrozumieć, dlaczego Iron Maiden uznawani są za legendę i jak metal może łączyć siłę, melodię i teatralny klimat w jedną, niezapomnianą całość.",
    totalDuration: "39:11",
    spotifyLink: "https://open.spotify.com/album/5S3gls8Kjn8KVmqlIDEBbO?si=d3b4715f87724a2f",
    songs: [
      "Invaders",
      "Children of the Damned",
      "The Prisoner",
      "22 Acacia Avenue",
      "The Number of the Beast",
      "Run to the Hills",
      "Gangland",
      "Hallowed Be Thy Name"
    ]
  },
  {
    artist: "Death",
    title: "Symbolic",
    releaseDate: "1995-03-21",
    description: "„Symbolic” to jedno z najważniejszych dzieł zespołu Death i zarazem szczytowe osiągnięcie technicznego death metalu. Chuck Schuldiner połączył brutalność gatunku z melodyjnością i filozoficzną głębią tekstów, tworząc album pełen emocji i przemyśleń. Brzmienie jest krystalicznie czyste, a każdy utwór prezentuje mistrzowskie umiejętności muzyków. Kompozycje takie jak “Crystal Mountain” czy “Symbolic” pokazują, jak złożony i jednocześnie przystępny może być metal ekstremalny. To album pełen energii, technicznej precyzji i refleksji nad ludzką naturą – klasyk, który wciąż inspiruje całe pokolenia muzyków.",
    totalDuration: "50:15",
    spotifyLink: "https://open.spotify.com/album/1QgFthItpbxvMXlgGjvhBR?si=1Vvy52p8QQGhQI50Ci8czg",
    songs: [
      "Symbolic",
      "Zero Tolerance",
      "Empty Words",
      "Sacred Serenity",
      "1,000 Eyes",
      "Without Judgement",
      "Crystal Mountain",
      "Misanthrope",
      "Perennial Quest"
    ]
  }
];

console.log("Populating db...");

testAlbums.forEach(albumData => {
  if (!albums.hasAlbumByArtistAndTitle(albumData.artist, albumData.title)) {
    let album = albums.addAlbum(albumData);
    console.log("Created album:", album);
  } else {
    console.log("Album already exists:", albumData.artist, "-", albumData.title);
  }
});
