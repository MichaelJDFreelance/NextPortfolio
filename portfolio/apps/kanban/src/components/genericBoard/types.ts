export type Id = string;

export type TaskDropArgs = {
    taskId: Id;
    fromColumnId: Id;
    toColumnId: Id;
    overTaskId: Id | null; // insert before this, or append if null
};

export type ColumnDropArgs = {
    columnId: Id;
    overColumnId: Id | null; // insert before this column, or move to end if null
};