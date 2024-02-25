import React, { useCallback, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  Modifier,
  genKey,
  CharacterMetadata,
} from "draft-js";
import "draft-js/dist/Draft.css";

const TextEditor = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
  const editor = React.useRef(null);

  const styleMap = {
    REDLINE: {
      color: "red",
      fontWeight: "bold",
    },
    UNDERLINE: {
      textDecoration: "underline",
    },
    BOLD: {
      fontWeight: "bold",
    },
    HEADING: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    RESET_STYLES: {
      color: null,
      textDecoration: null,
      fontWeight: null,
      fontSize: null,
    },
  };

  const keyBindingFn = useCallback(
    (event) => {
      const contentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const currentBlock = contentState.getBlockForKey(selection.getStartKey());
      const currentText = currentBlock.getText();
      if (event.keyCode === 32 && currentText.startsWith("#")) {
        return "apply-heading";
      } else if (event.keyCode === 32 && currentText.startsWith("***")) {
        return "apply-underline";
      } else if (event.keyCode === 32 && currentText.startsWith("**")) {
        return "redline";
      } else if (event.keyCode === 32 && currentText.startsWith("*")) {
        return "apply-bold";
      } else if (event.keyCode === 13) {
        return "new-line";
      }
      return getDefaultKeyBinding(event);
    },
    [editorState]
  );

  const handleKeyCommand = useCallback(
    (command) => {
      let newState;
      if (command === "apply-heading") {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const currentBlock = contentState.getBlockForKey(
          selection.getStartKey()
        );

        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 2,
          }),
          ""
        );
        newState = EditorState.push(
          editorState,
          newContentState,
          "remove-range"
        );
        newState = RichUtils.toggleInlineStyle(newState, "HEADING");
      } else if (command === "apply-underline") {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 3,
          }),
          ""
        );
        newState = EditorState.push(
          editorState,
          newContentState,
          "remove-range"
        );
        newState = RichUtils.toggleInlineStyle(newState, "UNDERLINE");
      } else if (command === "redline") {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 3,
          }),
          ""
        );
        newState = EditorState.push(
          editorState,
          newContentState,
          "remove-range"
        );
        newState = RichUtils.toggleInlineStyle(newState, "REDLINE");
      } else if (command === "apply-bold") {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const newContentState = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 2,
          }),
          ""
        );
        newState = EditorState.push(
          editorState,

          newContentState,
          "remove-range"
        );
        newState = RichUtils.toggleInlineStyle(newState, "BOLD");
      } else if (command === "new-line") {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const currentBlock = contentState.getBlockForKey(
          selection.getStartKey()
        );
        console.log(
          "get inline style: ",
          JSON.stringify(editorState.getCurrentInlineStyle())
        );

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

        newState = EditorState.push(
          editorState,
          newContentState,
          "insert-characters"
        );
        if (
          JSON.stringify(editorState.getCurrentInlineStyle()).includes(
            "HEADING"
          )
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "HEADING");
        }
        if (
          JSON.stringify(editorState.getCurrentInlineStyle()).includes(
            "REDLINE"
          )
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "REDLINE");
        }
        if (
          JSON.stringify(editorState.getCurrentInlineStyle()).includes(
            "UNDERLINE"
          )
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "UNDERLINE");
        }
        if (
          JSON.stringify(editorState.getCurrentInlineStyle()).includes("BOLD")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "BOLD");
        }
      }

      if (newState) {
        setEditorState(newState);
        return "handled";
      }
      return "not-handled";
    },
    [editorState]
  );

  return (
    <Editor
      ref={editor}
      editorState={editorState}
      onChange={setEditorState}
      placeholder="Write something!"
      handleKeyCommand={handleKeyCommand}
      keyBindingFn={keyBindingFn}
      customStyleMap={styleMap}
    />
  );
};

export default TextEditor;
