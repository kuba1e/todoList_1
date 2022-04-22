"use strict";

document.addEventListener("DOMContentLoaded", (event) => {
  const rootElement = document.querySelector(".main");
  let todoItemsArray = JSON.parse(localStorage.getItem("todos")) ?? [];
  const filters = [
    {
      label: "All",
      checked: true,
      filterValue: "all",
    },
    {
      label: "Active",
      checked: false,
      filterValue: "active",
    },
    {
      label: "Completed",
      checked: false,
      filterValue: "completed",
    },
  ];

  const {
    todoAddForm,
    todoSelectAllBtn,
    todoItemsList,
    todoCountInfo,
    todoCountInfoText,
    todoFooter: todoControl,
    clearBtn,
  } = initApp(rootElement, todoItemsArray);

  function initApp(rootElement, todos) {
    const fragment = document.createDocumentFragment();
    const todoElement = document.createElement("div");
    const todoHeader = getTodoHeader();
    const {
      todoContentContainer: todoBody,
      todoAddForm,
      todoSelectAllBtn,
      todoAddFormInput,
      todoItemsList,
    } = getTodoBody(todos);

    const {
      footerContainer: todoFooter,
      todoCountInfo,
      todoCountInfoText,
      clearBtn,
    } = getFooter(filters, todos);

    todoElement.classList.add("todo");

    renderTodoItems(
      todoItemsArray,
      todoItemsList,
      todoCountInfo,
      todoCountInfoText,
      todoFooter,
      clearBtn
    );

    todoBody.append(todoFooter);

    todoElement.append(todoHeader, todoBody);

    fragment.append(todoElement);

    rootElement.append(fragment);

    return {
      todoAddForm,
      todoSelectAllBtn,
      todoAddFormInput,
      todoItemsList,
      todoCountInfo,
      todoCountInfoText,
      todoFooter,
      clearBtn,
    };
  }

  function getFooter(filters, todos) {
    const footerContainer = document.createElement("div");

    const todoCount = document.createElement("div");
    const todoCountInfo = document.createElement("span");
    const todoCountInfoText = document.createElement("span");

    const filtersList = getFilters(filters);

    const clearBtn = document.createElement("button");

    footerContainer.classList.add("todo__control");

    todoCount.classList.add("todo__control-count");
    todoCountInfo.classList.add("todo__control-count-info");
    todoCountInfoText.classList.add("todo__control-count-info-text");

    clearBtn.classList.add("todo__control-clear-btn");

    todoCountInfo.textContent = getTodoCount(todos);

    todoCountInfoText.textContent = getCountLabel(todos);

    todoCount.textContent = "left";

    clearBtn.textContent = "Clear completed";

    if (todos.length - getTodoCount(todos)) {
      clearBtn.classList.add("active");
    }

    todoCount.prepend(todoCountInfo, todoCountInfoText);

    footerContainer.append(todoCount, filtersList, clearBtn);

    return { footerContainer, todoCountInfo, todoCountInfoText, clearBtn };
  }

  function getTodoHeader() {
    const todoTitleContainer = document.createElement("div");
    const todoTitleText = document.createElement("h1");
    todoTitleContainer.classList.add("todo__title");
    todoTitleText.classList.add("todo__title-text");
    todoTitleText.textContent = "todos";
    todoTitleContainer.append(todoTitleText);
    return todoTitleContainer;
  }

  function getTodoBody(todos) {
    const todoContentContainer = document.createElement("div");

    const todoAddFormContainer = document.createElement("div");
    const todoAddForm = document.createElement("form");
    const todoSelectAllBtn = document.createElement("button");
    const todoAddFormInput = document.createElement("input");

    const todoListContainer = document.createElement("div");
    const todoItemsList = document.createElement("ul");

    todoContentContainer.classList.add("todo__content");
    todoAddFormContainer.classList.add("todo__form-container");
    todoAddForm.classList.add("todo__form");
    todoSelectAllBtn.classList.add("todo__select-all-btn");
    if (!(todos.length - getDoneCount(todos)) && todos.length > 0) {
      todoSelectAllBtn.classList.add("selected");
    }

    todoAddFormInput.classList.add("todo__form-input");
    todoItemsList.classList.add("todo__item-list");

    todoAddFormInput.setAttribute("placeholder", "What needs to be done?");
    todoAddFormInput.setAttribute("name", "todo");

    todoListContainer.append(todoItemsList);
    todoAddForm.append(todoAddFormInput);
    todoAddFormContainer.append(todoSelectAllBtn, todoAddForm);
    todoContentContainer.append(todoAddFormContainer, todoListContainer);
    return {
      todoContentContainer,
      todoAddForm,
      todoSelectAllBtn,
      todoAddFormInput,
      todoItemsList,
    };
  }

  function getFilters(filters) {
    const filterList = document.createElement("ul");

    filters.forEach(({ label, checked, filterValue }) => {
      const filter = document.createElement("li");
      const filterLabel = document.createElement("span");

      filter.classList.add("todo__control-filter-list-item");

      if (checked) {
        filter.classList.add("checked");
      }
      filterLabel.classList.add("todo__control-filter-item-label");

      filterLabel.textContent = label;

      filter.dataset.filter = filterValue;

      filter.append(filterLabel);

      filterList.append(filter);
    });

    filterList.classList.add("todo__control-filter-list");

    return filterList;
  }

  const onCreateTodo = (label, todos) => {
    return {
      done: false,
      label,
      id: generateId(todos),
    };
  };

  const onDeleteTodo = (id, todos) => {
    const elementIndex = getTodoIndex(id, todos);
    todos.splice(elementIndex, 1);
  };

  const onClearDoneTodos = (todos) => {
    return todos.filter((todo) => !todo.done);
  };

  const onToggleDone = (id, todos) => {
    const elementIndex = getTodoIndex(id, todos);

    todos[elementIndex].done = !todos[elementIndex].done;
  };

  function getTodoIndex(id, todos) {
    return todos.findIndex((todo) => todo.id === +id);
  }

  const saveToLocalStorage = (todos) => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const generateId = (todos) => {
    const todosLength = todos.length;
    if (!todosLength) {
      return 1;
    } else {
      return todos.at(-1).id + 1;
    }
  };

  function getCheckbox(done) {
    const checkboxContainer = document.createElement("div");
    const checkboxLabel = document.createElement("label");
    const checkboxInput = document.createElement("input");
    const checkboxIndicator = document.createElement("div");

    checkboxContainer.classList.add("todo__item-control");
    checkboxLabel.classList.add("control", "control-checkbox");
    checkboxInput.classList.add("control__input");
    checkboxIndicator.classList.add("control_indicator");

    checkboxInput.setAttribute("type", "checkbox");
    if (done) {
      checkboxInput.setAttribute("checked", "");
    }

    checkboxLabel.append(checkboxInput, checkboxIndicator);
    checkboxContainer.append(checkboxLabel);

    return checkboxContainer;
  }

  function getDeleteBtn() {
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn", "todo__item-delete-btn");
    return deleteBtn;
  }

  function getTodoCount(todos) {
    return todos.filter((todo) => !todo.done).length;
  }

  function getDoneCount(todos) {
    return todos.filter((todo) => todo.done).length;
  }

  function getCountLabel(todos) {
    return getTodoCount(todos) > 1 ? "items" : "item";
  }

  function updateTodoCount(todos, todoCountInfo, todoCoutInfoLabel) {
    todoCountInfo.textContent = getTodoCount(todos);
    todoCoutInfoLabel.textContent = getCountLabel(todos);
  }

  function prepareArrayForRender(todos, todoControl) {
    const filterKey = todoControl.querySelector(".checked").dataset.filter;
    let filteredTodos = [];

    switch (filterKey) {
      case "all":
        filteredTodos = todos;
        break;
      case "active":
        filteredTodos = todos.filter((todo) => !todo.done);
        break;
      case "completed":
        filteredTodos = todos.filter((todo) => todo.done);
        break;
    }

    return filteredTodos;
  }

  const updateFiltersView = (filtersList, checkedFilter) => {
    [
      ...filtersList.querySelectorAll(".todo__control-filter-list-item"),
    ].forEach((filter) => {
      filter.classList.remove("checked");
    });

    checkedFilter.classList.add("checked");
  };

  function renderTodoItems(
    todos,
    parentElement,
    todoCountInfo,
    todoCountInfoText,
    todoControl,
    clearBtn
  ) {
    const fragment = document.createDocumentFragment();
    let filteredTodos = prepareArrayForRender(todos, todoControl);

    filteredTodos.forEach(({ label, id, done }) => {
      const todoListItem = document.createElement("li");
      const todoListItemText = document.createElement("p");

      const deleteBtn = getDeleteBtn();

      todoListItem.classList.add("todo__item");

      todoListItemText.classList.add("todo__item-text");

      todoListItem.dataset.id = id;

      todoListItem.addEventListener("mouseover", () =>
        deleteBtn.classList.toggle("active")
      );
      todoListItem.addEventListener("mouseout", () =>
        deleteBtn.classList.toggle("active")
      );

      todoListItemText.textContent = label;
      if (done) {
        todoListItemText.classList.add("done");
      }

      todoListItem.append(getCheckbox(done), todoListItemText, deleteBtn);
      fragment.append(todoListItem);
    });

    if (todos.length - getTodoCount(todos) && todos.length > 0) {
      console.log(todos.length - getTodoCount(todos) && todos.length > 0);
      clearBtn.classList.add("active");
    } else {
      clearBtn.classList.remove("active");
    }

    parentElement.innerHTML = "";
    parentElement.append(fragment);
    updateTodoCount(todos, todoCountInfo, todoCountInfoText);
  }

  todoAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const { target } = event;
    const label = target.elements["todo"].value;
    target.reset();
    const todo = onCreateTodo(label, todoItemsArray);
    todoItemsArray.push(todo);
    saveToLocalStorage(todoItemsArray);
    renderTodoItems(
      todoItemsArray,
      todoItemsList,
      todoCountInfo,
      todoCountInfoText,
      todoControl,
      clearBtn
    );
  });

  todoSelectAllBtn.addEventListener("click", ({ target }) => {
    if (target.classList.contains("selected")) {
      todoItemsArray.forEach((todo) => {
        todo.done = false;
      });
    } else {
      todoItemsArray.forEach((todo) => {
        todo.done = true;
      });
    }

    target.classList.toggle("selected");
    saveToLocalStorage(todoItemsArray);

    renderTodoItems(
      todoItemsArray,
      todoItemsList,
      todoCountInfo,
      todoCountInfoText,
      todoControl,
      clearBtn
    );
  });

  todoItemsList.addEventListener("click", ({ target }) => {
    const classList = target.classList;
    if (classList.contains("todo__item-delete-btn")) {
      const id = target.closest(".todo__item").dataset.id;
      onDeleteTodo(id, todoItemsArray);
      saveToLocalStorage(todoItemsArray);
      renderTodoItems(
        todoItemsArray,
        todoItemsList,
        todoCountInfo,
        todoCountInfoText,
        todoControl,
        clearBtn
      );
    }
  });

  todoItemsList.addEventListener("change", ({ target }) => {
    const id = target.closest(".todo__item").dataset.id;
    onToggleDone(id, todoItemsArray);
    saveToLocalStorage(todoItemsArray);
    renderTodoItems(
      todoItemsArray,
      todoItemsList,
      todoCountInfo,
      todoCountInfoText,
      todoControl,
      clearBtn
    );
  });

  todoControl.addEventListener("click", ({ target }) => {
    if (target.closest(".todo__control-clear-btn")) {
      todoItemsArray = onClearDoneTodos(todoItemsArray);
      saveToLocalStorage(todoItemsArray);
      renderTodoItems(
        todoItemsArray,
        todoItemsList,
        todoCountInfo,
        todoCountInfoText,
        todoControl,
        clearBtn
      );
    } else if (target.classList.contains("todo__control-filter-item-label")) {
      const filterItem = target.parentElement;
      updateFiltersView(todoControl, filterItem);
      renderTodoItems(
        todoItemsArray,
        todoItemsList,
        todoCountInfo,
        todoCountInfoText,
        todoControl,
        clearBtn
      );
    }
  });
});
