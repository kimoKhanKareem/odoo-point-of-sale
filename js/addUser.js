const form = document.querySelector("[data-form]");
const input = document.querySelector("[data-input]");
const attention = document.querySelector(".attention")
const lists = document.querySelector("[data-lists]");

let todoUser = [];

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let id = Date.now();
    const todo = new Todo(id, input.value);
    todoUser = [...todoUser, todo];
    AD.displayUsers()
});

class Todo {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class AD {
    static displayUsers() {
        let disUsers = ""
        todoUser.map((item) => {
            return disUsers += `
                <li >
                    <a href="#">
                        ${item.name}
                    </a>
                </li>

            `
        });
        lists.innerHTML = disUsers;
    }
}

// document.addEventListener("DOMContentLoaded", () => {
//     const ad = new AD();
// })