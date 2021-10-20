import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
import DeleteModal from './DeleteModal'
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    let listCard = "";
    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
    }
    function addList(event) {
        if (!store.isListNameEditActive) {
            store.createNewList();
        }
    };

    let buttonAddClass = 'top5-button'
    if (store.isListNameEditActive) {
        buttonAddClass = 'top5-button-disabled'
    }

    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                <input
                    disabled={store.isListNameEditActive}
                    type="button"
                    id="add-list-button"
                    className={buttonAddClass}
                    onClick={addList}
                    value="+" />
                Your Lists
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <DeleteModal

                    
                />
            </div>
        </div>)
}

export default ListSelector;