import React, { useCallback, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  Modifier,
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
  };

  const keyBindingFn = useCallback(
    (event) => {
      const contentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const currentBlock = contentState.getBlockForKey(selection.getStartKey());
      const currentText = currentBlock.getText();
      console.log("current text: " + currentText);
      if (event.keyCode === 32 && currentText.startsWith("#")) {
        return "apply-heading";
      } else if (event.keyCode === 32 && currentText.startsWith("***")) {
        return "apply-underline";
      } else if (event.keyCode === 32 && currentText.startsWith("**")) {
        return "redline";
      } else if (event.keyCode === 32 && currentText.startsWith("*")) {
        return "apply-bold";
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

        // Remove "#" and space
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
        newState = RichUtils.toggleBlockType(newState, "header-one");
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
      } else if (command === "new-line") {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const currentBlock = contentState.getBlockForKey(
          selection.getStartKey()
        );
        newState = EditorState;
        newState = RichUtils.toggleBlockType(newState, "heading-one");
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
