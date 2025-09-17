export function camelCaseKeys<Out = any>(o: any): Out {
  if (typeof o !== "object" || !o) return o;
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [
    k.charAt(0).toLowerCase() + k.slice(1),
    camelCaseKeys(v)
  ])) as Out;
}