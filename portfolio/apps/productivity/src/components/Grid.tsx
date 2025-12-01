"use client"

import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const GridItem = ({ id, src, onDropFile }:{ id: string, src?: string, onDropFile: (id: string, file: File) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: 100,
        height: 100,
        margin: 10,
        backgroundColor: "#eee",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        overflow: "hidden",
        cursor: "grab",
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDropFile(id, e.dataTransfer.files[0]);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            {src ? <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : id}
        </div>
    );
};


const Grid = () => {
    const [items, setItems] = useState(
        ["1", "2", "3", "4", "5", "6"].map((id) => ({ id, src: undefined as string | undefined }))
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleDropFile = (id: string, file: File) => {
        const url = URL.createObjectURL(file);
        setItems((items) =>
            items.map((item) => (item.id === id ? { ...item, src: url } : item))
        );
    };

    const handleDropOnGrid = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const newItem = {
            id: crypto.randomUUID(), // or some simple counter
            src: url,
        };

        setItems((prev) => [...prev, newItem]);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
                <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 340, padding:100 }}
                >
                    {items.map(({ id, src }) => (
                        <GridItem key={id} id={id} src={src} onDropFile={handleDropFile} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};


export default Grid;
