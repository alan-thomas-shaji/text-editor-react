import { Modifier, EditorState, RichUtils, genKey } from "draft-js";

// Function to retrieve data from local storage
export const getFromLocalStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return undefined;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Error getting data from local storage:", error);
    return undefined;
  }
};

// Function to save data to local storage
export const setLocalStorage = (key, data) => {
  try {
      localStorage.setItem(key, data);
  } catch (error) {
    console.error("Error saving data to local storage:", error);
  }
};

export const handleApplyHeading = (currentEditorState) => {
  let result;
  const contentState = currentEditorState.getCurrentContent();
  const selection = currentEditorState.getSelection();
  const currentBlock = contentState.getBlockForKey(selection.getStartKey());

  const newContentState = Modifier.replaceText(
    contentState,
    selection.merge({
      anchorOffset: 0,
      focusOffset: 2,
    }),
    ""
  );
  result = EditorState.push(
    currentEditorState,
    newContentState,
    "remove-range"
  );
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("HEADING")) {
    result = RichUtils.toggleInlineStyle(result, "HEADING");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("REDLINE")) {
    result = RichUtils.toggleInlineStyle(result, "REDLINE");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("UNDERLINE")) {
    result = RichUtils.toggleInlineStyle(result, "UNDERLINE");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("BOLD")) {
    result = RichUtils.toggleInlineStyle(result, "BOLD");
  }

  result = RichUtils.toggleInlineStyle(result, "HEADING");
  return result
};

export const handleApplyUnderline = (currentEditorState) => {
  let result;
  const contentState = currentEditorState.getCurrentContent();
  const selection = currentEditorState.getSelection();
  const newContentState = Modifier.replaceText(
    contentState,
    selection.merge({
      anchorOffset: 0,
      focusOffset: 3,
    }),
    ""
  );
  result = EditorState.push(
    currentEditorState,
    newContentState,
    "remove-range"
  );
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("HEADING")) {
    result = RichUtils.toggleInlineStyle(result, "HEADING");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("REDLINE")) {
    result = RichUtils.toggleInlineStyle(result, "REDLINE");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("UNDERLINE")) {
    result = RichUtils.toggleInlineStyle(result, "UNDERLINE");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("BOLD")) {
    result = RichUtils.toggleInlineStyle(result, "BOLD");
  }

  result = RichUtils.toggleInlineStyle(result, "UNDERLINE");
  return result;
};
 
export const handleApplyBold = (currentEditorState) => { 
  let result;
  const contentState = currentEditorState.getCurrentContent();
  const selection = currentEditorState.getSelection();
  const newContentState = Modifier.replaceText(
    contentState,
    selection.merge({
      anchorOffset: 0,
      focusOffset: 2,
    }),
    ""
  );
  result = EditorState.push(
    currentEditorState,
    newContentState,
    "remove-range"
  );
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("HEADING")) {
    result = RichUtils.toggleInlineStyle(result, "HEADING");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("REDLINE")) {
    result = RichUtils.toggleInlineStyle(result, "REDLINE");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("UNDERLINE")) {
    result = RichUtils.toggleInlineStyle(result, "UNDERLINE");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("BOLD")) {
    result = RichUtils.toggleInlineStyle(result, "BOLD");
  }
  result = RichUtils.toggleInlineStyle(result, "BOLD");
  return result;
 };

export const handleApplyRed = (currentEditorState) => {
  let result;
  const contentState = currentEditorState.getCurrentContent();
  const selection = currentEditorState.getSelection();
  const newContentState = Modifier.replaceText(
    contentState,
    selection.merge({
      anchorOffset: 0,
      focusOffset: 3,
    }),
    ""
  );
  result = EditorState.push(
    currentEditorState,
    newContentState,
    "remove-range"
  );
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("HEADING")) {
    result = RichUtils.toggleInlineStyle(result, "HEADING");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("UNDERLINE")) {
    result = RichUtils.toggleInlineStyle(result, "UNDERLINE");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("BOLD")) {
    result = RichUtils.toggleInlineStyle(result, "BOLD");
  }
  result = RichUtils.toggleInlineStyle(result, "REDLINE");
  return result;
};

export const handleApplyNewLine = (currentEditorState) => { 
  let result;
  const contentState = currentEditorState.getCurrentContent();
  const selection = currentEditorState.getSelection();
  const currentBlock = contentState.getBlockForKey(selection.getStartKey());

  const blockMap = contentState.getBlockMap();
  const newBlock = currentBlock.merge({
    text: "",
    type: "unstyled", // Set the type to unstyled for a new line
    key: genKey(), // Generate a new key for the new block
  });

  const newContentState = contentState.merge({
    blockMap: blockMap.set(newBlock.key, newBlock),
    selectionAfter: selection.merge({
      anchorKey: newBlock.key,
      focusKey: newBlock.key,
      anchorOffset: 0,
      focusOffset: 0,
    }),
  });

  result = EditorState.push(
    currentEditorState,
    newContentState,
    "insert-characters"
  );

  if (JSON.stringify(result.getCurrentInlineStyle()).includes("HEADING")) {
    result = RichUtils.toggleInlineStyle(result, "HEADING");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("REDLINE")) {
    result = RichUtils.toggleInlineStyle(result, "REDLINE");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("UNDERLINE")) {
    result = RichUtils.toggleInlineStyle(result, "UNDERLINE");
  }
  if (JSON.stringify(result.getCurrentInlineStyle()).includes("BOLD")) {
    result = RichUtils.toggleInlineStyle(result, "BOLD");
  }
  return result;
 };