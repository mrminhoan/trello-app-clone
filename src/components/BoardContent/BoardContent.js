import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap';
import { Container, Draggable } from "react-smooth-dnd"
import { isEmpty } from "lodash"
// Import CSS
import './BoardContent.scss'


// Custom Components
import Column from '../Column/Column'

// Import Library
import { mapOrder } from "../../utilities/sorts"
import { initialData } from '../../actions/initialData'
import { applyDrag } from '../../utilities/dragDrop'

function BoardContent() {
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])
    const [openNewColumnForm, setOpenNewColumnForm] = useState(false)

    const newColumnInputRef = useRef(null)

    const [newColumnTitle, setNewColumnTitle] = useState('')
    const onNewColumnTitleChange = useCallback((e) => setNewColumnTitle(e.target.value), [])

    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
        if (boardFromDB) {
            setBoard(boardFromDB)

            // Sort Column
            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'))
        }
    }, [])


    useEffect(() => {
        if (newColumnInputRef && newColumnInputRef.current) {
            newColumnInputRef.current.focus()
            newColumnInputRef.current.select()
        }
    }, [openNewColumnForm])

    if (isEmpty(board)) {
        return <div className="not-found" style={{ 'padding': '10px', 'color': 'white' }}>Board Not Found</div>
    }
    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns]
        newColumns = applyDrag(newColumns, dropResult)
        setColumns(newColumns)
        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns = newColumns
        setBoard(newBoard)
    }

    const onCardDrop = (columnId, dropResult) => {
        if (dropResult.addedIndex !== null || dropResult.removedIndex !== null) {
            let newColumns = [...columns]
            let currentColumn = newColumns.find(c => c.id === columnId)
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
            currentColumn.cardOrder = currentColumn.cards.map(i => i.id)
            setColumns(newColumns)
        }
    }

    const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
    const addNewColumn = () => {
        if (!newColumnTitle) {
            newColumnInputRef.current.focus()
            return
        }
        const newColumnToAdd = {
            id: Math.random().toString(36).substring(2, 5),
            boardId: board.id,
            title: newColumnTitle.trim(),
            cardOrder: [],
            cards: []
        }
        let newColumns = [...columns]
        newColumns.push(newColumnToAdd)

 
        let newBoard = { ...board }
        newBoard.columnOrder = newColumns.map(c => c.id)
        newBoard.columns = newColumns

        setColumns(newColumns)
        setBoard(newBoard)
        setNewColumnTitle('')
        toggleOpenNewColumnForm()
    }
    return (
        <div className="board-content" >
            <Container
                orientation="horizontal"
                onDrop={onColumnDrop}
                getChildPayload={index => columns[index]}
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                }}
            >
                {columns.map((column, index) => (
                    <Draggable key={index}>
                        <Column key={index} column={column} onCardDrop={onCardDrop} />
                    </Draggable>

                ))}
            </Container>

            <BootstrapContainer className="trello0-clone-container" >
                {!openNewColumnForm &&
                    <Row>
                        <Col className="add-new-column" onClick={toggleOpenNewColumnForm} >
                            <i className="fa fa-plus icon"></i>
                            Add another card
                        </Col>
                    </Row>
                }

                {openNewColumnForm &&
                    <Row>
                        <Col className="enter-new-column">
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="Enter column title..."
                                className="input-enter-new-column"
                                ref={newColumnInputRef}
                                value={newColumnTitle}
                                onChange={onNewColumnTitleChange}
                                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
                            />
                            <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>
                            <span className="cancel-new-column" onClick={toggleOpenNewColumnForm}> 
                                <i className="fa fa-trash"></i> 
                            </span>
                        </Col>
                    </Row>
                }



            </BootstrapContainer>
        </div>
    )
}


export default BoardContent