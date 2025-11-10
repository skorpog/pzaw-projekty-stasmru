const express = require("express");

const port = 8000;
const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const albums = [
  {
    name: "black-album",
    title: "Metallica - Black Album",
    releaseDate: "1991-08-12",
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
    ],
    description: "„Black Album” to idealna brama do świata metalu – prosty, mocny, melodyjny i emocjonalny. Pokazuje, że metal może być zarówno agresywny, jak i piękny. Dzięki niemu miliony ludzi na świecie pokochały ten gatunek. Na płycie znajdziesz zarówno ciężkie utwory “Sad But True”, jak i emocjonalne ballady “The Unforgiven”, “Nothing Else Matters”. Dzięki temu każdy może znaleźć coś dla siebie – i powoli wejść w klimat metalu bez zniechęcenia.",
    totalDuration: "62:27",
    spotifyLink: "https://open.spotify.com/album/3dck2tBxGfxj9m3CguDgjb?si=5AdGbqB1TqyH-6orbRQlvQ"
  },
  {
    name: "number-of-the-beast",
    title: "Iron Maiden - The Number of the Beast",
    releaseDate: "1982-03-22",
    songs: [
      "Invaders",
      "Children of the Damned",
      "The Prisoner",
      "22 Acacia Avenue",
      "The Number of the Beast",
      "Run to the Hills",
      "Gangland",
      "Hallowed Be Thy Name"
    ],
    description: "„The Number of the Beast” to jeden z najważniejszych albumów w historii heavy metalu i idealny punkt startowy dla początkujących fanów gatunku. To właśnie tutaj Iron Maiden pokazuje pełnię swojej mocy – melodyjne, ale energiczne gitary, charakterystyczny wokal Bruce’a Dickinsona i epickie, opowiadające historie teksty. Album jest doskonałym wprowadzeniem do klasycznego brzmienia metalu: szybkie, chwytliwe riffy i potężne refreny sprawiają, że łatwo się w niego wciągnąć. Utwory takie jak “Run to the Hills” czy “The Number of the Beast” są ponadczasowe i natychmiast rozpoznawalne, a epicki finał “Hallowed Be Thy Name” pokazuje emocjonalną głębię zespołu. Dzięki temu albumowi początkujący słuchacz może zrozumieć, dlaczego Iron Maiden uznawani są za legendę i jak metal może łączyć siłę, melodię i teatralny klimat w jedną, niezapomnianą całość.",
    totalDuration: "39:11",
    spotifyLink: "https://open.spotify.com/album/5S3gls8Kjn8KVmqlIDEBbO?si=d3b4715f87724a2f"
  },
  {
    name: "symbolic",
    title: "Death - Symbolic",
    releaseDate: "1995-03-21",
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
    ],
    description: "„Symbolic” to jedno z najważniejszych dzieł zespołu Death i zarazem szczytowe osiągnięcie technicznego death metalu. Chuck Schuldiner połączył brutalność gatunku z melodyjnością i filozoficzną głębią tekstów, tworząc album pełen emocji i przemyśleń. Brzmienie jest krystalicznie czyste, a każdy utwór prezentuje mistrzowskie umiejętności muzyków. Kompozycje takie jak “Crystal Mountain” czy “Symbolic” pokazują, jak złożony i jednocześnie przystępny może być metal ekstremalny. To album pełen energii, technicznej precyzji i refleksji nad ludzką naturą – klasyk, który wciąż inspiruje całe pokolenia muzyków.",
    totalDuration: "50:15",
    spotifyLink: "https://open.spotify.com/album/1QgFthItpbxvMXlgGjvhBR?si=1Vvy52p8QQGhQI50Ci8czg"
  },
  {
    name: "rust-in-peace",
    title: "Megadeth - Rust in Peace",
    releaseDate: "1990-09-24",
    songs: [
      "Holy Wars... The Punishment Due",
      "Hangar 18",
      "Take No Prisoners",
      "Five Magics",
      "Poison Was the Cure",
      "Lucretia",
      "Tornado of Souls",
      "Dawn Patrol",
      "Rust in Peace... Polaris"
    ],
    description: "„Rust in Peace” to thrashmetalowy majstersztyk Megadeth i jedno z najbardziej dopracowanych dzieł w historii metalu. Album łączy techniczną precyzję, polityczne i apokaliptyczne teksty oraz niezrównaną energię. Dave Mustaine i Marty Friedman tworzą duet gitarowy, który zdefiniował brzmienie całego gatunku – pełne zawiłych solówek, agresywnych riffów i melodyjnych harmonii. Utwory takie jak “Holy Wars... The Punishment Due” czy “Tornado of Souls” są ikonami thrash metalu, a cały album to pokaz kompozycyjnej finezji i instrumentalnej wirtuozerii. To płyta, która wyniosła Megadeth na szczyt i pozostaje jednym z filarów klasycznego metalu.",
    totalDuration: "40:45",
    spotifyLink: "https://open.spotify.com/album/0qaLL09EtF1hiUis7PRvaJ?si=8nfusMRJR0-BTNcNH3uAhw"
  },
  {
    name: "the-new-order",
    title: "Testament - The New Order",
    releaseDate: "1988-05-05",
    songs: [
      "Eerie Inhabitants",
      "The New Order",
      "Trial by Fire",
      "Into the Pit",
      "Hypnosis",
      "Disciples of the Watch",
      "The Preacher",
      "Nobody's Fault",
      "A Day of Reckoning",
      "Musical Death (A Dirge)"
    ],
    description: "„The New Order” to przełomowy album Testament i jedno z najważniejszych wydawnictw thrash metalu końca lat 80. Płyta łączy agresję i techniczność z melodyjnymi partiami gitar i charakterystycznym wokalem Chucka Billy’ego. Brzmienie jest potężne, a utwory takie jak “Into the Pit” czy “Disciples of the Watch” pokazują siłę i precyzji zespołu w najlepszej formie. Testament udowadnia tu, że potrafi tworzyć muzykę równie intensywną co Metallica czy Megadeth, zachowując przy tym własny, niepowtarzalny styl. „The New Order” to klasyk, który ugruntował pozycję zespołu wśród gigantów thrash metalu.",
    totalDuration: "45:22",
    spotifyLink: "https://open.spotify.com/album/1i0xUSNR8hWBIeaDSnN569?si=6c629009c2c74aa2"
  }
];

app.get("/", (req, res) => {
  res.render("home", { albums });
});

app.get("/album/:name", (req, res) => {
  const album = albums.find(a => a.name === req.params.name);
  if (album) {
    res.render("album", { album });
  } else {
    res.status(404).send("Album not found");
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
