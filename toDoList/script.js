const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");

// Nastavení výchozího prázdného pole nebo vytažení seznamu uloženého v local storage a Zachycení aktivace seznamu úkolů
const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

// Zachycení kliknutí na seznam úkolů
listsContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

// Zachycení kliknutí na button na vymazání seznamu úkolů
deleteListButton.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});

// Zachycení nového seznamu úkolů
newListForm.addEventListener("submit", (e) => {
  // Vypnutí automatického znovuobnovení stránky
  e.preventDefault();

  // Vytváření nového seznamu úkolů
  const listName = newListInput.value;
  if (listName == null || listName == "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

// Zavolání funkce save a render, aby proběhlo uložení nového seznamu do local storage
function saveAndRender() {
  save();
  render();
}

// Uložení nového seznamu úkolů a vybraného seznamu do local storage
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

// Zobrazení a skrytí podkúkolů,
function render() {
  clearElement(listsContainer);
  renderLists();

  if (selectedListId == null) {
    listDisplayContainer.style.display = "none";
  } else {
  }
}

// Vytvoření html podkladu pro nový seznam úkolů (tag li, třída, připnutí, aktivní)
function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  });
}

// Vymazání nežádoucího seznamu úkolů, které nemají v seznamu co dělat (cokoliv co není v local storage)
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
