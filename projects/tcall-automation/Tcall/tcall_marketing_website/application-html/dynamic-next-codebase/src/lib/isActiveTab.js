export const isActiveTab = (currentPath, path) => {
  return currentPath.includes(path) ? "js-active" : "";
};
