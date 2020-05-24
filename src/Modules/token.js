//  token reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "setToken":
      return action.token;
    default:
      return state;
  }
};

//  set token action
export const setToken = (token) => {
  return {
    type: "setToken",
    token,
  };
};

export default reducer;
