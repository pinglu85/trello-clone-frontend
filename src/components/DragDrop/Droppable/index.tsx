import { Children, useContext, useEffect, useRef } from 'react';

import DragDropContext from '../DragDropContext';
import createPlaceholder from './utils/createPlaceholder';
import setDraggedElementInitStyles from './utils/setDraggedElementInitStyles';
import { INIT_GLOBAL_STYLES, ON_DRAG_GLOBAL_STYLES } from '../constants';
import moveDraggedElement from './utils/moveDraggedElement';
import rearrangeElements from './utils/rearrangeElements';
import scrollWhileDragging from './utils/scrollWhileDragging';
import resetDragDropData from './utils/resetDragDropData';
import type { DroppableProps } from './types';

const Droppable = ({
  droppableId,
  type,
  children,
  ...props
}: DroppableProps): JSX.Element => {
  const { dragDropData, onDragEnd, setGlobalStyles } =
    useContext(DragDropContext);
  const droppableRef = useRef<HTMLDivElement>(null);
  const isTickingRef = useRef(false);

  useEffect(() => {
    if (!droppableRef.current) return;

    const droppable = droppableRef.current;
    const { emptyDroppables } = dragDropData;

    if (Children.count(children) === 0) {
      emptyDroppables.set(droppable, type);
    } else if (emptyDroppables.has(droppable)) {
      emptyDroppables.delete(droppable);
    }

    return () => {
      emptyDroppables.delete(droppable);
    };
  }, [dragDropData, children, droppableId, type]);

  const onMouseMove = (e: React.MouseEvent): void => {
    const { draggedElement, draggedElementRect, isDragging } = dragDropData;
    if (!draggedElement || !droppableRef.current) return;

    if (!isDragging) {
      dragDropData.isDragging = true;
      dragDropData.droppableType = type;

      dragDropData.placeholder = createPlaceholder(
        draggedElement,
        draggedElementRect.width,
        draggedElementRect.height,
        dragDropData.placeholderClassName
      );

      setDraggedElementInitStyles(
        draggedElement,
        draggedElementRect.width,
        draggedElementRect.height
      );

      droppableRef.current.insertBefore(
        dragDropData.placeholder,
        draggedElement
      );
      setGlobalStyles(ON_DRAG_GLOBAL_STYLES);
    }

    requestTick(e);
  };

  const requestTick = (e: React.MouseEvent): void => {
    if (!isTickingRef.current) {
      isTickingRef.current = true;
      requestAnimationFrame(update.bind(null, e));
    }
  };

  const update = (e: React.MouseEvent): void => {
    if (!dragDropData.isDragging || !droppableRef.current) return;

    const droppable = droppableRef.current;
    moveDraggedElement(e, dragDropData);
    rearrangeElements(e, droppable, type, dragDropData);
    scrollWhileDragging(droppable, dragDropData);
    isTickingRef.current = false;
  };

  const onMouseUp = (): void => {
    const { draggedElement, isDragging, placeholder } = dragDropData;
    dragDropData.draggedElement = null;

    if (!isDragging || !draggedElement || !placeholder) return;

    setGlobalStyles(INIT_GLOBAL_STYLES);
    draggedElement.setAttribute('style', '');

    onDragEnd({
      sourceIdx: dragDropData.draggedElementIdx,
      destinationIdx: dragDropData.destinationIdx,
      oldParentId: dragDropData.initParentId,
      newParentId: dragDropData.newParentId,
    });

    placeholder.parentElement?.removeChild(placeholder);
    resetDragDropData(dragDropData);
  };

  return (
    <div
      ref={droppableRef}
      data-droppable-id={droppableId}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      {...props}
    >
      {children}
    </div>
  );
};

export default Droppable;