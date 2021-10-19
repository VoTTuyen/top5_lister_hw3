import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * RenameItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Tuyen Vo
 */
export default class RenameItem_Transaction extends jsTPS_Transaction {
    constructor(initStore, initList, initIndex, initOldText, initNewText) {
        super();
        this.store = initStore;
        this.list = initList
        this.index = initIndex;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        this.store.renameItem(this.list, this.index, this.newText);
    }
    
    undoTransaction() {
        this.store.renameItem(this.list, this.index, this.oldText);
    }
}