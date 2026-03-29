# Serwer Express z Dynamicznymi Widokami EJS

Ten projekt to aplikacja Express z obsługą autentykacji użytkowników, zarządzaniem albumami metalowych oraz systemem komentarzy. Aplikacja pozwala na przeglądanie poleceń albumów metalowych, wyświetlanie szczegółów poszczególnych albumów i dodawanie komentarzy.

## Wymagania

- Node.js (wersja 14+)
- npm

## Instalacja

1. Sklonuj lub pobierz projekt.
2. Przejdź do katalogu projektu.
3. Zainstaluj zależności:

```bash
npm install
```

## Konfiguracja

### 1. Wygeneruj plik .env z sekretami

Uruchom komendę, aby wygenerować plik `.env` z wymaganymi zmiennymi środowiskowymi:

```bash
npm run generate_env
```

### 2. Wypełnij bazę danych

Uruchom skrypt, który doda dane testowe do bazy danych:

```bash
npm run populate_db
```

Ten skrypt doda:
- **Konto admin**: `admin` / `changeme`
- **Konto standardowe**: `student` / `changeme`
- **Kilka przykładowych albumów**

## Uruchamianie Serwera

Aby uruchomić serwer w trybie deweloperskim:

```bash
npm run dev
```

Serwer będzie dostępny pod adresem: **http://localhost:3000**

## Dostępne npm skrypty

- `npm run dev` - uruchomienie serwera
- `npm run populate_db` - napełnienie bazy danych przykładowymi danymi
- `npm run generate_env` - wygenerowanie pliku `.env`

## Funkcjonalności

-  **Autentykacja**: Rejestracja, logowanie, wylogowanie z haszowaniem hasła (argon2)
-  **Autoryzacja**: System uprawnień z rolą admin
-  **Zarządzanie albumami**: Tylko administratorzy mogą tworzyć i edytować albumy
-  **System komentarzy**: Użytkownicy mogą komentować albumy
-  **Motyw**: Tryb ciemny i jasny z zapisem preferencji
-  **Cookies**: Autentykacja oparta na bezpiecznych ciasteczkami HTTP-only

## Struktura Projektu

- `index.js` - główny plik aplikacji
- `controllers/` - logika biznesowa
- `models/` - modele bazy danych
- `views/` - szablony EJS
- `public/` - pliki statyczne (CSS, JS)
- `utils/` - narzędzia pomocnicze

## Technologie

### Backend
- **Express.js** (v5.2.1) - framework webowy Node.js
- **EJS** (v3.1.10) - silnik szablonów do renderowania stron
- **Node.js** - środowisko wykonawcze JavaScript

### Bezpieczeństwo
- **Argon2**
- **Cookie Parser** 

### Baza Danych
- **SQLite3** 
- **DatabaseSync** 

### Narzędzia
- **Morgan** 

### Frontend
- **CSS3** 
- **JavaScript** 

Serwer uruchomi się na porcie 3000 (lub wartość z `PORT` w .env). Otwórz przeglądarkę i przejdź do `http://localhost:3000`.

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

