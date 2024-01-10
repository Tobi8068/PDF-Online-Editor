import { createStore } from 'redux';

const initialState = {
  serverId: '' // Initial value for serverId
};

const SET_SERVER_ID = 'SET_SERVER_ID';

export const setServerId = (serverId) => ({
  type: SET_SERVER_ID,
  payload: serverId
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVER_ID:
      return {
        ...state,
        serverId: action.payload
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;