"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function searchBooks(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://openlibrary.org/search.json?q=${query}`);
        if (!response.ok) {
            throw new Error('Problem z połączeniem z API');
        }
        const data = yield response.json();
        return data.docs.map((book) => {
            var _a;
            return ({
                title: book.title,
                author: ((_a = book.author_name) === null || _a === void 0 ? void 0 : _a[0]) || 'Nieznany autor',
                year: parseInt(book.first_publish_year) || 0,
            });
        });
    });
}
function getOrCreateResultsSection() {
    let resultsSection = document.getElementById('wyniki-wyszukiwania');
    if (!resultsSection) {
        resultsSection = document.createElement('section');
        resultsSection.id = 'wyniki-wyszukiwania';
        resultsSection.innerHTML = `
            <h2>Wyniki wyszukiwania</h2>
            <div id="wyniki-container"></div>
        `;
        const searchSection = document.getElementById('szukaj-ksiazki');
        if (searchSection) {
            searchSection.insertAdjacentElement('afterend', resultsSection);
        }
    }
    return resultsSection.querySelector('#wyniki-container');
}
function clearResultsContainer(resultsContainer) {
    resultsContainer.innerHTML = '';
}
function displayBooks(books, resultsContainer) {
    clearResultsContainer(resultsContainer);
    const resultsList = document.createElement('ul');
    books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.textContent = `${book.title} - ${book.author} (${book.year})`;
        resultsList.appendChild(listItem);
    });
    resultsContainer.appendChild(resultsList);
}
function displayNoBooksFound(resultsContainer) {
    clearResultsContainer(resultsContainer);
    const noBooksMessage = document.createElement('p');
    noBooksMessage.textContent = 'Brak książek w tych kryteriach.';
    noBooksMessage.style.color = 'red';
    noBooksMessage.style.fontWeight = 'bold';
    resultsContainer.appendChild(noBooksMessage);
}
const searchForm = document.getElementById('wyszukajKsiazkeForm');
searchForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const queryInput = document.getElementById('tytul-wyszukiwanie');
    const yearFromInput = document.getElementById('rok-od');
    const yearToInput = document.getElementById('rok-do');
    const query = queryInput.value.trim();
    const yearFrom = yearFromInput.value ? parseInt(yearFromInput.value) : null;
    const yearTo = yearToInput.value ? parseInt(yearToInput.value) : null;
    const resultsContainer = getOrCreateResultsSection();
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Ładowanie wyników...';
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(loadingMessage);
    if (!query) {
        displayNoBooksFound(resultsContainer);
        return;
    }
    try {
        const books = yield searchBooks(query);
        const filteredBooks = books.filter(book => {
            const matchesYear = (!yearFrom || book.year >= yearFrom) &&
                (!yearTo || book.year <= yearTo);
            return matchesYear;
        });
        if (filteredBooks.length === 0) {
            displayNoBooksFound(resultsContainer);
        }
        else {
            displayBooks(filteredBooks, resultsContainer);
        }
    }
    catch (error) {
        console.error('Błąd podczas wyszukiwania książek:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Nie udało się wyszukać książek. Spróbuj ponownie później.';
        errorMessage.style.color = 'red';
        errorMessage.style.fontWeight = 'bold';
        clearResultsContainer(resultsContainer);
        resultsContainer.appendChild(errorMessage);
    }
}));
