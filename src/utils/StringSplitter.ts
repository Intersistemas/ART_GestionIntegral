export abstract class StringSplitter {
  public abstract split(value?: string): string[];
}

function unique(value: string) { return Array.from(new Set(value)).join(""); }

//#region TupleStringSplitter
export type TupleStringSplitterDirections = "Begining" | "Ending" | "Alternate";
export class TupleStringSplitter extends StringSplitter {
  public size: number;
  public separators: string;
  public direction: TupleStringSplitterDirections;
  public invert: boolean;

  constructor({
    size,
    separators,
    direction = "Begining",
    invert = false,
  }: {
    size: number,
    separators: string,
    direction?: TupleStringSplitterDirections,
    invert?: boolean,
  }) {
    super();
    this.size = size;
    this.separators = separators;
    this.direction = direction;
    this.invert = invert;
  }

  public split(value?: string): string[] {
    if (this.size == 0) return [];
    else if (this.size < 0) throw new Error("Size must be positive");
    const result = new Array<string>(this.size);
    if (value == null || value === "") return result;
    if (!this.separators) throw new Error("Empty Separators");
    let separator = -1;
    let startIx = -1;
    let endIx = this.size;
    let lastIx = this.size - 1;
    for (let i = 0; i < this.size; i++) {
      separator++;
      if (separator == this.separators.length) separator = 0;

      let start = this.direction === "Alternate" ? (i % 2) === 0 : this.direction === "Begining";
      if (this.invert) start = !start;

      let resultIx = 0;
      let valueIx = 0;
      if (start) {
        valueIx = value.indexOf(this.separators[separator]);
        resultIx = ++startIx;
      } else {
        valueIx = value.lastIndexOf(this.separators[separator]);
        resultIx = --endIx;
      }

      if (valueIx < 0) {
        result[resultIx] = value;
        value = "";
        continue;
      }

      if (start) {
        if (lastIx === i) result[resultIx] = value;
        else result[resultIx] = value.slice(0, valueIx);
        valueIx++;
        if (valueIx === value.length) value = "";
        value = value.slice(valueIx);
        continue;
      }

      if (lastIx === i) result[resultIx] = value;
      else result[resultIx] = value.slice(valueIx + 1);
      if (valueIx === 0) value = "";
      else value = value.slice(0, valueIx);
    }
    return result;
  }
}
//#endregion TupleStringSplitter

//#region DelimitedStringSplitter
export class DelimitedStringSplitter extends StringSplitter {
  private _separator: string;
  public get separator() { return this._separator; };
  public set separator(value: string) { this._separator = value.charAt(0); }
  public open?: string;
  public close?: string;
  public escape?: string;
  public clean: boolean;

  constructor({
    separator,
    open,
    close,
    escape,
    clean = false,
  }: {
    separator: string,
    open?: string,
    close?: string,
    escape?: string,
    clean?: boolean,
  }) {
    super();
    this._separator = separator.charAt(0);
    this.open = open;
    this.close = close;
    this.escape = escape;
    this.clean = clean;
  }

  public split(value?: string, clean?: boolean): string[] {
    if (value == null || value === "") return [];
    let open = this.open, close = this.close, escape = this.escape;
    if (open == null || open === "") return value.split(this.separator);
    if (close == null || close === "") close = open;

    if (open.length !== unique(open).length || close.length !== unique(close).length)
      throw new Error("open/close delimiters must be unique");
    if (open.length !== close.length)
      throw new Error("Uneven open/close delimiters");

    if (clean == null) clean = this.clean;

    escape ??= "";
    const result: string[] = [];
    let level = 0;
    let delimiter = -1;
    let escaped = false;
    let part = "";
    for(let character = 0; character < value.length; character++) {
      if (escaped) {
        part += value[character];
        escaped = false;
        continue;
      }

      if (level === 0) delimiter = open.indexOf(value[character]);

      if (delimiter > -1) {
        if (delimiter < escape.length && value[character] === escape[delimiter]) {
          if (!clean) part += value[character];
          escaped = true;
          continue;
        }

        if (value[character] === open[delimiter]) {
          if (open[delimiter] === close[delimiter]) {
            level += level > 0 ? -1 : 1;
            if (clean) continue;
          } else {
            level++;
            if (clean && level === 1) continue;
          }
        } else if (value[character] === close[delimiter]) {
          level--;
          if (level < 0) throw new Error("Unbalanced delimiters");
          if (clean && level == 0) continue;
        }
        part += value[character];
        continue;
      }

      if (level > 0) {
        part += value[character];
        continue;
      }

      if (value[character] === this.separator) {
        result.push(part);
        part = "";
        continue;
      }
      part += value[character];
    }
    if (level !== 0) throw new Error("Unbalanced delimiters");
    if (part.length > 0) result.push(part);
    return result;
  }
}
//#endregion DelimitedStringSplitter
