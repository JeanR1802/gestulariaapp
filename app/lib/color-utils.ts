export function classToComputedColor(className: string, property: 'background-color' | 'color') {
  if (typeof document === 'undefined') return null;
  try {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    el.style.width = '1px';
    el.style.height = '1px';
    el.className = className;
    document.body.appendChild(el);
    const cs = getComputedStyle(el)[property];
    document.body.removeChild(el);
    if (!cs) return null;
    // cs can be like 'rgb(34, 197, 94)' or '#fff'
    return cs;
  } catch (e) {
    return null;
  }
}
