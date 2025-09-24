export const GLOBAL_STATE = {
  userName: null,
  allUsers: [],
  messages: [],
};

const setGlobalState = (newState) => Object.assign(GLOBAL_STATE, newState);
const setUserName = ({ userName }) => { GLOBAL_STATE.userName = userName; };
const setCompanion = (companion) => GLOBAL_STATE.allUsers.push(companion);
const deleteCompanion = (companion) => {
  GLOBAL_STATE.allUsers = GLOBAL_STATE.allUsers.filter((item) => item !== companion);
};

export {
  setGlobalState,
  setUserName,
  setCompanion,
  deleteCompanion,
};
