export const toggleArrayItem = <TItem>(items: TItem[], item: TItem) =>
  items.includes(item)
    ? items.filter((currentItem) => currentItem !== item)
    : [...items, item];
