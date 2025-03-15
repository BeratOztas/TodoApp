
document.addEventListener("DOMContentLoaded", async function () {
    const todoList = document.querySelector("ul");
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todoText");

    //Buttons
    const deleteDoneTaskBtn = document.getElementById("delete-done-task");
    const deleteAllTaskBtn = document.getElementById("delete-all-task");
    const displayAllTasksBtn = document.getElementById("display-all-tasks");
    const displayDoneTasksBtn = document.getElementById("display-done-tasks");
    const displayTodoTasksBtn = document.getElementById("display-todo-tasks");

    // Fetch Todos with  Filtering
    const fetchTodos = async (filter = "all") => {
        try {
            let url = "/todos";
            if (filter === "done") url = "/todos?completed=true";
            if (filter === "todo") url = "/todos?completed=false";

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch todos");

            const todos = await response.json();
            
            renderTodos(todos);
        } catch (error) {
            console.error(error);
            alert("Error fetching todos. Please try again.");
        }
    }

    //Render Todo List
    const renderTodos = (todos) => {
        todoList.innerHTML = "";
        todos.forEach(todo => {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = todo.title;
            if (todo.completed) {
                span.classList.add("completed");
                span.style.color = "red";
                span.style.textDecoration = "line-through";
            }

            li.appendChild(span);

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = todo.completed ? "✔" : "⬜";
            toggleBtn.classList.add("toggle-btn");
            toggleBtn.dataset.id = todo._id;
            li.appendChild(toggleBtn);

            const editBtn = document.createElement("button");
            editBtn.textContent = "✏";
            editBtn.classList.add("edit-btn");
            editBtn.dataset.id = todo._id;
            li.appendChild(editBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.dataset.id = todo._id;
            li.appendChild(deleteBtn);

            todoList.appendChild(li);
        });
    }



    todoList.addEventListener("click", async function (event) {
        console.log(event.target);
        //Delete Todo Btn
        if (event.target.classList.contains("delete-btn")) {
            const id = event.target.dataset.id;
            try {
                await fetch(`/todos/${id}`, { method: "DELETE" });
                fetchTodos("all");
            } catch (error) {
                console.log(error);
            }
        }

        //Complete Toggle Todo Btn
        if (event.target.classList.contains("toggle-btn")) {

            const id = event.target.dataset.id;
            const span = event.target.parentElement.querySelector("span");
            const isCompleted = span.classList.contains("completed");
            try {
                const response = await fetch(`/todos/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ completed: !isCompleted })
                });
                const updatedTodo = await response.json();

                span.classList.toggle("completed");
                span.style.color = updatedTodo.completed ? "red" : "black";
                span.style.textDecoration = updatedTodo.completed ? "line-through" : "none";
                event.target.textContent = updatedTodo.completed ? "✔" : "⬜";
                fetchTodos("all");
            } catch (error) {
                console.log(error);
            }

        }

        //Edit Todo Btn
        if (event.target.classList.contains("edit-btn")) {
            console.log("⏳ Toggle butonuna basıldı, fetch çağrılacak...");
            const id = event.target.dataset.id;
            const todoItem = event.target.parentElement.querySelector("span");
            const newText = prompt("Update Todo:", todoItem.textContent);
            if (newText !== null && newText.trim() !== "") {
                await fetch(`/todos/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: newText })
                });
                fetchTodos("all");
            }
        }
    });

    //Add Todo Btn
    todoForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (event.submitTriggered) return;
        event.submitTriggered = true;

        const todoText = todoInput.value.trim();
        if (!todoText) return;

        try {
            await fetch("/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: todoText })
            });
            todoInput.value = "";
            fetchTodos("all");
        } catch (error) {
            console.log("Error submitting", error);
        }
    });

    //Delete-Done-Tasks Btn
    deleteDoneTaskBtn.addEventListener("click", async function () {
        try {
            await fetch("/todos/completed", { method: "DELETE" });
            fetchTodos("all");
        } catch (error) {
            console.log(error);
        }
    });

    //Delete-All-Tasks Btn
    deleteAllTaskBtn.addEventListener("click", async function () {
        try {
            await fetch("/todos/all", { method: "DELETE" });
            fetchTodos("all");
        } catch (error) {
            console.log(error);
        }
    });

    displayAllTasksBtn.addEventListener("click", () => fetchTodos("all"));
    displayDoneTasksBtn.addEventListener("click", () => fetchTodos("done"));
    displayTodoTasksBtn.addEventListener("click", () => fetchTodos("todo"));

    fetchTodos("all");
}); 