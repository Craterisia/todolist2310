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
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);

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

// Zachycení splnění podúkolu
tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

// Zachycení kliknutí na button na vymazání splněných podúkolů
clearCompleteTasksButton.addEventListener("click", (e) => {
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
  saveAndRender();
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

// Zachycení nového podseznamu úkolů
newTaskForm.addEventListener("submit", (e) => {
  // Vypnutí automatického znovuobnovení stránky
  e.preventDefault();

  // Vytváření nového podseznamu úkolů
  const taskName = newTaskInput.value;
  if (taskName == null || taskName == "") return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find((list) => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
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

  const selectedList = lists.find((list) => list.id === selectedListId);
  if (selectedListId == null) {
    listDisplayContainer.style.display = "none";
  } else {
    // prázdný string vrátí původní hodnotu
    listDisplayContainer.style.display = "";
    // Změna názvu podúkolů
    listTitleElement.innerText = selectedList.name;
    // Počitadlo zbývajících úkolů
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

// Vytvoření podúkolů
function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
}

// Počitalo zbývajících úkolů
function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).lenght;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
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
