import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical } from './Icons';

interface DraggableWidgetProps {
  id: string;
  children: React.ReactNode;
}

export default function DraggableWidget({ id, children }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 cursor-move p-1 rounded hover:bg-bark transition-colors"
        title="Glisser pour réorganiser"
      >
        <IconGripVertical className="w-4 h-4 text-dune" />
      </div>
      {children}
    </div>
  );
}
