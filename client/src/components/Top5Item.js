import { React, useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
  const { store } = useContext(GlobalStoreContext);
  const [draggedTo, setDraggedTo] = useState(0);
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");
  const { index } = props;
  console.log("ix" + index);

  function handleDragStart(event) {
    console.log("drag start");
    event.dataTransfer.setData("item", event.target.id);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragEnter(event) {
    event.preventDefault();
    setDraggedTo(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDraggedTo(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    let target = event.target;
    let targetId = target.id;
    targetId = targetId.substring(target.id.indexOf("-") + 1);
    let sourceId = event.dataTransfer.getData("item");
    sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
    setDraggedTo(false);

    // UPDATE THE LIST
    store.addMoveItemTransaction(sourceId, targetId);
  }
  // EDIT ITEM
  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsItemNameEditActive();
    }
    setEditActive(newActive);
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      let index = event.target.id.substring("item-".length);
      let newText = text
      index = index - 1
      if (newText === '') {
        newText = event.target.value
      }
      store.changeItemName(index, newText);
      toggleEdit();
    }
  }

  function handleUpdateText(event) {
    setText(event.target.value);
  }

  let itemClass = "top5-item";
  if (draggedTo) {
    itemClass = "top5-item-dragged-to";
  }
  let itemStatus = false;
  if (store.isItemNameEditActive) {
    itemStatus = true;
  }

  let itemElement = (
    <div
      id={"item-" + (index + 1)}
      className={itemClass}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        disabled={itemStatus}
        type="button"
        id={"item-" + (index + 1)}
        onClick={handleToggleEdit}
        value={"\u270E"}
      />
      {props.text}
    </div>
  );
  if (editActive) {
    itemElement = (
      <input
        id={"item-" + (index + 1)}
        className={itemClass}
        type="text"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={props.text}
      />
    );
  }
  return itemElement;
}

export default Top5Item;
