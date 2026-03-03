import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const getCanvasContext = () =>
  ({
    clearRect: () => undefined,
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillText: () => undefined,
    beginPath: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    stroke: () => undefined
  }) as unknown as CanvasRenderingContext2D;

vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(getCanvasContext);
