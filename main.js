let app = document.querySelector('.app');
let image = document.querySelector('.app .image');
let img = document.querySelector('.app .image img');
let icon = document.querySelector('.app .icon');
let moon = document.querySelector('.app .icon .moon');
let sun = document.querySelector('.app .icon .sun');
let add = document.querySelector('.app .add');
let input = document.querySelector('.app .add input');
let submitText = document.querySelector('.app .add .submit');
let list = document.querySelector('.app .list');
let tasks = document.querySelector('.app .list .tasks');
let task = document.querySelectorAll('.app .list .tasks .task');
let done = document.querySelectorAll('.app .list .tasks .task .submit');
let del = document.querySelector('.app .list .tasks .task .delete');
let count = document.querySelector('.stats .count');
let countSpan = document.querySelector('.stats .count span');
let filter = document.querySelector('.stats .filter');
let ele = document.querySelectorAll('.stats .filter .ele');
let all = document.querySelector('.stats .filter .all');
let active = document.querySelector('.stats .filter .active');
let completed = document.querySelector('.stats .filter .completed');

let clear = document.querySelector('.stats .clear');
// up button 
let up = document.querySelector("#up-scroll");
up.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
let down = document.querySelector("#down-scroll");
down.onclick = function () {
  window.scrollTo(0, document.body.scrollHeight);
};




// Empty Array To Store The Tasks

let arr = [];


// Check if Theres Tasks In Local Storage
if (localStorage.getItem('Tasks')) {
  arr = JSON.parse(localStorage.getItem("Tasks"));
}
// get Tasks from Local Storage
getData();

// count uncompleted tasks
countTasks(arr);

// Add Task with click
submitText.onclick = function () {
  if (input.value !== '') {
    addToArr(input.value);
    input.value = "";
    // count uncompleted tasks
    countTasks(arr);
  }

};
// Add Task with enter

document.onkeyup = function (e) {
  if (e.key == "Enter") {
    if (input.value !== '') {
      addToArr(input.value);
      input.value = "";
      // count uncompleted tasks
      countTasks(arr);
    }
  }
};
// click on task element

tasks.addEventListener("click", (e) => {
  // delete button
  if (e.target.classList.contains('delete')) {
    // delete task from Local storage
    deleteTask(e.target.parentElement.getAttribute("data-id"));
    // delete task from page
    e.target.parentElement.remove();
  }

  // complete status
  if (e.target.classList.contains('submit')) {
    taskStatus(e.target.parentElement.getAttribute("data-id"));
    e.target.parentElement.classList.toggle('done');
  } else if (e.target.classList.contains('done-icon')) {
    taskStatus(e.target.parentElement.parentElement.getAttribute("data-id"));
    e.target.parentElement.parentElement.classList.toggle('done');
  }
})
// Start toggle light-dark mode

icon.addEventListener('click', function toggleDark() {

  // light mode
  if (moon.classList.contains('active-icon')) {
    moon.classList.remove('active-icon');
    sun.classList.add('active-icon');
    app.classList.add('dark');
    img.classList.add('dark');
    image.classList.add('dark');
    add.classList.add('dark');
    input.classList.add('dark');
    list.classList.add('dark');
    count.classList.add('dark');
    filter.classList.add('dark');
    clear.classList.add('dark');
    task.forEach(e => {
      e.classList.add('dark');
    });


    // dark mode
  } else {
    sun.classList.remove('active-icon');
    moon.classList.add('active-icon');
    app.classList.remove('dark');
    img.classList.remove('dark');
    image.classList.remove('dark');
    add.classList.remove('dark');
    input.classList.remove('dark');
    list.classList.remove('dark');
    count.classList.remove('dark');
    filter.classList.remove('dark');
    clear.classList.remove('dark');
    task.forEach(e => {
      e.classList.remove('dark');
    });
  }
});

// End dark toggle light-dark mode
// clear completed
clear.addEventListener("click", () => {
  clearCompleted(arr);
});

// filter all-active-completed

ele.forEach((a) => {
  a.addEventListener('click', (e) => {
    ele.forEach(el => el.classList.remove('choosen'))
    e.currentTarget.classList.add('choosen');
    if (all.classList.contains('choosen')) {
      appendTask(arr);
    }
    else if (active.classList.contains('choosen')) {
      let activeArray = arr.filter(e => e.completed == false)
      appendTask(activeArray);

    }
      
    else if (completed.classList.contains('choosen')) {
      let CompletedArray = arr.filter(e => e.completed == true)
      appendTask(CompletedArray);
      
    } else {
      appendTask(arr);
    }
    saveData(arr);
  });
});





//  add tasks to array
function addToArr(text) {
  const data = {
    id: Date.now(),
    title: text,
    completed: false,
  };
  // push tasks to arr
  arr.push(data);
  // add tasks to page
  appendTask(arr);
  // Add Tasks to Local Storage
  saveData(arr);

};
// add tasks to page
function appendTask(arr) {

  tasks.innerHTML = '';
  arr.forEach((task) => {

    // create div
    let div = document.createElement('div');
    div.classList.add('task');
    div.setAttribute("data-id", task.id);
    div.appendChild(document.createTextNode(task.title));
    if (task.completed) {
      div.classList.add('done');
    }
    // create submit icon
    let submitIcon = document.createElement('div');
    submitIcon.classList.add('submit');
    let icon = document.createElement('i')
    icon.className = "fa-solid fa-check done-icon";
    submitIcon.appendChild(icon);
    div.appendChild(submitIcon);
    // delete div
    darkDiv(div);
    let iconX = document.createElement('i')
    iconX.className = "fa-solid fa-x delete";
    div.appendChild(iconX);
    tasks.appendChild(div);
  });
}
//give toggle light-dark mode for new tasks
function darkDiv(div) {
  icon.addEventListener('click', function toggleDark() {
    // light mode
    if (moon.classList.contains('active-icon')) {

      div.classList.remove('dark');

      // dark mode
    } if (sun.classList.contains('active-icon')) {

      div.classList.add('dark');
    }
  });
};


// save tasks in local storage
function saveData(arr) {
  window.localStorage.setItem("Tasks", JSON.stringify(arr));
}
//  get tasks from local storage
function getData() {
  let data = window.localStorage.getItem("Tasks");
  if (data) {
    let tasks = JSON.parse(data);
    appendTask(tasks);
  }
}
// delete task in local storage
function deleteTask(taskId) {
  arr = arr.filter((task) => task.id != taskId);
  countTasks(arr);
  saveData(arr);
}
// change status 
function taskStatus(taskId2) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id == taskId2) {
      arr[i].completed == false ? (arr[i].completed = true) : (arr[i].completed = false)
    }
    // count tasks
    countTasks(arr);
  }
  saveData(arr);
}

// count tasks 
function countTasks(arr) {
  countSpan.textContent = 0;
  for (let i = 0; i < arr.length; i++) {
    let res = arr.filter((task) => task.completed == false);
    countSpan.textContent = res.length;
  }
  saveData(arr);
}
// clear complete tasks from local storage
function clearCompleted(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr = arr.filter((task) => task.completed == false);
    appendTask(arr);
  }
  saveData(arr);
}



