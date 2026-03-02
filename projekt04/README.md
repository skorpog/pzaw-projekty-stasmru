# Serwer Express z Dynamicznymi Widokami EJS

Ten projekt to prosty serwer Express, który obsługuje dynamiczne widoki przy użyciu silnika szablonów EJS. Aplikacja pozwala na przeglądanie poleceń albumów metalowych oraz wyświetlanie szczegółów poszczególnych albumów.

## Wymagania

- Node.js
- npm

## INFORMACJA
Poniższych pakietów nie trzeba instalować, powinny być załączone w projekcie

## Instalacja

1. Sklonuj lub pobierz projekt.
2. Przejdź do katalogu projektu.
3. Uruchom:

```
npm install
```
```
npm install express
```
```
npm install morgan
```
```
npm install sqlite3
```


## Populowanie bazy danych

Trzeba to zrobić żeby cokolwiek było:
```
node utils/populate_db.js
```
Ten skrypt doda trzy albumy metalowe:
- Metallica - Black Album
- Iron Maiden - The Number of the Beast
- Death - Symbolic


## Uruchamianie Serwera

Uruchom serwer za pomocą:

```
node index.js
```

Serwer uruchomi się na porcie 8000. Otwórz przeglądarkę i przejdź do `http://localhost:8000`.

## Funkcjonalności

### Główne Ścieżki

- `GET /` - Strona główna z listą wszystkich albumów
- `GET /album/:id` - Wyświetla szczegóły wybranego albumu wraz z komentarzami
- `GET /about` - Strona informacyjna o projekcie
- `GET /add-album` - Formularz dodawania nowego albumu
- `POST /add-album` - Dodaje nowy album do bazy danych
- `GET /edit-album/:id` - Formularz edycji albumu
- `POST /edit-album/:id` - Aktualizuje dane albumu
- `POST /delete-album/:id` - Usuwa album z bazy danych
- `POST /add-comment` - Dodaje komentarz do albumu

### Zarządzanie Albumami

#### Dodawanie Albumu
1. Kliknij przycisk "Dodaj Album" na stronie głównej
2. Wypełnij formularz:
   - Artysta (1-500 znaków)
   - Tytuł (1-500 znaków)
   - Data wydania
   - Opis (1-2000 znaków)
   - Całkowity czas trwania (format: MM:SS)
   - Link do Spotify
   - Piosenki (oddzielone przecinkami)
3. Kliknij "Dodaj Album"

#### Edycja Albumu
1. Na stronie głównej kliknij przycisk "Edytuj" przy wybranym albumie
2. Zmodyfikuj dane w formularzu
3. Kliknij "Zaktualizuj Album"

#### Usuwanie Albumu
1. Na stronie głównej kliknij przycisk "Usuń" przy wybranym albumie
2. Potwierdź usunięcie w wyskakującym oknie

### System Komentarzy

Na stronie szczegółów każdego albumu użytkownicy mogą:
- Przeglądać istniejące komentarze
- Dodawać nowe komentarze z automatycznym znacznikiem czasu

**Uwaga:** Komentarze są przechowywane w pamięci serwera i zostaną utracone po restarcie aplikacji.

## Technologie

- **Backend:**
  - Express.js 5.1.0
  - Node.js built-in SQLite (DatabaseSync)
  - Morgan dla logowania

- **Frontend:**
  - EJS
  - CSS z animacjami i gradientami
  - Google Fonts (Metal Mania, Black Ops One)

- **Baza Danych:**
  - SQLite (przez node:sqlite)

