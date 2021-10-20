import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import { useHistory } from "react-router-dom";
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
  const { store } = useContext(GlobalStoreContext);
  const history = useHistory();

  let editStatus = false;
  if (store.isListNameEditActive || store.isItemNameEditActive) {
    editStatus = true;
  }

  let undoButtonClass = "top5-button-disabled";
  let redoButtonClass = "top5-button-disabled";
  let closeButtonClass = "top5-button-disabled";

  if (store.undoButtonOn) {
    undoButtonClass = "top5-button"
  }

  if (store.redoButtonOn) {
    redoButtonClass = "top5-button";
  }

  if (store.closeButtonOn) {
    closeButtonClass = "top5-button"
  }

  if (store.isItemNameEditActive) {
    undoButtonClass = "top5-button-disabled";
    redoButtonClass = "top5-button-disabled";
    closeButtonClass = "top5-button-disabled"
  }

  function handleUndo() {
    if (!editStatus) {
      store.undo();
    }
  }
  function handleRedo() {
    if (!editStatus) {
      store.redo();
    }
  }
  function handleClose() {
    if (!editStatus) {
      history.push("/");
      store.closeCurrentList();
    }
  }

  return (
    <div id="edit-toolbar">
      <div
        disabled={store.isItemNameEditActive}
        id="undo-button"
        onClick={handleUndo}
        className={undoButtonClass}
      >
        &#x21B6;
      </div>
      <div
        disabled={store.isItemNameEditActive}
        id="redo-button"
        onClick={handleRedo}
        className={redoButtonClass}
      >
        &#x21B7;
      </div>
      <div
        disabled={!store.closeButtonOn}
        id="close-button"
        onClick={handleClose}
        className={closeButtonClass}
      >
        &#x24E7;
      </div>
    </div>
  );
}

export default EditToolbar;
