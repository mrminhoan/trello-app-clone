import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import './BoardContent.scss'


// Custom Components
import Column from '../Column/Column'
import {mapOrder} from "../../utilities/sorts";

import {initialData} from '../../actions/initialData'
function BoardContent(){
    const [board, setBoard] = useState({})
    const [columns, setColumns] = useState([])

    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1')
        if(boardFromDB){
            setBoard(boardFromDB)

            // Sort Column
            setColumns( mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id') )
        }
    }, [])

    if(isEmpty(board)){
        return <div className="not-found" style={{'padding':'10px', 'color': 'white'}}>Board Not Found</div>
    }

    return(
        <div className="board-content" >
            {columns.map((column,index) => <Column key={index} column={column} />)}
            
        </div>
    )
}


export default BoardContent