var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
function searchBooks(query) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://openlibrary.org/search.json?q=".concat(query))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Problem z połączeniem z API");
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.docs.map(function (book) {
                            var _a;
                            return ({
                                title: book.title,
                                author: ((_a = book.author_name) === null || _a === void 0 ? void 0 : _a[0]) || "Nieznany autor",
                                year: parseInt(book.first_publish_year) || 0,
                            });
                        })];
            }
        });
    });
}
function getOrCreateResultsSection() {
    var resultsSection = document.getElementById("wyniki-wyszukiwania");
    if (!resultsSection) {
        resultsSection = document.createElement("section");
        resultsSection.id = "wyniki-wyszukiwania";
        resultsSection.innerHTML = "\n                  <h2>Wyniki wyszukiwania</h2>\n                  <div id=\"wyniki-container\"></div>\n              ";
        var searchSection = document.getElementById("szukaj-ksiazki");
        if (searchSection) {
            searchSection.insertAdjacentElement("afterend", resultsSection);
        }
    }
    return resultsSection.querySelector("#wyniki-container");
}
function clearResultsContainer(resultsContainer) {
    resultsContainer.innerHTML = "";
}
function displayBooks(books, resultsContainer) {
    clearResultsContainer(resultsContainer);
    var resultsList = document.createElement("ul");
    books.forEach(function (book) {
        var listItem = document.createElement("li");
        listItem.textContent = "".concat(book.title, " - ").concat(book.author, " (").concat(book.year, ")");
        resultsList.appendChild(listItem);
    });
    resultsContainer.appendChild(resultsList);
}
function displayNoBooksFound(resultsContainer) {
    clearResultsContainer(resultsContainer);
    var noBooksMessage = document.createElement("p");
    noBooksMessage.textContent = "Brak książek w tych kryteriach.";
    noBooksMessage.style.color = "red";
    noBooksMessage.style.fontWeight = "bold";
    resultsContainer.appendChild(noBooksMessage);
}
document.addEventListener("DOMContentLoaded", function () {
    var searchForm = document.getElementById("wyszukajKsiazkeForm");
    searchForm.addEventListener("submit", function (event) { return __awaiter(_this, void 0, void 0, function () {
        var queryInput, yearFromInput, yearToInput, query, yearFrom, yearTo, resultsContainer, loadingMessage, books, filteredBooks, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    queryInput = document.getElementById("tytul-wyszukiwanie");
                    yearFromInput = document.getElementById("rok-od");
                    yearToInput = document.getElementById("rok-do");
                    query = queryInput.value.trim();
                    yearFrom = yearFromInput.value ? parseInt(yearFromInput.value) : null;
                    yearTo = yearToInput.value ? parseInt(yearToInput.value) : null;
                    resultsContainer = getOrCreateResultsSection();
                    loadingMessage = document.createElement("p");
                    loadingMessage.textContent = "Ładowanie wyników...";
                    resultsContainer.innerHTML = "";
                    resultsContainer.appendChild(loadingMessage);
                    if (!query) {
                        displayNoBooksFound(resultsContainer);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, searchBooks(query)];
                case 2:
                    books = _a.sent();
                    filteredBooks = books.filter(function (book) {
                        var matchesYear = (!yearFrom || book.year >= yearFrom) &&
                            (!yearTo || book.year <= yearTo);
                        return matchesYear;
                    });
                    if (filteredBooks.length === 0) {
                        displayNoBooksFound(resultsContainer);
                    }
                    else {
                        displayBooks(filteredBooks, resultsContainer);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Błąd podczas wyszukiwania książek:", error_1);
                    errorMessage = document.createElement("p");
                    errorMessage.textContent =
                        "Nie udało się wyszukać książek. Spróbuj ponownie później.";
                    errorMessage.style.color = "red";
                    errorMessage.style.fontWeight = "bold";
                    clearResultsContainer(resultsContainer);
                    resultsContainer.appendChild(errorMessage);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    var addBookForm = document.getElementById("dodajKsiazkeForm");
    var addBookSection = document.getElementById("dodaj-ksiazke");
    var resultsContainer = document.createElement("div");
    resultsContainer.id = "resultsContainer";
    addBookSection.insertAdjacentElement("beforeend", resultsContainer);
    function validateRadioButtons() {
        var radios = document.getElementsByName("stan");
        var formValid = false;
        var errorMessageElement = document.querySelector(".error-message.stan");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                formValid = true;
                break;
            }
        }
        if (errorMessageElement) {
            if (!formValid) {
                errorMessageElement.textContent = "Proszę wybrać stan książki.";
                errorMessageElement.style.display = "block";
            }
            else {
                errorMessageElement.textContent = "";
                errorMessageElement.style.display = "none";
            }
        }
        return formValid;
    }
    addBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var tytul = document.getElementById("tytul");
        var autor = document.getElementById("autor");
        var rok = document.getElementById("rok");
        var kategoria = document.getElementById("kategoria");
        var stanInputs = document.getElementsByName("stan");
        var notatki = document.getElementById("notatki");
        var stan = "";
        stanInputs.forEach(function (input) {
            if (input.checked) {
                stan = input.value;
            }
        });
        var requiredFields = [
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
        ];
        var allFieldsFilled = true;
        requiredFields.forEach(function (field) {
            var errorMessageElement = field.element
                .nextElementSibling;
            if (!field.value) {
                field.element.classList.add("invalid");
                errorMessageElement.textContent = field.message;
                errorMessageElement.style.display = "block";
                allFieldsFilled = false;
            }
            else {
                field.element.classList.remove("invalid");
                errorMessageElement.textContent = "";
                errorMessageElement.style.display = "none";
            }
        });
        if (!allFieldsFilled) {
            return;
        }
        if (!validateRadioButtons()) {
            return;
        }
        var resultDiv = document.createElement("div");
        resultDiv.classList.add("result");
        resultDiv.innerHTML = "\n      <h3>Dodana ksi\u0105\u017Cka:</h3>\n      <p><strong>Tytu\u0142:</strong> ".concat(tytul.value, "</p>\n      <p><strong>Autor:</strong> ").concat(autor.value, "</p>\n      <p><strong>Rok wydania:</strong> ").concat(rok.value, "</p>\n      <p><strong>Kategoria:</strong> ").concat(kategoria.value, "</p>\n      <p><strong>Stan ksi\u0105\u017Cki:</strong> ").concat(stan, "</p>\n      <p><strong>Notatki:</strong> ").concat(notatki.value ? notatki.value : "Brak", "</p>\n    ");
        resultsContainer.appendChild(resultDiv);
        addBookForm.reset();
        document.querySelectorAll(".error-message").forEach(function (el) {
            el.textContent = "";
            el.style.display = "none";
        });
    });
    var opinionForm = document.getElementById("dodajOpinieForm");
    var opinionList = document.getElementById("lista-opinii");
    opinionForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var userName = document.getElementById("nazwa-uzytkownika");
        var opinionText = document.getElementById("opinia");
        var requiredFields = [
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
        ];
        var allFieldsFilled = true;
        requiredFields.forEach(function (field) {
            var errorMessageElement = field.element
                .nextElementSibling;
            if (!field.value) {
                field.element.classList.add("invalid");
                errorMessageElement.textContent = field.message;
                errorMessageElement.style.display = "block";
                allFieldsFilled = false;
            }
            else {
                field.element.classList.remove("invalid");
                errorMessageElement.textContent = "";
                errorMessageElement.style.display = "none";
            }
        });
        if (!allFieldsFilled) {
            return;
        }
        var opinionDiv = document.createElement("div");
        opinionDiv.classList.add("opinia");
        opinionDiv.innerHTML = "\n      <p><strong>".concat(userName.value, "</strong>:</p>\n      <p>\"").concat(opinionText.value, "\"</p>\n    ");
        opinionList.appendChild(opinionDiv);
        opinionForm.reset();
        document.querySelectorAll(".error-message").forEach(function (el) {
            el.textContent = "";
            el.style.display = "none";
        });
        if (opinionList.children.length > 0) {
            var noOpinionsMessage = opinionList.querySelector("p");
            if (noOpinionsMessage) {
                noOpinionsMessage.style.display = "none";
            }
        }
    });
});