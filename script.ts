interface Book {
    title: string;
    author: string;
    year: number;
    condition: 'nowa' | 'idealny' | 'dobry' | 'używana';
}

async function searchBooks(query: string): Promise<Book[]> {
    const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    if (!response.ok) {
        throw new Error('Problem z połączeniem z API');
    }
    const data = await response.json();
    return data.docs.map((book: any) => ({
        title: book.title,
        author: book.author_name?.[0] || 'Nieznany autor',
        year: parseInt(book.first_publish_year) || 0,
    }));
}

function getOrCreateResultsSection(): HTMLElement {
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
    return resultsSection.querySelector('#wyniki-container') as HTMLElement;
}

function clearResultsContainer(resultsContainer: HTMLElement): void {
    resultsContainer.innerHTML = '';
}

function displayBooks(books: Book[], resultsContainer: HTMLElement): void {
    clearResultsContainer(resultsContainer);

    const resultsList = document.createElement('ul');
    books.forEach(book => {
        const listItem = document.createElement('li');
        listItem.textContent = `${book.title} - ${book.author} (${book.year})`;
        resultsList.appendChild(listItem);
    });

    resultsContainer.appendChild(resultsList);
}

function displayNoBooksFound(resultsContainer: HTMLElement): void {
    clearResultsContainer(resultsContainer);

    const noBooksMessage = document.createElement('p');
    noBooksMessage.textContent = 'Brak książek w tych kryteriach.';
    noBooksMessage.style.color = 'red';
    noBooksMessage.style.fontWeight = 'bold';

    resultsContainer.appendChild(noBooksMessage);
}

const searchForm = document.getElementById('wyszukajKsiazkeForm') as HTMLFormElement;
searchForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault();

    const queryInput = document.getElementById('tytul-wyszukiwanie') as HTMLInputElement;
    const yearFromInput = document.getElementById('rok-od') as HTMLInputElement;
    const yearToInput = document.getElementById('rok-do') as HTMLInputElement;

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
        const books = await searchBooks(query);

        const filteredBooks = books.filter(book => {
            const matchesYear =
                (!yearFrom || book.year >= yearFrom) &&
                (!yearTo || book.year <= yearTo);

            return matchesYear;
        });

        if (filteredBooks.length === 0) {
            displayNoBooksFound(resultsContainer);
        } else {
            displayBooks(filteredBooks, resultsContainer);
        }
    } catch (error) {
        console.error('Błąd podczas wyszukiwania książek:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Nie udało się wyszukać książek. Spróbuj ponownie później.';
        errorMessage.style.color = 'red';
        errorMessage.style.fontWeight = 'bold';
        clearResultsContainer(resultsContainer);
        resultsContainer.appendChild(errorMessage);
    }
});
