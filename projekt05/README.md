# Projekt 05 — Katalog Albumów Muzycznych

Prosta aplikacja webowa do przeglądania kolekcji albumów, logowania użytkowników i zarządzania treścią.

Użytkownicy mogą przeglądać listę albumów, czytać opisy i komentować pojedyncze pozycje. Administrator ma dodatkowo dostęp do dodawania, edytowania i usuwania albumów.

## Funkcje

- lista albumów z widokiem szczegółowym
- logowanie / rejestracja użytkownika
- role: administrator i standardowy użytkownik
- dla administratora: dodawanie, edycja i usuwanie albumów
- komentowanie albumów i usuwanie własnych komentarzy
- system zgody na ciasteczka oraz tryb jasny/ciemny

## Wymagania

- Node.js
- Bash do uruchamiania skryptu `generate_env` na Windowsie (np. Git Bash)

## Konfiguracja i uruchomienie

1. Zainstaluj zależności:

```bash
npm install
```

2. Wygeneruj plik `.env`:

```bash
npm run generate_env
```

3. Wypełnij bazę danych przykładowymi danymi:

```bash
npm run populate_db
```

4. Uruchom serwer:

```bash
npm run dev
```

Możesz też użyć(to jest to samo ale lepiej wyglada xd):

```bash
npm start
```

5. Otwórz w przeglądarce:

```text
http://localhost:3000
```

## Obsługiwane ścieżki

- `GET /` — strona główna z listą albumów
- `GET /album/:id` — szczegóły albumu i komentarze
- `GET /about` — o aplikacji
- `GET /auth/signup` — formularz rejestracji
- `POST /auth/signup` — wysyłanie rejestracji
- `GET /auth/login` — formularz logowania
- `POST /auth/login` — wysyłanie logowania
- `GET /auth/logout` — wylogowanie
- `GET /add-album` — formularz dodawania albumu (tylko admin)
- `POST /add-album` — zapisanie nowego albumu (tylko admin)
- `GET /edit-album/:id` — formularz edycji albumu (tylko admin)
- `POST /edit-album/:id` — zapisanie zmian albumu (tylko admin)
- `POST /delete-album/:id` — usunięcie albumu (tylko admin)
- `POST /add-comment` — dodanie komentarza do albumu
- `POST /delete-comment/:commentId` — usunięcie komentarza (autor lub admin)
- `POST /consent` — ustawienie zgody na ciasteczka
- `POST /toggle-theme` — przełączenie motywu jasny/ciemny

## Konta testowe

- Administrator: `admin` / `changeme`
- Użytkownik standardowy: `student` / `changeme`

