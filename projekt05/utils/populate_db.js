import 'dotenv/config';
import albums from "../models/album.js";
import userModel from "../models/user.js";

const testAlbums = new Map([
  ["Metallica", {
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
  }],
  ["Iron Maiden", {
    artist: "Iron Maiden",
    title: "The Number of the Beast",
    releaseDate: "1982-03-22",
    description: "Klasyczny album Iron Maiden z epickimi riffami, ikonowymi hitami i charakterystycznym wokalem Bruce’a Dickinsona. Idealny punkt startowy dla fanów heavy metalu.",
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
  }],
  ["Death", {
    artist: "Death",
    title: "Symbolic",
    releaseDate: "1995-03-21",
    description: "Techniczny i emocjonalny album Death, łączący brutalność z melodyjnością. Symbolic pokazuje, dlaczego Chuck Schuldiner jest jedną z najważniejszych postaci metalu.",
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
  }],
  ["Trivium", {
    artist: "Trivium",
    title: "Ascendancy",
    releaseDate: "2005-05-09",
    description: "Mega fajny album, energiczno - melodyczny",
    totalDuration: "55:16",
    spotifyLink: "https://open.spotify.com/album/4tUJoHF6in0wA5cpioJkbV?si=OFt7_NwCRmOfUgFrjhCWsQ",
    songs: [
      "The End of Everything",
      "Rain",
      "Pull Harder on the Strings of Your Martyr",
      "Drowned and Torn Asunder",
      "Ascendancy",
      "A Gunshot to the Head of Trepidation",
      "Like Light to the Flies",
      "Dying in Your Arms",
      "The Deceived",
      "Suffocating Sight",
      "Departure",
      "Declaration"
    ]
  }],
  ["Sepultura", {
    artist: "Sepultura",
    title: "Chaos A.D.",
    releaseDate: "1993-09-02",
    description: "ODMOWA/OPÓR - tak naprawde album dotykał tematy polityczne i protestów które działy sie w krauju zespołu, czyli Brazylii. Czuć tą agresję związna z sytuacją w kraju. Pierwszy raz Sepultura użyła instrumentów plemmiennych.",
    totalDuration: "47:03",
    spotifyLink: "https://open.spotify.com/album/5r4qa5AIQUVypFRXQzjaiu?si=t1YiEqtKRNWFVdVHPXvJvQ",
    songs: [
      "Refuse/Resist",
      "Territory",
      "Slave New World",
      "Amen",
      "Kaiowas",
      "Propaganda",
      "Biotech Is Godzilla",
      "Nomad",
      "We Who Are Not as Others",
      "Manifest",
      "The Hunt",
      "Clenched Fist"
    ]
  }],
  ["Emperor", {
    artist: "Emperor",
    title: "Anthems to the Welkin at Dusk",
    releaseDate: "1997-07-08",
    description: "Ten album łączy surowość black metalu z symfonicznym rozmachem. Teksty skupiają się na kosmicznych, mistycznych i filozoficznych wizjach, a całość brzmi jak zimna, monumentalna podróż przez nocne niebo. To jeden z najbardziej przełomowych albumów w historii gatunku, pokazujący jak ekstremalna muzyka może być jednocześnie brutalna i wyrafinowana.",
    totalDuration: "51:51",
    spotifyLink: "https://open.spotify.com/album/7MOaD3Y4SmevciBliFGqiQ?si=MU52KuYPTquDd6hz3Kjx5g",
    songs: [
      "Alsvartr (The Oath)",
      "Ye Entrancemperium",
      "Thus Spake the Nightspirit",
      "Ensorcelled by Khaos",
      "The Loss and Curse of Reverence",
      "The Acclamation of Bonds",
      "With Strength I Burn",
      "The Wanderer"
    ]
  }]
]);

console.log("Populating db...");

async function seed() {
  console.log("Populating db...");

  let admin = await userModel.createUser("admin", "changeme");
  if (admin) {
    const err = userModel.addAttribute(admin.id, "is_admin", true);
    if (err) console.error("Could not set admin attribute:", err);
  }

  let user = await userModel.createUser("student", "changeme");
// poprawka Lukasza1
  for (const albumData of testAlbums.values()) {    const validationErrors = albums.validateAlbumData(albumData);
    if (validationErrors.length > 0) {
      throw new Error(`Invalid seed album ${albumData.artist} - ${albumData.title}: ${validationErrors.join("; ")}`);
    }

    const existingAlbum = albums.getAlbum(albumData.artist);
    if (existingAlbum && existingAlbum.title === albumData.title) {
      const shouldUpdate =
        existingAlbum.releaseDate !== albumData.releaseDate ||
        existingAlbum.description !== albumData.description ||
        existingAlbum.totalDuration !== albumData.totalDuration ||
        existingAlbum.spotifyLink !== albumData.spotifyLink ||
        JSON.stringify(existingAlbum.songs.map((song) => song.title)) !== JSON.stringify(albumData.songs);

      if (shouldUpdate) {
        albums.updateAlbum(existingAlbum.id, { ...albumData, songs: [...albumData.songs] });
        console.log("Updated album:", albumData.artist, "-", albumData.title);
      } else {
        console.log("Album already exists and is up to date:", albumData.artist, "-", albumData.title);
      }
      continue;
    }
    if (!albums.hasAlbumByArtistAndTitle(albumData.artist, albumData.title)) {
      const album = albums.addAlbum(albumData, null);
      console.log("Created album:", album);
    } else {
      console.log("Album already exists:", albumData.artist, "-", albumData.title);
    }
  }

  console.log("Done!");
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
