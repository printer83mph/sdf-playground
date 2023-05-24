import { MutableRefObject, useEffect, useState } from 'react';

export default function useMouseControls({
  canvasRef,
  dragButtons,
  onDrag,
}: {
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  dragButtons: number[];
  onDrag: (button: number, dist: [number, number]) => void;
}) {
  const [dragState, setDragState] = useState({ dragging: false, button: 0 });

  useEffect(() => {
    // capture reference to canvas element
    const canvas = canvasRef.current;

    function onMouseDown(evt: MouseEvent) {
      if (!dragButtons.includes(evt.button)) {
        return;
      }

      if (!dragState.dragging) {
        evt.preventDefault();
        setDragState({ dragging: true, button: evt.button });
        canvas.requestPointerLock();
      }
    }

    function onMouseMove(evt: MouseEvent) {
      if (dragState.dragging) {
        onDrag(dragState.button, [evt.movementX, evt.movementY]);
      }
    }

    function onMouseUp(evt: MouseEvent) {
      if (dragState.dragging) {
        evt.preventDefault();
        setDragState({ dragging: false, button: 0 });
        document.exitPointerLock();
      }
    }

    function onClick(evt: MouseEvent) {
      if (dragButtons.includes(evt.button)) {
        evt.preventDefault();
      }
    }

    function onContextMenu(evt: MouseEvent) {
      if (dragButtons.includes(evt.button)) {
        evt.preventDefault();
      }
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('contextmenu', onContextMenu);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('contextmenu', onContextMenu);
    };
  }, [canvasRef, onDrag, dragButtons, dragState.dragging, dragState.button]);
}
