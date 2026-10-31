export function replaceSlide<TSlide extends { position: number }>(
  slides: TSlide[],
  position: number,
  slide: TSlide,
) {
  return slides.map((currentSlide) =>
    currentSlide.position === position ? slide : currentSlide,
  );
}

export function planSlideReorder(
  currentPositions: number[],
  newOrder: number[],
) {
  const sortedPositions = (positions: number[]) =>
    [...positions].sort((a, b) => a - b).join();

  if (sortedPositions(newOrder) !== sortedPositions(currentPositions)) {
    return null;
  }

  return newOrder.map((from, index) => ({ from, to: index + 1 }));
}

export const getSlideFileName = (position: number) =>
  `slide-${String(position).padStart(2, "0")}.png`;
