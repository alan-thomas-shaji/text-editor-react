import React, { useCallback, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  Modifier,
  genKey,
  CharacterMetadata,
  convertFromRaw,
  ContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { removeInlineStyle } from "draft-js/lib/DraftModifier";
import { removeStyle } from "draft-js/lib/CharacterMetadata";
import SaveButton from "../SaveButton";
import { getFromLocalStorage } from "../../utils";
import { styleMap } from "../../constants";
import './index.css'

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
        const contentState = currentEditorState.getCurrentContent();
        const selection = currentEditorState.getSelection();
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
          currentEditorState,
          newContentState,
          "remove-range"
        );
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("HEADING")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "HEADING");
        }
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("REDLINE")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "REDLINE");
        }
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("UNDERLINE")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "UNDERLINE");
        }
        if (JSON.stringify(newState.getCurrentInlineStyle()).includes("BOLD")) {
          newState = RichUtils.toggleInlineStyle(newState, "BOLD");
        }

        newState = RichUtils.toggleInlineStyle(newState, "HEADING");
      } else if (command === "apply-underline") {
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
        newState = EditorState.push(
          currentEditorState,
          newContentState,
          "remove-range"
        );
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("HEADING")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "HEADING");
        }
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("REDLINE")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "REDLINE");
        }
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("UNDERLINE")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "UNDERLINE");
        }
        if (JSON.stringify(newState.getCurrentInlineStyle()).includes("BOLD")) {
          newState = RichUtils.toggleInlineStyle(newState, "BOLD");
        }

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
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("HEADING")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "HEADING");
        }
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("UNDERLINE")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "UNDERLINE");
        }
        if (JSON.stringify(newState.getCurrentInlineStyle()).includes("BOLD")) {
          newState = RichUtils.toggleInlineStyle(newState, "BOLD");
        }
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
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("HEADING")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "HEADING");
        }
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("REDLINE")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "REDLINE");
        }
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("UNDERLINE")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "UNDERLINE");
        }
        if (JSON.stringify(newState.getCurrentInlineStyle()).includes("BOLD")) {
          newState = RichUtils.toggleInlineStyle(newState, "BOLD");
        }
        newState = RichUtils.toggleInlineStyle(newState, "BOLD");
      } else if (command === "new-line") {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const currentBlock = contentState.getBlockForKey(
          selection.getStartKey()
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
          JSON.stringify(newState.getCurrentInlineStyle()).includes("HEADING")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "HEADING");
        }
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("REDLINE")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "REDLINE");
        }
        if (
          JSON.stringify(newState.getCurrentInlineStyle()).includes("UNDERLINE")
        ) {
          newState = RichUtils.toggleInlineStyle(newState, "UNDERLINE");
        }
        if (JSON.stringify(newState.getCurrentInlineStyle()).includes("BOLD")) {
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
              <div className="title">Demo Editor by Alan</div>
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
