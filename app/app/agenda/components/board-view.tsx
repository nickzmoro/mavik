"use client";

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";

import {
  agendaStatusLabels,
  agendaStatuses,
  type AgendaStatus,
} from "@/lib/mocks/agenda";
import { cn } from "@/lib/utils";

import type { ResolvedAgendaItem } from "../hooks/use-agenda";
import { AgendaItemCard, getAgendaItemAriaLabel } from "./agenda-item-card";
import {
  agendaDayCellClassName,
  agendaStatusDotClassNames,
} from "./agenda-status-styles";

const dndAnnouncements = {
  onDragStart: () => "Card selecionado. Use as setas para mudar de status.",
  onDragOver: ({ over }: { over: { id: string | number } | null }) =>
    over
      ? `Sobre a coluna ${agendaStatusLabels[over.id as AgendaStatus]}.`
      : "Fora das colunas.",
  onDragEnd: ({ over }: { over: { id: string | number } | null }) =>
    over
      ? `Card movido para ${agendaStatusLabels[over.id as AgendaStatus]}.`
      : "Card devolvido ao lugar.",
  onDragCancel: () => "Movimento cancelado.",
};

type DraggableAgendaItemProps = {
  item: ResolvedAgendaItem;
  onOpenItem: (itemId: string) => void;
};

function DraggableAgendaItem({ item, onOpenItem }: DraggableAgendaItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
  });

  return (
    <AgendaItemCard
      ref={setNodeRef}
      item={item}
      variant="detailed"
      detailedMeta="date"
      onClick={() => onOpenItem(item.id)}
      className={cn(
        "touch-manipulation",
        isDragging && "opacity-40 hover:translate-y-0 hover:shadow-none",
      )}
      {...attributes}
      {...listeners}
      aria-label={`${getAgendaItemAriaLabel(item)}. Arraste para mudar o status.`}
      aria-roledescription="card arrastável"
    />
  );
}

type BoardColumnProps = {
  status: AgendaStatus;
  items: ResolvedAgendaItem[];
  onOpenItem: (itemId: string) => void;
};

function BoardColumn({ status, items, onOpenItem }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      aria-label={agendaStatusLabels[status]}
      className={cn(
        "box-border flex min-h-130 min-w-0 flex-col gap-2 rounded-[18px] p-2.5 transition-[outline-color,background-color] duration-150 motion-reduce:transition-none",
        agendaDayCellClassName,
        "outline-2 -outline-offset-2 outline-transparent outline-dashed",
        isOver && "bg-hover-subtle outline-primary dark:bg-hover-subtle",
      )}
    >
      <div className="flex items-center gap-2 px-1 pt-1 pb-1.5">
        <span
          aria-hidden="true"
          className={cn(
            "size-2.5 rounded-full",
            agendaStatusDotClassNames[status],
          )}
        />
        <h3 className="m-0 flex-1 text-sm leading-[1.4] font-semibold">
          {agendaStatusLabels[status]}
        </h3>
        <span className="text-[13px] leading-[1.4] font-semibold text-muted">
          {items.length}
        </span>
      </div>
      {items.map((item) => (
        <DraggableAgendaItem
          key={item.id}
          item={item}
          onOpenItem={onOpenItem}
        />
      ))}
      {items.length === 0 ? (
        <p className="m-0 px-1.5 py-2 text-[13px] leading-normal text-muted">
          Nada aqui por enquanto.
        </p>
      ) : null}
    </section>
  );
}

type BoardViewProps = {
  items: ResolvedAgendaItem[];
  hiddenStatuses: AgendaStatus[];
  onOpenItem: (itemId: string) => void;
  onMoveItem: (itemId: string, status: AgendaStatus) => void;
};

export function BoardView({
  items,
  hiddenStatuses,
  onOpenItem,
  onMoveItem,
}: BoardViewProps) {
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const draggingItem = items.find((item) => item.id === draggingItemId);

  const handleDragStart = ({ active }: DragStartEvent) =>
    setDraggingItemId(String(active.id));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggingItemId(null);

    if (!over) {
      return;
    }

    const item = items.find((currentItem) => currentItem.id === active.id);
    const targetStatus = over.id as AgendaStatus;

    if (item && item.status !== targetStatus) {
      onMoveItem(item.id, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      accessibility={{ announcements: dndAnnouncements }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDraggingItemId(null)}
    >
      <div className="scrollbar-subtle overflow-x-auto">
        <div className="grid min-w-225 grid-cols-5 gap-2.5">
          {agendaStatuses.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              items={
                hiddenStatuses.includes(status)
                  ? []
                  : items.filter((item) => item.status === status)
              }
              onOpenItem={onOpenItem}
            />
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {draggingItem ? (
          <AgendaItemCard
            item={draggingItem}
            variant="detailed"
            detailedMeta="date"
            tabIndex={-1}
            className="rotate-2 cursor-grabbing shadow-[0_16px_32px_rgba(26,15,60,.25)]"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
