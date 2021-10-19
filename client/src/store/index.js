import { createContext, useState } from "react";
import jsTPS from "../common/jsTPS";
import api from "../api";
import RenameItem_Transaction from "../transactions/RenameItem_Transaction";

import MoveItem_Transaction from "../transactions/MoveItem_Transaction";

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",

  CHANGE_ITEM_NAME: "CHANGE_ITEM_NAME",
  SET_ITEM_NAME_EDIT_ACTIVE: "SET_ITEM_NAME_EDIT_ACTIVE",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();
//GET COOKIE NAME
function getCookie(name) {
  let doc = document.cookie;
  let prefix = name + "=";
  console.log("prefix=" + prefix);
  let begin = doc.indexOf("; " + prefix);
  console.log("begin=" + begin);
  if (begin == -1) {
    begin = doc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    console.log("end=" + end);
    if (end == -1) {
      end = doc.length;
    }
  }
  

  return decodeURI(doc.substring(begin + prefix.length, end));
}
// GET COOKIE COUNTER
  function getCookieCounter() {
    let value = getCookie("newListCounter");
    if (value === "") {
      return 0;
    } else {
      return value;
    }
  }

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    idNamePairs: [],
    currentList: null,
    newListCounter: getCookieCounter(),
    listNameActive: false,
    itemNameActive: false,
    listMarkedForDeletion: null,
    undoButtonOn: false,
    redoButtonOn: false,
    closeButtonOn: false,
  });

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF LITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          currentList: payload.top5List,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          itemNameActive: false,
          listMarkedForDeletion: null,
          undoButtonOn: false,
          redoButtonOn: false,
          closeButtonOn: false,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          itemNameActive: false,
          listMarkedForDeletion: null,
          undoButtonOn: false,
          redoButtonOn: false,
          closeButtonOn: false,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          idNamePairs: payload,
          currentList: null,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          itemNameActive: false,
          listMarkedForDeletion: null,
          undoButtonOn: false,
          redoButtonOn: false,
          closeButtonOn: false,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          itemNameActive: false,
          listMarkedForDeletion: null,
          undoButtonOn: false,
          redoButtonOn: false,
          closeButtonOn: false,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: true,
          itemNameActive: false,
          listMarkedForDeletion: null,
          undoButtonOn: false,
          redoButtonOn: false,
          closeButtonOn: false,
        });
      }
      // UPDATE ITEM NAME
      case GlobalStoreActionType.CHANGE_ITEM_NAME: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload.top5List,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          itemNameActive: false,
          listMarkedForDeletion: null,
          undoButtonOn: false,
          redoButtonOn: false,
          closeButtonOn: false,
        });
      }
      // START EDITING A ITEM NAME
      case GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          isListNameEditActive: false,
          itemNameActive: true,
          listMarkedForDeletion: null,
          undoButtonOn: false,
          redoButtonOn: false,
          closeButtonOn: false,
        });
      }
      default:
        return store;
    }
  };
  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.
  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  store.changeListName = function (id, newName) {
    // GET THE LIST
    async function asyncChangeListName(id) {
      let response = await api.getTop5ListById(id);
      if (response.data.success) {
        let top5List = response.data.top5List;
        top5List.name = newName;
        async function updateList(top5List) {
          response = await api.updateTop5ListById(top5List._id, top5List);
          if (response.data.success) {
            async function getListPairs(top5List) {
              response = await api.getTop5ListPairs();
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    idNamePairs: pairsArray,
                    top5List: top5List,
                  },
                });
              }
            }
            getListPairs(top5List);
          }
        }
        updateList(top5List);
      }
    }
    asyncChangeListName(id);
  };
  // RENAME ITEM
  // store.changeItemName = function (index, newText) {
  //   async function asyncChangeItemName(id) {
  //     let response = await api.getTop5ListById(id);
  //     if (response.data.success) {
  //       let list = response.data.top5List;
  //       let oldText = list.items[index];

  //       let foo = (list, index, newText) => {
  //         list.items[index] = newText;
  //         this.db.mutationUpdateList(list);
  //       };
  //      store.addRenameItemTransaction = function (foo, list,index,oldText,newText) {
  //  let transaction = new RenameItem_Transaction(foo, list,index,oldText,newText);
  //      tps.addTransaction(transaction);
  //   };
  //       storeReducer({
  //         type: GlobalStoreActionType.CHANGE_ITEM_NAME,
  //         payload: {
  //           top5List: list,
  //         },
  //       });

  //     }

  //   }
  //      asyncChangeItemName(index);

  // };
  // CREATE A NEW LIST
  store.createNewList = function () {
    let _id;
    async function asyncCreateNewList() {
      const response = await api.createTop5List({
        name: "Untitled" + store.newListCounter++,
        items: ["?", "?", "?", "?", "?"],
      });
      if (response.data.success) {
        _id = response.data.top5List._id
      }
      document.cookie = "newListCounter=" + store.newListCounter
    }
    asyncCreateNewList().then(() => {
      store.loadIdNamePairs();
    }).then(() => {
        store.setCurrentList(_id);
    });
    
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = function () {
    async function asyncLoadIdNamePairs() {
      const response = await api.getTop5ListPairs();
      if (response.data.success) {
        let pairsArray = response.data.idNamePairs;
        storeReducer({
          type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
          payload: pairsArray,
        });
      } else {
        console.log("API FAILED TO GET THE LIST PAIRS");
      }
    }
    asyncLoadIdNamePairs();
  };
  // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
  // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
  // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
  // moveItem, updateItem, updateCurrentList, undo, and redo
  store.setCurrentList = function (id) {
    async function asyncSetCurrentList(id) {
      let response = await api.getTop5ListById(id);
      if (response.data.success) {
        let top5List = response.data.top5List;

        response = await api.updateTop5ListById(top5List._id, top5List);
        if (response.data.success) {
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: top5List,
          });
          store.history.push("/top5list/" + top5List._id);
        }
      }
    }
    asyncSetCurrentList(id);
  };

  store.addMoveItemTransaction = function (start, end) {
    let transaction = new MoveItem_Transaction(store, start, end);
    tps.addTransaction(transaction);
  };
  store.moveItem = function (start, end) {
    start -= 1;
    end -= 1;
    if (start < end) {
      let temp = store.currentList.items[start];
      for (let i = start; i < end; i++) {
        store.currentList.items[i] = store.currentList.items[i + 1];
      }
      store.currentList.items[end] = temp;
    } else if (start > end) {
      let temp = store.currentList.items[start];
      for (let i = start; i > end; i--) {
        store.currentList.items[i] = store.currentList.items[i - 1];
      }
      store.currentList.items[end] = temp;
    }

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  store.updateCurrentList = function () {
    async function asyncUpdateCurrentList() {
      const response = await api.updateTop5ListById(
        store.currentList._id,
        store.currentList
      );
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: store.currentList,
        });
      }
    }
    asyncUpdateCurrentList();
  };
  store.undo = function () {
    tps.undoTransaction();
  };
  store.redo = function () {
    tps.doTransaction();
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setIsListNameEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };
  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A ITEM NAME
  store.setIsItemNameEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_ITEM_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
  return { store, storeReducer };
};
