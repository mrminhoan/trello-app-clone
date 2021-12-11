import React from "react";
import { Container, Draggable } from "react-smooth-dnd";
import './Column.scss'

// Custom Components
import Card from '../Card/Card'
// Sort
import { mapOrder } from "../../utilities/sorts";

function Column(props) {
    const { column } = props
    console.log(column)
    const cards = mapOrder(column.cards, column.cardOrder, 'id')

    const onCardDrop = ((dropResult) => {
        console.log(dropResult)
    })
    return (
        <div className="column">
            <header className="column-drag-handle">{column.title}</header>

            <div className="card-list">
                <Container 
                    //orienation: dùng để xắp xếp các phần tử theo chiều dọc hoặc ngang. 
                    orientation="vertical"
                    groupName="col"
                    onDrop={onCardDrop}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"

                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: ' card-drop-preview'
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    {cards.map((card, index) => (
                        <Draggable key={index}>
                            <Card card={card} />
                        </Draggable>
                    ))}
                </Container>
            </div>
            <footer>Add another card</footer>
        </div>
    )
}


export default Column