import React from "react";
import './Column.scss'

// Custom Components
import Task from '../Task/Task'

function Column() {
    return (
        <div className="column">
            <header>Brainstorm</header>
            <ul className="task-list">
                <Task />
                <li className="task-item" >Add what you'dd like to work on below</li>
                <li className="task-item" >Add what you'dd like to work on below</li>
                <li className="task-item" >Add what you'dd like to work on below</li>
            </ul>
            <footer>Add another card</footer>
        </div>
    )
}


export default Column