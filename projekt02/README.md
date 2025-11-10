# Serwer Express z Dynamicznymi Widokami EJS

Ten projekt to prosty serwer Express, który obsługuje dynamiczne widoki przy użyciu silnika szablonów EJS. Aplikacja pozwala na przeglądanie poleceń albumów metalowych oraz wyświetlanie szczegółów poszczególnych albumów.

## Wymagania

- Node.js
- npm

## Instalacja

1. Sklonuj lub pobierz projekt.
2. Przejdź do katalogu projektu.
3. Uruchom:

```
npm install
```

## Uruchamianie Serwera

Uruchom serwer za pomocą:

```
node index.js
```

Serwer uruchomi się na porcie 8000. Otwórz przeglądarkę i przejdź do `http://localhost:8000`.

## Sciezki

- `GET /`: Strona główna z poleconymi albumami metalowymi dla początkujących.
- `GET /album/:name`: Wyświetla szczegóły wybranego albumu, w tym piosenki, opis i całkowity czas trwania.
- `GET /about`: Strona "O Stronie" z informacjami o aplikacji.

## Konfiguracja

- Port: 8000
- Silnik widoków: EJS
- Pliki statyczne: Serwowane z katalogu `public/`
