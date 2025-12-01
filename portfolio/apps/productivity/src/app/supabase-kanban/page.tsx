"use client"


import {useStore} from "@tanstack/react-store";
import {addColumn, createBoard} from "@/store/boardStore";
import {activeBoardStore} from "@/store/activeStore";
import Board from "@/components/Board";
import {CardViewModal} from "@/components/modals/CardViewModal";
import {EditBoardModal} from "@/components/modals/EditBoardModal";
import {Count} from "@/components/Count";
import modal from "@/lib/ModalReducer";
import {boards} from "@/store/supabaseBoardStore";
import {useEffect} from "react";
import {boardReducer} from "@/lib/boardReducer";

type ColumnType = {
    id: string;
    order: number;
    name: string;
    tasks: { id: string; order: number; title: string }[];
};


export default function SupabasePage() {
    //const boards = useStore(boards);
    useEffect(() => {
        const unmount = boards.mount();

        return () => unmount();
    }, []);

    const board = useStore(boards);
    const boardNames = useStore(boards, (allBoards) => allBoards?Object.keys(allBoards):[]);
    const selectedBoard = useStore(activeBoardStore)
    const columns = useStore(boards, (allBoards) => allBoards?(selectedBoard?allBoards[selectedBoard]?allBoards[selectedBoard]:[]:[]):[]);

    if (!selectedBoard) {
        // a board should be selected, but isn't yet — show loading/fallback UI
        return (
            <div className={`flex items-center justify-center min-h-screen`}>
                <h1 className={`text-2xl font-bold`}>Loading board...</h1>
            </div>
        );
    }

    return (
        <div className={`min-h-screen`}>
            <button onClick={()=>createBoard("board", [])}>Add Board</button>

            <button
                onClick={()=>addColumn(selectedBoard, "column"+Math.floor(Math.random()*100))}
            >
                Add Column
            </button>

            <ul>
                {boardNames.map((boardName) => (
                    <li key={boardName}>
                        <button
                            onClick={() => activeBoardStore.setState(()=>boardName)}
                            style={{
                                backgroundColor: selectedBoard === boardName ? "lightblue" : "white",
                            }}
                        >
                            {boardName}
                        </button>
                    </li>
                ))}
            </ul>


            <Board<ColumnType, "tasks", "name">
                columns={columns}
                itemsField="tasks"
                nameField="name"
                onUpdate={boardReducer}
                newColumnDef={{onDropTask:(oldColumnId, newColumnId, taskId, onCommit, onCancel)=> {
                        console.log("dropped task on new column")
                        //onCancel();
                    }}}
                classNames={{
                    board: "bg-gray-100",
                    column: "bg-gray-200",
                    columnTitle: "text-lg font-bold",
                    card: "bg-white shadow-md p-2 rounded",
                    overlayCard: "bg-blue-100",
                }}
            >
                {(card) => (
                    <button
                        className="text-start cursor-grab"
                        onClick={() => modal.open("kanban", "view", card)}
                    >
                        {card?.title} <Count />
                    </button>
                )}
            </Board>

            <CardViewModal />
            <EditBoardModal />
        </div>
    );
}