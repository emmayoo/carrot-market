export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function getQueryString(object: Record<string, any>) {
  let qs = "";
  for (const key in object) {
    const value = object[key];
    if (value) qs += `&${key}=${value}`;
  }
  return qs.replace("&", "?");
}
