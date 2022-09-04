"use strict";

// HTML selectors
//-----------------------------------------------------------
const date = document.querySelector(".date");
const inputField = document.querySelector(".inputField");
const addNewItemButton = document.querySelector(".addNewItem");

const pendingCounter = document.querySelector(".pendingCounter");
const completedCounter = document.querySelector(".completedCounter");
const pendingItemsContainer = document.querySelector(
  ".container__pendingItems"
);
const completedItemsContainer = document.querySelector(
  ".container__completedItems"
);
const hideShowCompletedButton = document.querySelector(".hideShow");
const clearAllButton = document.querySelector(".clear");

const partyTime = document.querySelector(".rainbow");

let itemContents;
let deleteButtons;
let pendingItems;
let checkboxes;

let completedItems;

let refreshCounters;
let storageItem = [];

// Global variables
//-----------------------------------------------------------
let pendingItemCount = 0;
let completedItemCount = 0;
let completionPercentage;

// HTML templates
//-----------------------------------------------------------
const pendingItemTemplate = `
    <input class="checkbox" type="checkbox"/>
    <div class="item_content"></div>
    <button class="button__delete">
        <i class="fa fa-trash" aria-hidden="true"></i>
    </button>
`;

const completedItemTemplate = `
    <input class="checkbox" type="checkbox" checked disabled />
    <div style='text-decoration-line: line-through' class="item_content"></div>   
`;

// Date calculation and display logic
//-----------------------------------------------------------
const options = {
  weekday: "long",
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
};
const displayDate = new Date().toLocaleDateString("en-US", options);

date.innerHTML = displayDate;

//Refresh counter display logic
//-----------------------------------------------------------

(refreshCounters = () => {
  pendingCounter.innerHTML = `You have ${pendingItemCount} pending item/s left.`;

  if (pendingItemCount === 0) {
    partyTime.innerHTML = "🌈";
    partyTime.style.display = "block";
  } else {
    partyTime.style.display = "none";
  }
  if (pendingItemCount + completedItemCount === 0) {
    completedCounter.innerHTML = "You have no completed tasks";
  } else {
    completionPercentage =
      (completedItemCount / (pendingItemCount + completedItemCount)) * 100;
    completedCounter.innerHTML = `You have completed ${Math.trunc(
      completionPercentage
    )}% of your tasks.`;
  }
})();

// Hide/show completed button event listener
//-----------------------------------------------------------
let isVisible = true;

hideShowCompletedButton.addEventListener("click", () => {
  if (isVisible) {
    isVisible = false;
    hideShowCompletedButton.innerHTML = "Show Completed";
    completedItemsContainer.style.visibility = "hidden";
  } else {
    isVisible = true;
    hideShowCompletedButton.innerHTML = "Hide Completed";
    completedItemsContainer.style.visibility = "visible";
  }
});

// Generate new event listeners for each todo task
//-----------------------------------------------------------
const generateNewEventListeners = (item) => {
  const checkbox = item.children[0];
  const trash = item.children[2];

  item.addEventListener("mouseover", () => {
    trash.style.visibility = "visible";
  });

  item.addEventListener("mouseleave", () => {
    trash.style.visibility = "hidden";
  });

  trash.addEventListener("click", (e) => {
    const itemContent = item.children[1].innerHTML;
    e.target.parentElement.parentElement.remove();
    pendingItemCount--;
    refreshCounters();

    storageItem = storageItem.filter((el) => el.todo !== itemContent);
    storeTask();
  });

  checkbox.addEventListener("click", (e) => {
    const targetItem = e.target.parentElement;
    const targetContent = targetItem.children[1].innerHTML;

    const completedItem = document.createElement("div");
    completedItem.innerHTML = completedItemTemplate;
    completedItem.classList.add("completedItem");
    completedItemsContainer.appendChild(completedItem);
    completedItems = document.querySelectorAll(".completedItem");
    completedItemCount++;
    pendingItemCount--;
    refreshCounters();

    targetItem.remove();

    storageItem.find((el) => el.todo === targetContent).completed = true;
    storeTask();

    refreshCounters();

    completedItems[completedItems.length - 1].children[1].innerHTML =
      targetContent;
  });
};

// Create new pending task logic
//------------------------------------------------------
const createPendingTask = (todo) => {
  const pendingItem = document.createElement("div");
  pendingItem.innerHTML = pendingItemTemplate;
  pendingItem.classList.add("pendingItem");
  pendingItemsContainer.appendChild(pendingItem);
  pendingItemCount++;
  refreshCounters();
  itemContents = document.querySelectorAll(".item_content");
  pendingItems = document.querySelectorAll(".pendingItem");

  const lastElement = pendingItemCount - 1;
  itemContents[lastElement].innerHTML = todo;

  const item = pendingItems[lastElement];

  storageItem.push({ todo: todo, completed: false });

  generateNewEventListeners(item);
  storeTask();
};

// Main logic - add new item event listener
//-----------------------------------------------------------
addNewItemButton.addEventListener("click", () => {
  const userTask = inputField.value;
  if (!userTask) {
    inputField.setAttribute("placeholder", "Give me something to do!");
  } else {
    inputField.value = "";
    createPendingTask(userTask);
  }
});

// Local storage logic
//-----------------------------------------------------------
const storeTask = () => {
  localStorage.setItem("todoList", JSON.stringify(storageItem));
};

const loadStorage = () => {
  const todoObject = JSON.parse(localStorage.getItem("todoList" || []));

  todoObject?.forEach((todo) => {
    storageItem.push(todo);
    if (todo.completed === false) {
      const pendingItem = document.createElement("div");
      pendingItem.innerHTML = pendingItemTemplate;
      pendingItem.classList.add("pendingItem");
      pendingItemsContainer.appendChild(pendingItem);
      pendingItemCount++;
      refreshCounters();
      itemContents = document.querySelectorAll(".item_content");
      pendingItems = document.querySelectorAll(".pendingItem");
      itemContents[pendingItemCount - 1].innerHTML = todo.todo;

      const lastElement = pendingItemCount - 1;

      const item = pendingItems[lastElement];
      generateNewEventListeners(item);
    }
    if (todo.completed === true) {
      const completedItem = document.createElement("div");
      completedItem.innerHTML = completedItemTemplate;
      completedItem.classList.add("completedItem");
      completedItemsContainer.appendChild(completedItem);
      completedItems = document.querySelectorAll(".completedItem");
      completedItemCount++;
      refreshCounters();
      completedItems[completedItems.length - 1].children[1].innerHTML =
        todo.todo;
    }
  });
};

// Clear button logic
//-----------------------------------------------------------
clearAllButton.addEventListener("click", () => {
  pendingItemCount = 0;
  completedItemCount = 0;
  localStorage.clear();
  loadStorage();
  document.location.reload();
});

// Load localstorage when page loads
//-----------------------------------------------------------
loadStorage();

// animációk :(
