export class ExternalAPIError extends Error {
  public readonly code?: number;
  public readonly detail?: any;
  constructor(
    { code, detail, message }: {
      code?: number,
      detail?: any,
      message?: string
    } = {}
  ) {
    super(message);
    this.code = code;
    this.detail = detail;
  }
}
export abstract class ExternalAPI {
  public abstract readonly basePath: string | URL;
  public getURL(
    { path = "", search }: {
      path?: string | URL,
      search?: string[][] | Record<string, string> | string | URLSearchParams,
    } = {}
  ): URL {
    const url = new URL(path, this.basePath);
    if (search === undefined) return url;
    if (!(search instanceof URLSearchParams)) search = new URLSearchParams(search)
    search.forEach((v, k) => url.searchParams.append(k, v));
    return url;
  }
}