import {
  add, all, app, completed, countSpan, list, down, filter,
  icon, image, clear, count, img, input, moon, sun,
  task, tasks, submitText, cancelEdit, active,
} from './elements';

// const mode = localStorage.getItem('Mode');
const doneSound = new Audio('appears-142455.mp3');
let arr = getArray() || [];
saveData();
export function getAppMode() {
  return localStorage.getItem('appMode');
}
export function saveAppMode(appMode) {
  localStorage.setItem('appMode', appMode);
}
export function emptyList() {
  if (tasks.innerHTML === '') {
    tasks.classList.add('empty');
  } else {
    tasks.classList.remove('empty');
  }
}
export function checkDown() {
  if (document.body.scrollHeight > 1000) {
    down.classList.add('show');
  } else {
    down.classList.remove('show');
  }
}
export function getData() {
  arr = JSON.parse(localStorage.getItem('Tasks'));
  appendTask(arr);
  console.log('from getData', arr);
}
export function getArray() {
  const array = JSON.parse(localStorage.getItem('Tasks'));
  return array;
}
export function countTasks() {
  countSpan.textContent = 0;
  const countUncompletedTasks = arr.filter((Task) => Task.completed === false);
  countSpan.textContent = countUncompletedTasks.length;
  saveData();
  emptyList();
  checkDown();
}
export function checkComplete() {
  // there are  completed tasks
  if (arr.some((e) => e.completed === true)) {
    completed.classList.remove('disabled');
  }
  // there are no completed tasks
  if (arr.every((e) => e.completed === false)) {
    completed.classList.add('disabled');
    completed.classList.remove('choosen');
    all.classList.add('choosen');
  }
}
export function clearCompleted() {
  arr = arr.filter((Task) => !Task.completed);
  saveData();
  emptyList();
  checkComplete();
  checkDown();
  appendTask(arr);
}
export function saveData(Arr) {
  localStorage.setItem('Tasks', JSON.stringify(Arr || arr));
  arr = JSON.parse(localStorage.getItem('Tasks'));
}
export function addToArr(text) {
  const data = {
    id: Date.now(),
    title: text,
    completed: false,
  };
  arr.push(data);

  saveData(arr);
  appendTask(arr);
}
export function deleteTask(taskId) {
  const taskToBeRemoved = arr.find((e) => e.id == taskId);
  arr.splice(arr.findIndex((a) => a.id === taskToBeRemoved.id), 1);

  saveData(arr);
  countTasks();
  emptyList();
  checkComplete();
  checkDown();
  appendTask(arr);
}
export function darkDiv(div) {
  icon.addEventListener('click', () => {
    // light mode
    if (moon.classList.contains('active-icon')) {
      div.classList.remove('dark');
      // dark mode
    } if (sun.classList.contains('active-icon')) {
      div.classList.add('dark');
    }
  });
}
export function createTaskItemHTML(Task) {
  const completedClass = Task.completed ? 'done' : '';
  return `
    <div class="task ${completedClass}" data-id="${Task.id}" draggable="true">
      ${Task.title}
      <div class="submit"><i class="fa-solid fa-check done-icon"></i></div>
      <i class="fa-solid fa-x delete"></i>
      <i class="fa-solid fa-pen-to-square edit"></i>
    </div>
  `;
}
export function appendTask(Arr) {
  const data = Arr || getArray();
  tasks.innerHTML = data.map(createTaskItemHTML).join('');
}
export function modeCheck(mode) {
  if (mode === '"light"') {
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
    task.forEach((e) => {
      e.classList.remove('dark');
    });
  }
  if (mode === '"dark"') {
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
    task.forEach((e) => {
      e.classList.add('dark');
    });
  }
}
export function saveMode(Mode) {
  localStorage.setItem('Mode', JSON.stringify(Mode));
  modeCheck();
}
export function getMode(mode) {
  mode = localStorage.getItem('Mode');
  modeCheck(mode);
}
export function taskStatus(taskId) {
  const taskIndex = arr.findIndex((Task) => Task.id == taskId);
  if (taskIndex !== -1) {
    arr[taskIndex].completed = !arr[taskIndex].completed;
    saveData();
    countTasks();
    checkComplete();
    checkDown();
  }
}
export function editTask(taskId) {
  let taskToEdit = arr.find((Task) => Task.id == taskId);
  let taskIndex = arr.findIndex((Task) => Task.id == taskId);
  if (taskToEdit) {
    const originalTitle = taskToEdit.title;
    input.value = originalTitle;

    const inputEvent = (event) => {
      const editedTitle = event.target.value.trim();
      if (editedTitle !== '') {
        taskToEdit.title = editedTitle;
      }
    };
    const cancelEditEvent = () => {
      saveAppMode('normal');
      input.value = '';
      taskToEdit = null;
      taskIndex = null;
      submitText.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
      add.classList.remove('edit');
      document.removeEventListener('keyup', saveTaskEventByEnter);
      document.removeEventListener('input', inputEvent);
      submitText.removeEventListener('click', saveTaskEventByClick);
    };
    const saveTaskEventByEnter = (e) => {
      const editedValue = input.value;
      if (e.key == 'Enter' && taskIndex >= 0 && taskIndex < arr.length) {
        arr[taskIndex].title = editedValue;
        saveData();
        appendTask(arr);
        cancelEditEvent();
      }
    };
    const saveTaskEventByClick = () => {
      const editedValue = input.value;
      if (taskIndex >= 0 && taskIndex < arr.length) {
        arr[taskIndex].title = editedValue;
        saveData();
        appendTask(arr);
        cancelEditEvent();
      }
    };
    cancelEdit.addEventListener('click', cancelEditEvent);
    document.addEventListener('input', inputEvent);
    document.addEventListener('keyup', (e) => saveTaskEventByEnter(e));
    submitText.addEventListener('click', saveTaskEventByClick);
  }
}
export function handleComplete(e) {
  taskStatus(e.target.parentElement.getAttribute('data-id'));
  doneSound.play();
  e.target.parentElement.classList.toggle('done');
  emptyList();
  checkComplete();
  checkDown();
}
export function handleDelete(e) {
  deleteTask(e.target.parentElement.getAttribute('data-id'));
  e.target.parentElement.remove();
  checkComplete(arr);
  emptyList();
  checkDown();
}
export function handleEdit(e) {
  saveAppMode('edit');
  submitText.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  add.classList.add('edit');
  const taskId = e.target.parentElement.getAttribute('data-id');
  editTask(taskId);
  scroll({
    top: 0,
    behavior: 'smooth',
  });
  saveData();
  checkComplete();
  emptyList();
  checkDown();
}
export function addTask() {
  const appMode = getAppMode();
  if (appMode === 'normal') {
    if (input.value !== '') {
      addToArr(input.value);
      input.value = '';
      countTasks();
    }
  }
  emptyList();
  checkDown();
}
export function filterTasks() {
  if (all.classList.contains('choosen')) {
    return arr;
  }
  if (active.classList.contains('choosen')) {
    return arr.filter((Task) => !Task.completed);
  }
  if (completed.classList.contains('choosen')) {
    return arr.filter((Task) => Task.completed);
  }
  return arr;
}
