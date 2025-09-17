"use client"


import {useStore} from "@tanstack/react-store";
import {addColumn, boardStore, createBoard} from "@/store/boardStore";
import {activeBoardStore} from "@/store/activeStore";
import {columnOrderStore} from "@/store/coloumnStore";
import Board from "@/components/Board";
import {CardViewModal} from "@/components/modals/CardViewModal";
import {EditBoardModal} from "@/components/modals/EditBoardModal";
import {Count} from "@/components/Count";
import modal from "@/lib/ModalReducer";
import {boards} from "@/store/supabaseBoardStore";
import {useEffect} from "react";


export default function SupabasePage() {
    //const boards = useStore(boards);
    useEffect(() => {
        const unmount = boards.mount();

        return () => unmount();
    }, []);

    const board = useStore(boards);
    const boardNames = useStore(boards, (allBoards) => allBoards?Object.keys(allBoards):[]);
    const selectedBoard = useStore(activeBoardStore)
    const columns = useStore(boards, (allBoards) => allBoards?(selectedBoard?allBoards[selectedBoard]:{}):{});
    const columnOrder = useStore(columnOrderStore, (order) => selectedBoard?order[selectedBoard]:[]);

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

            <Board
                columnOrder={columnOrder}
                setColumnOrder={(columnOrder)=>columnOrderStore.setState(cos=> ({...cos, [selectedBoard]: columnOrder }))}
                onAddNewColumn={(card)=>alert("Board now")}
                columns={columns}
                itemsField="tasks"
                nameField="name"
                /*onUpdate={(data) => boardStore.setState((prev) => ({...prev, [selectedBoard]: data }))}*/
                classNames={{board:"bg-gray-100", column:"bg-gray-200", columnTitle:"text-lg font-bold", card:"bg-white shadow-md p-2 rounded", overlayCard:"bg-blue-100"}}
            >
                {(card) => (
                    <button className={`text-start cursor-grab`} onClick={()=>modal.open("kanban", "view", card)}>{card?.title} <Count /></button>
                )}
            </Board>

            <CardViewModal />
            <EditBoardModal />
        </div>
    );
}