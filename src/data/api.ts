export interface ExternalAPIGetURLParams {
  path?: string | URL;
  search?: string[][] | Record<string, string> | string | URLSearchParams;
}
export abstract class ExternalAPI {
  public abstract readonly basePath: string | URL;
  public getURL({ path = "", search }: ExternalAPIGetURLParams = {}) {
    const url = new URL(path, this.basePath);
    if (search === undefined) return url;
    if (!(search instanceof URLSearchParams)) search = new URLSearchParams(search)
    search.forEach((v, k) => url.searchParams.append(k, v));
    return url;
  }
}