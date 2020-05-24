//  verse window data reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "hideVerseWindow":
      return {
        ...state,
        showVerseWindow: false,
      };
    case "showVerseWindow":
      return {
        ...state,
        showVerseWindow: true,
        bookIndex: action.bookIndex,
        chapterIndex: action.chapterIndex,
        verseIndex: action.verseIndex,
      };
    default:
      return state;
  }
};

//  verse window data action(s)
export const hideVerseWindow = () => {
  return {
    type: "hideVerseWindow",
  };
};

export const showVerseWindow = (bookIndex, chapterIndex, verseIndex) => {
  return {
    type: "showVerseWindow",
    bookIndex,
    chapterIndex,
    verseIndex,
  };
};

export default reducer;
