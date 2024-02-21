// eslint-disable-next-line import/no-extraneous-dependencies
import dragula from 'dragula/dist/dragula';
import {
  clear, down, ele, moon, submitText, sun, tasks, up,
} from './elements';
import {
  appendTask, checkComplete, clearCompleted,
  emptyList, getMode, saveData, saveMode, handleComplete,
  handleDelete, handleEdit, addTask, getArray, filterTasks,
} from './utilties';

const callEvents = (mode) => {
  let arr = getArray() || [];
  const drake = dragula([tasks]);
  window.onscroll = () => {
  // up button
    if (window.scrollY >= 300) {
      up.classList.add('show');
    } else {
      up.classList.remove('show');
    }
  };
  up.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
  down.addEventListener('click', () => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  // clear completed
  clear.addEventListener('click', () => {
    clearCompleted();
  });
  // filter all-active-completed
  ele.forEach((event) => {
    event.addEventListener('click', () => {
      ele.forEach((el) => el.classList.remove('choosen'));
      event.classList.add('choosen');

      const filteredArray = filterTasks(event);
      appendTask(filteredArray);
      emptyList();
      checkComplete(filteredArray);
    });
  });

  // Light Mode
  sun.addEventListener('click', () => {
    mode = 'light';
    saveMode(mode);
    getMode();
  });
  // Dark Mode
  moon.addEventListener('click', () => {
    mode = 'dark';
    saveMode(mode);
    getMode(mode);
  });
  tasks.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) handleDelete(e);
    if (e.target.classList.contains('edit')) handleEdit(e);
    if (e.target.classList.contains('submit')) handleComplete(e);
  });
  submitText.addEventListener('click', () => {
    addTask(arr);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask(arr);
    }
  });
  drake.on('drop', () => {
    // Handle the drop event (e.g., save the new order of tasks)
    const updatedOrder = Array.from(tasks.children)
      .map((taskElement) => parseInt(taskElement.dataset.id, 10));
    // Update the order in your data array and save it
    arr = arr.sort((a, b) => updatedOrder.indexOf(a.id) - updatedOrder.indexOf(b.id));
    saveData(arr);
  });
};
export default callEvents;
