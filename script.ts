interface Book {
  title: string;
  author: string;
  year: number;
  condition: "nowa" | "idealny" | "dobry" | "używana";
}

async function searchBooks(query: string): Promise<Book[]> {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${query}`
  );
  if (!response.ok) {
    throw new Error("Problem z połączeniem z API");
  }
  const data = await response.json();
  return data.docs.map((book: any) => ({
    title: book.title,
    author: book.author_name?.[0] || "Nieznany autor",
    year: parseInt(book.first_publish_year) || 0,
  }));
}

function getOrCreateResultsSection(): HTMLElement {
  let resultsSection = document.getElementById("wyniki-wyszukiwania");
  if (!resultsSection) {
    resultsSection = document.createElement("section");
    resultsSection.id = "wyniki-wyszukiwania";
    resultsSection.innerHTML = `
                  <h2>Wyniki wyszukiwania</h2>
                  <div id="wyniki-container"></div>
              `;
    const searchSection = document.getElementById("szukaj-ksiazki");
    if (searchSection) {
      searchSection.insertAdjacentElement("afterend", resultsSection);
    }
  }
  return resultsSection.querySelector("#wyniki-container") as HTMLElement;
}

function clearResultsContainer(resultsContainer: HTMLElement): void {
  resultsContainer.innerHTML = "";
}

function displayBooks(books: Book[], resultsContainer: HTMLElement): void {
  clearResultsContainer(resultsContainer);

  const resultsList = document.createElement("ul");
  books.forEach((book) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${book.title} - ${book.author} (${book.year})`;
    resultsList.appendChild(listItem);
  });

  resultsContainer.appendChild(resultsList);
}

function displayNoBooksFound(resultsContainer: HTMLElement): void {
  clearResultsContainer(resultsContainer);

  const noBooksMessage = document.createElement("p");
  noBooksMessage.textContent = "Brak książek w tych kryteriach.";
  noBooksMessage.style.color = "red";
  noBooksMessage.style.fontWeight = "bold";

  resultsContainer.appendChild(noBooksMessage);
}

// Obsługa wyszukiwania książek
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById(
    "wyszukajKsiazkeForm"
  ) as HTMLFormElement;

  searchForm.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const queryInput = document.getElementById(
      "tytul-wyszukiwanie"
    ) as HTMLInputElement;
    const yearFromInput = document.getElementById("rok-od") as HTMLInputElement;
    const yearToInput = document.getElementById("rok-do") as HTMLInputElement;

    const query = queryInput.value.trim();
    const yearFrom = yearFromInput.value ? parseInt(yearFromInput.value) : null;
    const yearTo = yearToInput.value ? parseInt(yearToInput.value) : null;

    const resultsContainer = getOrCreateResultsSection();

    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = "Ładowanie wyników...";
    resultsContainer.innerHTML = "";
    resultsContainer.appendChild(loadingMessage);

    if (!query) {
      displayNoBooksFound(resultsContainer);
      return;
    }

    try {
      const books = await searchBooks(query);

      const filteredBooks = books.filter((book) => {
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
      console.error("Błąd podczas wyszukiwania książek:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent =
        "Nie udało się wyszukać książek. Spróbuj ponownie później.";
      errorMessage.style.color = "red";
      errorMessage.style.fontWeight = "bold";
      clearResultsContainer(resultsContainer);
      resultsContainer.appendChild(errorMessage);
    }
  });

  const addBookForm = document.getElementById(
    "dodajKsiazkeForm"
  ) as HTMLFormElement;

  const addBookSection = document.getElementById(
    "dodaj-ksiazke"
  ) as HTMLElement;

  const resultsContainer = document.createElement("div");
  resultsContainer.id = "resultsContainer";

  addBookSection.insertAdjacentElement("beforeend", resultsContainer);

  addBookForm.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const tytul = document.getElementById("tytul") as HTMLInputElement;
    const autor = document.getElementById("autor") as HTMLInputElement;
    const rok = document.getElementById("rok") as HTMLInputElement;
    const kategoria = document.getElementById("kategoria") as HTMLSelectElement;
    const stanInputs = document.getElementsByName(
      "stan"
    ) as NodeListOf<HTMLInputElement>;
    const notatki = document.getElementById("notatki") as HTMLTextAreaElement;

    let stan = "";
    stanInputs.forEach((input) => {
      if (input.checked) {
        stan = input.value;
      }
    });

    // Validate required fields
    const requiredFields = [
      {
        element: tytul,
        value: tytul.value,
        message: "Proszę podać tytuł książki.",
      },
      {
        element: autor,
        value: autor.value,
        message: "Proszę podać autora książki.",
      },
      {
        element: rok,
        value: rok.value,
        message: "Proszę podać rok wydania książki.",
      },
      {
        element: kategoria,
        value: kategoria.value,
        message: "Proszę wybrać kategorię książki.",
      },
      {
        element: document.querySelector(
          'input[name="stan"]:checked'
        ) as HTMLInputElement,
        value: stan,
        message: "Proszę wybrać stan książki.",
      },
    ];

    let allFieldsFilled = true;
    requiredFields.forEach((field) => {
      const errorMessageElement = field.element
        .nextElementSibling as HTMLElement;
      if (!field.value) {
        field.element.classList.add("invalid");
        errorMessageElement.textContent = field.message;
        allFieldsFilled = false;
      } else {
        field.element.classList.remove("invalid");
        errorMessageElement.textContent = "";
      }
    });

    if (!allFieldsFilled) {
      return;
    }

    const resultDiv = document.createElement("div");
    resultDiv.classList.add("result");

    resultDiv.innerHTML = `
      <h3>Dodana książka:</h3>
      <p><strong>Tytuł:</strong> ${tytul.value}</p>
      <p><strong>Autor:</strong> ${autor.value}</p>
      <p><strong>Rok wydania:</strong> ${rok.value}</p>
      <p><strong>Kategoria:</strong> ${kategoria.value}</p>
      <p><strong>Stan książki:</strong> ${stan}</p>
      <p><strong>Notatki:</strong> ${notatki.value ? notatki.value : "Brak"}</p>
    `;

    resultsContainer.appendChild(resultDiv);
    addBookForm.reset();
  });

  const opinionForm = document.getElementById(
    "dodajOpinieForm"
  ) as HTMLFormElement;
  const opinionList = document.getElementById("lista-opinii") as HTMLElement;

  opinionForm.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const userName = document.getElementById(
      "nazwa-uzytkownika"
    ) as HTMLInputElement;
    const opinionText = document.getElementById(
      "opinia"
    ) as HTMLTextAreaElement;
    const agreementChecked = document.getElementById(
      "zgoda"
    ) as HTMLInputElement;

    // Validate required fields
    const requiredFields = [
      {
        element: userName,
        value: userName.value,
        message: "Proszę podać nazwę użytkownika.",
      },
      {
        element: opinionText,
        value: opinionText.value,
        message: "Proszę podać opinię.",
      },
      {
        element: agreementChecked,
        value: agreementChecked.checked ? "checked" : "",
        message: "Musisz wyrazić zgodę na zapoznanie się z regulaminem.",
      },
    ];

    let allFieldsFilled = true;
    requiredFields.forEach((field) => {
      const errorMessageElement = field.element
        .nextElementSibling as HTMLElement;
      if (!field.value) {
        field.element.classList.add("invalid");
        errorMessageElement.textContent = field.message;
        allFieldsFilled = false;
      } else {
        field.element.classList.remove("invalid");
        errorMessageElement.textContent = "";
      }
    });

    if (!allFieldsFilled) {
      return;
    }

    const opinionDiv = document.createElement("div");
    opinionDiv.classList.add("opinia");

    opinionDiv.innerHTML = `
      <p><strong>${userName.value}</strong>:</p>
      <p>"${opinionText.value}"</p>
    `;

    opinionList.appendChild(opinionDiv);

    opinionForm.reset();
    if (opinionList.children.length > 0) {
      const noOpinionsMessage = opinionList.querySelector("p");
      if (noOpinionsMessage) {
        noOpinionsMessage.style.display = "none";
      }
    }
  });
});
