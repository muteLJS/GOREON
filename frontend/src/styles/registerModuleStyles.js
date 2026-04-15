const registeredModuleStyles = new WeakSet();

export function registerModuleStyles(styles) {
  registeredModuleStyles.add(styles);
}
