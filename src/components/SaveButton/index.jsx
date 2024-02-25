import React from "react";
import { getFromLocalStorage, setLocalStorage } from "../../utils";
import { convertToRaw } from "draft-js";

const SaveButton = ({ contentState }) => {
  // const handleSave = () => {
  //     setLocalStorage("contentState", contentState);
  //  };
  const handleSave = () => {
    // const contentState = editorState.getCurrentContent();
    //  const rawContentState = convertToRaw(contentState);
    localStorage.setItem(
      "contentState",
      JSON.stringify(convertToRaw(contentState))
    );
  };
  return (
    <div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default SaveButton;
