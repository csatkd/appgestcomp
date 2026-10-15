import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableWidget from '../components/DraggableWidget';
import { useToast } from '../components/ui';

interface Widget {
  id: string;
  title: string;
  component: React.ReactNode;
}

interface UseDraggableWidgetsOptions {
  initialWidgets: Widget[];
  storageKey?: string;
}

export function useDraggableWidgets({ initialWidgets, storageKey = 'dojang_widgets_order' }: UseDraggableWidgetsOptions) {
  const toast = useToast();
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const order = JSON.parse(stored) as string[];
        return order
          .map((id) => initialWidgets.find((w) => w.id === id))
          .filter((w): w is Widget => w !== undefined);
      } catch {
        return initialWidgets;
      }
    }
    return initialWidgets;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(newItems.map((w) => w.id)));
        
        toast('Ordre des widgets mis à jour');
        return newItems;
      });
    }
  };

  const resetOrder = () => {
    setWidgets(initialWidgets);
    localStorage.removeItem(storageKey);
    toast('Ordre des widgets réinitialisé', 'info');
  };

  return {
    widgets,
    sensors,
    handleDragEnd,
    resetOrder,
    DraggableWidget,
    DndContext,
    SortableContext,
    verticalListSortingStrategy,
  };
}
