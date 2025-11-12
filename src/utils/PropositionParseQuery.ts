//src/utils/PropositionParseQuery.ts
import type {
  RuleGroupType,
  RuleType,
  ValueSource,
} from "react-querybuilder";
import { DelimitedStringSplitter, TupleStringSplitter } from "./StringSplitter";
import { parseNumber } from "./utils";

const DELIMITED = new DelimitedStringSplitter({ separator: ",", open: "\"'(", close: "\"')", escape: "\\\\" });
const TUPLE = new TupleStringSplitter({ size: 3, separators: "()", direction: "Alternate" });

//#region Types
type FunctionConnector = "Conjunction" | "InclusiveDisjunction" | "ExclusiveDisjunction";
type FunctionName = "Equal"
  | "NotEqual"
  | "GreaterThan"
  | "GreaterThanEqual"
  | "LessThan"
  | "LessThanEqual"
  | "Like"
  | "In"
  | "Complement"
  | FunctionConnector;
type FunctionInfo = { name: FunctionName, connector?: FunctionConnector };
type OperandType = "null" | "number" | "string" | "function" | "variable";
type OperandInfo<V = any> = { type: OperandType, value: V };
type OperatorSelector = <V>(info: { field: string, value: OperandInfo<V> }) => string;
//#endregion Types

//Estandariza el nombre de la función
function functionInfo(name: string): FunctionInfo | undefined {
  switch (name.trim().toLowerCase()) {
    //#region Equal
    case "=":
    case "=&":
    case "eq":
    case "eqand":
    case "equal":
    case "equaland":
      return { name: "Equal", connector: "Conjunction" };
    case "=|":
    case "eqor":
    case "equalor":
      return { name: "Equal", connector: "InclusiveDisjunction" };
    case "=^":
    case "eqxor":
    case "equalxor":
      return { name: "Equal", connector: "ExclusiveDisjunction" };
    //#endregion Equal
    //#region GreaterThan
    case ">":
    case ">&":
    case "gt":
    case "gtand":
    case "greater":
    case "greaterand":
    case "greaterthan":
    case "greaterthanand":
      return { name: "GreaterThan", connector: "Conjunction" };
    case ">|":
    case "gtor":
    case "greateror":
    case "greaterthanor":
      return { name: "GreaterThan", connector: "InclusiveDisjunction" };
    case ">^":
    case "gtxor":
    case "greaterxor":
    case "greaterthanxor":
      return { name: "GreaterThan", connector: "ExclusiveDisjunction" };
    //#endregion GreaterThan
    //#region GreaterThanEqual
    case ">=":
    case ">=&":
    case "gte":
    case "gteand":
    case "greaterequal":
    case "greaterequaland":
    case "greaterthanequal":
    case "greaterthanequaland":
      return { name: "GreaterThanEqual", connector: "Conjunction" };
    case ">=|":
    case "gteor":
    case "greaterequalor":
    case "greaterthanequalor":
      return { name: "GreaterThanEqual", connector: "InclusiveDisjunction" };
    case ">=^":
    case "gtexor":
    case "greaterequalxor":
    case "greaterthanequalxor":
      return { name: "GreaterThanEqual", connector: "ExclusiveDisjunction" };
    //#endregion GreaterThanEqual
    //#region LessThan
    case "<":
    case "<&":
    case "lt":
    case "less":
    case "ltand":
    case "lessthan":
    case "lessthanand":
      return { name: "LessThan", connector: "Conjunction" };
    case "<|":
    case "ltor":
    case "lessor":
    case "lessthanor":
      return { name: "LessThan", connector: "InclusiveDisjunction" };
    case "<^":
    case "ltxor":
    case "lessxor":
    case "lessthanxor":
      return { name: "LessThan", connector: "ExclusiveDisjunction" };
    //#endregion LessThan
    //#region LessThanEqual
    case "<=":
    case "<=&":
    case "lte":
    case "lteand":
    case "lessequal":
    case "lessequaland":
    case "lessthanequal":
    case "lessthanequaland":
      return { name: "LessThanEqual", connector: "Conjunction" };
    case "<=|":
    case "lteor":
    case "lessequalor":
    case "lessthanequalor":
      return { name: "LessThanEqual", connector: "InclusiveDisjunction" };
    case "<=^":
    case "ltexor":
    case "lessequalxor":
    case "lessthanequalxor":
      return { name: "LessThanEqual", connector: "ExclusiveDisjunction" };
    //#endregion LessThanEqual
    //#region Like
    case "~":
    case "~&":
    case "like":
    case "likeand":
      return { name: "Like", connector: "Conjunction" };
    case "~|":
    case "likeor":
      return { name: "Like", connector: "InclusiveDisjunction" };
    case "~^":
    case "likexor":
      return { name: "Like", connector: "ExclusiveDisjunction" };
    //#endregion Like
    //#region NotEqual
    case "!=":
    case "!=&":
    case "neq":
    case "neqand":
    case "notequal":
    case "notequaland":
      return { name: "NotEqual", connector: "Conjunction" };
    case "!=|":
    case "neqor":
    case "notequalor":
      return { name: "NotEqual", connector: "InclusiveDisjunction" };
    case "!=^":
    case "neqxor":
    case "notequalxor":
      return { name: "NotEqual", connector: "ExclusiveDisjunction" };
    //#endregion NotEqual
    //#region In
    case "@":
    case "in":
      return { name: "In" };
    //#endregion In
    //#region Complement
    case "!":
    case "!&":
    case "not":
    case "notand":
    case "negate":
    case "negation":
    case "negateand":
    case "complement":
    case "negationand":
    case "complementand":
      return { name: "Complement", connector: "Conjunction" };
    case "!|":
    case "notor":
    case "negateor":
    case "negationor":
    case "complementor":
      return { name: "Complement", connector: "InclusiveDisjunction" };
    case "!^":
    case "notxor":
    case "negatexor":
    case "negationxor":
    case "complementxor":
      return { name: "Complement", connector: "ExclusiveDisjunction" };
    //#endregion Complement
    //#region Conjunction
    case "&":
    case "and":
    case "conjunction":
      return { name: "Conjunction", connector: "Conjunction" };
    //#endregion Conjunction
    //#region InclusiveDisjunction
    case "|":
    case "or":
    case "inclusive":
    case "inclusiveor":
    case "disjunction":
    case "inclusivedisjunction":
      return { name: "InclusiveDisjunction", connector: "InclusiveDisjunction" };
    //#endregion InclusiveDisjunction
    //#region ExclusiveDisjunction
    case "^":
    case "xor":
    case "exclusive":
    case "exclusiveor":
    case "exclusivedisjunction":
      return { name: "ExclusiveDisjunction", connector: "ExclusiveDisjunction" };
    //#endregion ExclusiveDisjunction
    default:
      return undefined;
  };
}

//Emite el mensaje en consola y crea un Error
function newError(message: string) {
  console.error(message);
  return new Error(message);
}

//Deduce el tipo de operando
function operandType(operand: string): OperandType {
  operand = operand.trim().toLowerCase()
  if (["", "null"].includes(operand)) return "null";
  const char = operand[0];
  if (["\"", "'"].includes(char)) {
    if (operand.endsWith(char)) return "string";
    throw newError(`Malformed string constant: ${operand}`);
  }
  if (operand.endsWith(")")) return "function";
  const n = parseNumber(operand);
  if (n !== undefined) return "number";
  return "variable";
}

//Genera una regla simple
function buildRule(a: string, b: string, selector: OperatorSelector): RuleType {
  const aType = operandType(a);
  const bType = operandType(b);
  let field: string = "";
  let value: any = undefined;
  let valueSource: ValueSource;
  let valueType: OperandType;
  if (bType === "variable") {
    field = b;
    ({ type: valueType, value, valueSource } = parseValue(a, aType));
  } else {
    field = a;
    ({ type: valueType, value, valueSource } = parseValue(b, bType));
  }
  return {
    operator: selector({ field, value: { type: valueType, value } }),
    field, value, valueSource
  };
  function parseValue(value: string, type: OperandType): { type: OperandType, value: any, valueSource: ValueSource } {
    if (type === "null") return { type, value: "", valueSource: "value" };
    if (type === "number") return { type, value: parseNumber(value), valueSource: "value" };
    if (type === "string") return { type, value: DELIMITED.split(value, true).join(","), valueSource: "value" };
    if (type === "function") return { type, value, valueSource: "value" };
    return { type, value, valueSource: "field" };
  }
}

//Traduce un conector a combinator
function getCombinator(c: FunctionConnector) {
  switch (c) {
    case "Conjunction": return "and";
    case "InclusiveDisjunction": return "or";
    case "ExclusiveDisjunction": return "xor";
  }
}

export function isRuleGroupType(rule: RuleGroupType | RuleType): rule is RuleGroupType { return "combinator" in rule; };

export function parseFunction(name: string, args: string[]): RuleGroupType | RuleType {
  const info = functionInfo(name);
  if (!info) throw newError(`Unknown function \"${name}\"`);
  switch (info.name) {
    //#region Equal
    case "Equal": {
      switch (args.length) {
        case 0:
        case 1: throw newError(`Wrong number of parameters for \"${name}\"`);
        case 2: return buildRule(args[0], args[1], ({ value: { type } }) => type === "null" ? "null" : "=");
        default: return {
          combinator: getCombinator(info.connector!),
          rules: args.slice(1).map(arg => parseFunction(info.name, [args[0], arg])),
        };
      }
    }
    //#endregion Equal
    //#region NotEqual
    case "NotEqual": {
      switch (args.length) {
        case 0:
        case 1: throw newError(`Wrong number of parameters for \"${name}\"`);
        case 2: return buildRule(args[0], args[1], ({ value: { type } }) => type === "null" ? "notNull" : "!=");
        default: return {
          combinator: getCombinator(info.connector!),
          rules: args.slice(1).map(arg => parseFunction(info.name, [args[0], arg])),
        };
      }
    }
    //#endregion NotEqual
    //#region GreaterThan
    case "GreaterThan": {
      switch (args.length) {
        case 0:
        case 1: throw newError(`Wrong number of parameters for \"${name}\"`);
        case 2: return buildRule(args[0], args[1], () => ">");
        default: return {
          combinator: getCombinator(info.connector!),
          rules: args.slice(1).map(arg => parseFunction(info.name, [args[0], arg])),
        };
      }
    }
    //#endregion GreaterThan
    //#region GreaterThanEqual
    case "GreaterThanEqual": {
      switch (args.length) {
        case 0:
        case 1: throw newError(`Wrong number of parameters for \"${name}\"`);
        case 2: return buildRule(args[0], args[1], () => ">=");
        default: return {
          combinator: getCombinator(info.connector!),
          rules: args.slice(1).map(arg => parseFunction(info.name, [args[0], arg])),
        };
      }
    }
    //#endregion GreaterThanEqual
    //#region LessThan
    case "LessThan": {
      switch (args.length) {
        case 0:
        case 1: throw newError(`Wrong number of parameters for \"${name}\"`);
        case 2: return buildRule(args[0], args[1], () => "<");
        default: return {
          combinator: getCombinator(info.connector!),
          rules: args.slice(1).map(arg => parseFunction(info.name, [args[0], arg])),
        };
      }
    }
    //#endregion LessThan
    //#region LessThanEqual
    case "LessThanEqual": {
      switch (args.length) {
        case 0:
        case 1: throw newError(`Wrong number of parameters for \"${name}\"`);
        case 2: return buildRule(args[0], args[1], () => "<=");
        default: return {
          combinator: getCombinator(info.connector!),
          rules: args.slice(1).map(arg => parseFunction(info.name, [args[0], arg])),
        };
      }
    }
    //#endregion LessThanEqual
    //#region Like
    case "Like": {
      switch (args.length) {
        case 0:
        case 1: throw newError(`Wrong number of parameters for \"${name}\"`);
        case 2: {
          let ruleValue: any;
          const rule = buildRule(args[0], args[1], ({ value }) => {
            if (value.type !== "string") throw newError(`first 'like' operand must be string \"${name}\"`);
            const v = `${value.value}`;
            const start = v.startsWith('%');
            const end = v.endsWith('%');
            if (start && end) { ruleValue = v.slice(1, v.length - 1); return "contains"; }
            if (start) { ruleValue = v.slice(1); return "endsWith"; }
            if (end) { ruleValue = v.slice(0, v.length - 1); return "beginsWith"; }
            return "=";
          });
          rule.value = ruleValue;
          return rule;
        }
        default: return {
          combinator: getCombinator(info.connector!),
          rules: args.slice(1).map(arg => parseFunction(info.name, [args[0], arg])),
        };
      }
    }
    //#endregion Like
    //#region In
    case "In": {
      switch (args.length) {
        case 0:
        case 1: throw newError(`Wrong number of parameters for \"${name}\"`);
        default: return buildRule(args[0], args.slice(1).join(","), () => "in");
      }
    }
    //#endregion In
    //#region Complement
    case "Complement": {
      if (args.length === 0) throw newError(`Wrong number of parameters for \"${name}\"`);
      const combinator = getCombinator(info.connector!);
      if (args.length === 1) {
        const rule = parsePropositionRule(args[0], combinator);
        if (isRuleGroupType(rule)) {
          rule.not = true;
          return rule;
        }
        return { combinator , not: true, rules: [rule] };
      }
      return { combinator, not: true, rules: args.map(arg => parsePropositionRule(arg, combinator)) };
    }
    //#endregion Complement
    //#region Conjunction, InclusiveDisjunction, ExclusiveDisjunction
    default: {
      if (args.length === 0) throw newError(`Wrong number of parameters for \"${name}\"`);
      const combinator = getCombinator(info.name);
      return { combinator, rules: args.map(arg => parsePropositionRule(arg, combinator)) };
    }
    //#endregion Conjunction, InclusiveDisjunction, ExclusiveDisjunction
  }
}

export function parsePropositionRule(proposition: string = "", combinator: string = "and"): RuleGroupType | RuleType {
  let expressions = DELIMITED.split(proposition.trim(), false);
  switch(expressions.length) {
    case 1: {
      proposition = expressions[0];
      break;
    }
    default: return { combinator, rules: expressions.map(exp => parsePropositionRule(exp, combinator)) };
  }
  let parts = TUPLE.split(proposition);
  return parseFunction(parts[0].trim(), DELIMITED.split(parts[1].trim()).map(r => r.trim()));
}

export default function parsePropositionGroup(proposition: string = "", combinator: string = "and"): RuleGroupType {
  const rule = parsePropositionRule(proposition, combinator);
  if (isRuleGroupType(rule)) return rule;
  return { combinator, rules: [rule] };
}