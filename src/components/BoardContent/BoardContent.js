import React, { useState, useEffect } from "react";
import { Container, Draggable } from "react-smooth-dnd"
import { isEmpty } from "lodash"
// Import CSS
import './BoardContent.scss'


// Custom Components
import Column from '../Column/Column'

// Import Library
import { mapOrder } from "../../utilities/sorts"
import { initialData } from '../../actions/initialData'
import {applyDrag} from '../../utilities/dragDrop'

function BoardContent() {
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])

    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
        if (boardFromDB) {
            setBoard(boardFromDB)

            // Sort Column
            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
        }
    }, [])

    if (isEmpty(board)) {
        return <div className="not-found" style={{ 'padding': '10px', 'color': 'white' }}>Board Not Found</div>
    }
    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns]
        newColumns = applyDrag(newColumns, dropResult)
        setColumns(newColumns)  
        let newBoard = {...board}
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns =newColumns
        setBoard(newBoard)
    }

    const onCardDrop = (columnId, dropResult) => {
        if(dropResult.addedIndex!== null || dropResult.removedIndex!==null){
            let newColumns = [...columns]
            let currentColumn = newColumns.find(c => c.id === columnId)
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map(i=> i.id)
            setColumns(newColumns)
        }
    }

    return (
        <div className="board-content" >
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={index => columns[index]  }
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                }}
            >
                {columns.map((column, index) => (
                    <Draggable key={index}>
                        <Column key={index} column={column} onCardDrop={onCardDrop}/>
                    </Draggable>

                ))}
            </Container>
            <div className="add-new-column">
                <i className="fa fa-plus icon"></i>
                Add another card
            </div>
        </div>
    )
}


export default BoardContent