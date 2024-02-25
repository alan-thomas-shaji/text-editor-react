import React from "react";
import { getFromLocalStorage, setLocalStorage } from "../../utils";
import { convertToRaw } from "draft-js";
import "./index.css";

const SaveButton = ({ contentState }) => {
  const handleSave = () => {
    setLocalStorage("contentState", JSON.stringify(convertToRaw(contentState)));
  };
  return (
    <div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default SaveButton;
