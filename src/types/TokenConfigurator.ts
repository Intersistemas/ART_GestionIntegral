import axios, { Axios } from "axios";
import { getSession } from "next-auth/react";

export default class TokenConfigurator {
  private token = "";
  public getToken() { return this.token; }
  public configure(instance?: Axios) {
    instance ??= axios.create();

    //#region request
    instance.interceptors.request.use(async (config) => {
      const token = (await getSession())?.accessToken;
      if (token) {
        if (this.token !== token) this.token = token;
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    })
    //#endregion request

    return instance;
  }
}