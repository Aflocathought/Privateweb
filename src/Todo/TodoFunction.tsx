export function calculateBackgroundColor(color: string) {
    let r =
      parseInt(color.slice(1, 3), 16) + 70 > 255
        ? 255
        : parseInt(color.slice(1, 3), 16) + 70;
    let g =
      parseInt(color.slice(3, 5), 16) + 70 > 255
        ? 255
        : parseInt(color.slice(3, 5), 16) + 70;
    let b =
      parseInt(color.slice(5, 7), 16) + 70 > 255
        ? 255
        : parseInt(color.slice(5, 7), 16) + 70;
    let a = 0.18;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

export function calculateBackgroundColor2(color: string) {
    let r =
      parseInt(color.slice(1, 3), 16) + 35 > 255
        ? 255
        : parseInt(color.slice(1, 3), 16) + 35;
    let g =
      parseInt(color.slice(3, 5), 16) + 35 > 255
        ? 255
        : parseInt(color.slice(3, 5), 16) + 35;
    let b =
      parseInt(color.slice(5, 7), 16) + 35 > 255
        ? 255
        : parseInt(color.slice(5, 7), 16) + 35;
    let a = 0.25;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }