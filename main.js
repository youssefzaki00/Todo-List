import callEvents from './scripts/events';
import {
  getMode,
  countTasks, modeCheck, getData, checkComplete, emptyList, checkDown,
} from './scripts/utilties';

getData();
countTasks();
emptyList();
checkComplete();
checkDown();
const appMode = 'normal';
localStorage.setItem('appMode', appMode);
const mode = JSON.parse(localStorage.getItem('Mode'));
if (mode) modeCheck();
getMode(mode);
callEvents(appMode);
