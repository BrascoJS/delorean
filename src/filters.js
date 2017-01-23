export function isFiltered(action, localFilter) {
  if (typeof window === 'undefined' && !localFilter) return true;
  if (!localFilter) return false;
  const { whitelist, blacklist } = localFilter;
  return (
    whitelist && !action.type.match(whitelist) ||
    blacklist && action.type.match(blacklist)
  );
}
