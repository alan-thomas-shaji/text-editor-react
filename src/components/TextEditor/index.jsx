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

  const keyBindingFn = useCallback(
    (event) => {
      const contentState = editorState.getCurrentContent();
      const selection = editorState.getSelection();
      const currentBlock = contentState.getBlockForKey(selection.getStartKey());
          const currentText = currentBlock.getText();
          console.log("current text: " + currentText);
        //   console.log("content state: " + contentState);

      // Check for "#" followed by space at the beginning of the line
      if (
          event.keyCode === 32
          &&
        currentText.startsWith("#")
        //  &&
        // selection.getStartOffset() === 2
      ) {
        return "apply-heading";
      } else if (event.keyCode === 32 && currentText.startsWith("***")) {
          return "apply-underline";
      }
    //   else if (event.keyCode === 13) {
    //       return "apply-heading";
    //   } 
      return getDefaultKeyBinding(event);
        //   return getDefaultKeyBinding("");
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

        // Apply heading style
        newState = EditorState.push(
          editorState,
          newContentState,
          "remove-range"
        );
        newState = RichUtils.toggleBlockType(newState, "header-one");
      } else if (command === "apply-underline") {
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
            focusOffset: 4,
          }),
          ""
        );

        // Apply heading style
        // newState = EditorState.push(
        //   editorState,
        //   newContentState,
        //   "underline"
        // );
          // newState = RichUtils.toggleBlockType(newState, "underline");
          newState = RichUtils.toggleInlineStyle(
            editorState,
            "UNDERLINE"
          );
      }
      else if (command === "new-line") {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const currentBlock = contentState.getBlockForKey(
          selection.getStartKey()
        );

        // Remove "#" and space
        // const newContentState = Modifier.replaceText(
        //   contentState,
        //   selection.merge({
        //     anchorOffset: 0,
        //     focusOffset: 2,
        //   }),
        //   ""
        // );

        // Apply heading style
        newState = EditorState;
        newState = RichUtils.toggleBlockType(newState, "heading-one");
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
    />
  );
};

export default TextEditor;
