// script.js

// Funkcja do obsługi dodawania książki
const dodajKsiazkeForm = document.getElementById('dodajKsiazkeForm');
dodajKsiazkeForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Pobieranie danych z formularza
    const tytul = document.getElementById('tytul').value;
    const autor = document.getElementById('autor').value;
    const rok = document.getElementById('rok').value;
    const kategoria = document.getElementById('kategoria').value;
    const stan = document.querySelector('input[name="stan"]:checked').value;
    const notatki = document.getElementById('notatki').value;

    // Zbudowanie obiektu książki
    const nowaKsiazka = {
        tytul,
        autor,
        rok,
        kategoria,
        stan,
        notatki
    };

    console.log("Dodano książkę:", nowaKsiazka);

    // Tutaj możemy dodać kod wysyłający dane do API
    // np. fetch('https://example.com/api/books', { method: 'POST', body: JSON.stringify(nowaKsiazka) })
    // W tym przykładzie wyświetlimy tylko komunikat w konsoli
    
    alert(`Dodano książkę: ${tytul} autorstwa ${autor}`);
    dodajKsiazkeForm.reset();
});

// Funkcja do obsługi wyszukiwania książek
const wyszukajKsiazkeForm = document.getElementById('wyszukajKsiazkeForm');
wyszukajKsiazkeForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Pobieranie danych z formularza wyszukiwania
    const tytulWyszukiwanie = document.getElementById('tytul-wyszukiwanie').value;
    const kategoriaWyszukiwanie = document.getElementById('kategoria-wyszukiwanie').value;
    const rokOd = document.getElementById('rok-od').value;
    const rokDo = document.getElementById('rok-do').value;

    // Zbudowanie obiektu kryteriów wyszukiwania
    const kryteriaWyszukiwania = {
        tytul: tytulWyszukiwanie,
        kategoria: kategoriaWyszukiwanie,
        rokOd,
        rokDo
    };

    console.log("Wyszukiwanie książek z kryteriami:", kryteriaWyszukiwania);

    // Symulacja wyników wyszukiwania
    const wyniki = [
        { tytul: "Przykładowa Książka 1", autor: "Autor 1", rok: 2020 },
        { tytul: "Przykładowa Książka 2", autor: "Autor 2", rok: 2018 }
    ];

    // Wyświetlanie wyników
    const wynikiSection = document.createElement('section');
    wynikiSection.id = 'wyniki-wyszukiwania';
    wynikiSection.innerHTML = '<h2>Wyniki wyszukiwania</h2>';
    wyniki.forEach(ksiazka => {
        const div = document.createElement('div');
        div.classList.add('wynik');
        div.innerHTML = `
            <p><strong>Tytuł:</strong> ${ksiazka.tytul}</p>
            <p><strong>Autor:</strong> ${ksiazka.autor}</p>
            <p><strong>Rok:</strong> ${ksiazka.rok}</p>
        `;
        wynikiSection.appendChild(div);
    });

    // Dodanie wyników do DOM
    document.body.appendChild(wynikiSection);
});
