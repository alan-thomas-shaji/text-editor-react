import React, { useCallback, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  Modifier,
  genKey,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import SaveButton from "../SaveButton";
import { styleMap } from "../../constants";
import './index.css'
import Title from "../Title";
import { handleApplyBold, handleApplyHeading, handleApplyNewLine, handleApplyRed, handleApplyUnderline } from "../../utils";

const TextEditor = () => {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );
    const [currentContent, setCurrentContent] = React.useState({});
  const editor = React.useRef(null);

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
      let currentEditorState = editorState;
      if (command === "apply-heading") {
        newState = handleApplyHeading(currentEditorState);
      } else if (command === "apply-underline") {
        newState = handleApplyUnderline(currentEditorState);
      } else if (command === "redline") {
        newState = handleApplyRed(currentEditorState);
      } else if (command === "apply-bold") {
        newState = handleApplyBold(currentEditorState);
      } else if (command === "new-line") {
        newState = handleApplyNewLine(currentEditorState);
      }

      if (newState) {
        setEditorState(newState);
        return "handled";
      }
      return "not-handled";
    },
    [editorState]
  );
    useEffect(() => {
      const savedContent = localStorage.getItem("contentState");
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent);
          const contentState = convertFromRaw({
            blocks: parsedContent.blocks,
            entityMap: parsedContent.entityMap,
          });
          setEditorState(EditorState.createWithContent(contentState));
        } catch (error) {
          console.error("Error parsing saved content state:", error);
        }
      }
    }, []);


    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        setCurrentContent(contentState);
    },[editorState]);

  return (
    <>
      <div className="top-bar">
        <Title heading={"Demo Editor by Alan"} />
        <SaveButton contentState={currentContent} />
      </div>

      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Write something!"
        handleKeyCommand={handleKeyCommand}
        keyBindingFn={keyBindingFn}
        customStyleMap={styleMap}
      />
    </>
  );
};

export default TextEditor;
