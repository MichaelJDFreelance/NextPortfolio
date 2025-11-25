import {BoardUpdateAction} from "@/hooks/useBoard";
import {supabaseColumnStore, supabaseTaskStore} from "@/store/supabaseBoardStore";
import {activeBoardStore} from "@/store/activeStore";
import {supabase} from "@/lib/supabase";

export function boardReducer(action: BoardUpdateAction<any, any>) {
    switch (action.type) {

        case "ADD_COLUMN": {
            const boardId = activeBoardStore.state;
            if (!boardId) return;
            supabaseColumnStore.setState(prev => {
                const next = [...(prev[boardId] || [])];
                next.push(action.column);
                return { ...prev, [boardId]: next };
            });
            break;
        }

        case "ADD_TASK": {
            const task = action.task;
            supabaseTaskStore.setState(prev => {
                const next = [...(prev[task.column_id] || [])];
                next.push(task);
                return { ...prev, [task.column_id]: next };
            });
            break;
        }

        case "EDIT_TASK": {
            const task = action.task;
            supabaseTaskStore.setState(prev => {
                const next = [...(prev[task.column_id] || [])];
                const nextTasks = next.map(t => t.id === task.id ? task : t);
                return { ...prev, [task.column_id]: nextTasks };
            })
            break;
        }

        case "REORDER_COLUMNS": {
            console.log("reordering columns", action);
            const boardId = activeBoardStore.state;
            if (!boardId) return;

            action.order.map((colId, idx) => {
                supabase.from('KanbanColumns').update({order: idx}).eq('id', colId)
                    .then(({data, error})=>{
                        if (error) console.error(error);
                        if (data) console.log(data);
                    });
            })

            supabaseColumnStore.setState(prev => {
                const updated = action.order.map((colId, idx) => {
                    const col = prev[boardId].find((c:any) => c.id === colId)!;
                    return { ...col, order: idx };
                });

                return { ...prev, [boardId]: updated };
            });
            break;
        }

        case "REORDER_TASKS": {
            console.log("reordering task", action);
            supabaseTaskStore.setState(prev => {
                const next = { ...prev };

                action.tasks.map(task => {
                    supabase.from('KanbanTasks').update({order: task.order}).eq('id', task.id)
                        .then(({data, error})=>{
                            if (error) console.error(error);
                            if (data) console.log(data);
                        });
                })


                action.tasks.forEach(task => {
                    const tasks = [...(next[task.column_id] ?? [])];
                    const idx = tasks.findIndex(t => t.id === task.id);

                    if (idx !== -1) {
                        tasks[idx] = task; // update existing
                    } else {
                        tasks.push(task); // or insert new
                    }

                    next[task.column_id] = tasks;

                });

                return next;
            });
            break;
        }


        case "MOVE_TASK": {
            console.log("moving task", action);
            supabaseTaskStore.setState(prev => {
                const updated = { ...prev };
                

                Promise.all(
                    Object.entries(action.tasks).map(([columnId, taskList]) => {
                        return Promise.all(
                            taskList.map((task) => {
                                const { id, ...rest } = task;

                                // Execute Supabase update
                                return supabase
                                    .from('KanbanTasks')
                                    .update({ ...rest, column_id:columnId }) // Update with the task's rest fields
                                    .eq('id', id) // Match the task by id
                                    .then(({ data, error }) => {
                                        if (error) {
                                            console.error(`Error updating task with ID ${id}:`, error);
                                        }
                                        if (data) {
                                            console.log(`Task updated successfully with ID ${id}:`, data);
                                        }
                                    });
                            })
                        );
                    })
                ).then(() => {
                    console.log("All updates completed");
                }).catch((error) => {
                    console.error("An error occurred while updating tasks:", error);
                });

                for (const [colId, newTasks] of Object.entries(action.tasks)) {
                    updated[colId] = newTasks.map((task, idx) => ({
                        ...task,
                        order: idx,        // ✅ normalize order
                        column_id: colId,  // ✅ enforce correct column_id
                    }));
                }

                return updated;
            });
            break;
        }

        default: {}
            //return state;
    }
}