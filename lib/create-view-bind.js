export function createViewBind(view, viewContext) {
  if (!view) {
    return {};
  }
  const viewBind = {};
  const viewKeys = Object.keys(view);
  viewKeys.forEach(viewKey => {
    viewBind[viewKey] = view[viewKey].bind(viewContext);
  });
  return viewBind;
}