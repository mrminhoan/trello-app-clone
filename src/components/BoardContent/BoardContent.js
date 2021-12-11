import React, { useState, useEffect } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { isEmpty } from "lodash";
import './BoardContent.scss'


// Custom Components
import Column from '../Column/Column'

import { mapOrder } from "../../utilities/sorts";
import { initialData } from '../../actions/initialData'

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
    const onColumnDrop = ((dropResult) => {
        console.log(dropResult)
    })

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
                        <Column key={index} column={column} />
                    </Draggable>

                ))}
            </Container>

        </div>
    )
}


export default BoardContent