import type { Classnames, FlexibleOptionListProp, FullCombinator, FullOperator, Translations } from "react-querybuilder";

export const classnames: Partial<Classnames> = {
  queryBuilder: 'queryBuilder-branches',
}

export const combinators: FlexibleOptionListProp<FullCombinator> = [
  { name: 'and', label: 'Y' } as const,
  { name: 'or', label: 'O' } as const,
];

// No soportado por sql
export const combinatorsExtended: FlexibleOptionListProp<FullCombinator> = [
  ...combinators,
  { name: 'xor', label: 'X' } as const,
];

export const operators: FlexibleOptionListProp<FullOperator> = [
  { name: '=', label: '=' } as const,
  { name: '!=', label: '!=' },
  { name: '<', label: '<' } as const,
  { name: '>', label: '>' },
  { name: '<=', label: '<=' },
  { name: '>=', label: '>=' },
  { name: 'contains', label: 'contiene' },
  { name: 'beginsWith', label: 'empieza con' },
  { name: 'endsWith', label: 'termina con' },
  { name: 'doesNotContain', label: 'no contiene' },
  { name: 'doesNotBeginWith', label: 'no empieza con' },
  { name: 'doesNotEndWith', label: 'no termina con' },
  { name: 'null', label: 'es vacío' },
  { name: 'notNull', label: 'no es vacío' },
  { name: 'in', label: 'presente en' },
  { name: 'notIn', label: 'ausente en' },
  { name: 'between', label: 'entre' },
  { name: 'notBetween', label: 'fuera' },
];

export const translations: Partial<Translations> = {
  fields: {
    title: 'Campos',
  } as const,
  operators: {
    title: 'Operadores',
  } as const,
  values: {
    title: 'Valores',
  } as const,
  matchMode: {
    title: 'Modo de conicidencia',
  } as const,
  matchThreshold: {
    title: 'Umbral de coincidencia',
  } as const,
  value: {
    title: 'Valor',
  } as const,
  removeRule: {
    label: 'X',
    title: 'Quita regla',
  } as const,
  removeGroup: {
    label: 'X',
    title: 'Quita grupo',
  } as const,
  addRule: {
    label: 'Agregar Regla',
    title: 'Agrega regla',
  } as const,
  addGroup: {
    label: 'Agregar Grupo',
    title: 'Agrega grupo',
  } as const,
  combinators: {
    title: 'Combinadores',
  } as const,
  notToggle: {
    label: 'Contiene/No contiene',
    title: 'Contiene/No contiene',
  } as const,
  cloneRule: {
    label: '⧉',
    title: 'Clona regla',
  } as const,
  cloneRuleGroup: {
    label: '⧉',
    title: 'Clona grupo',
  } as const,
  shiftActionUp: {
    label: '˄',
    title: 'Sube',
  } as const,
  shiftActionDown: {
    label: '˅',
    title: 'Baja',
  } as const,
  dragHandle: {
    label: '⁞⁞',
    title: 'Arrastra',
  } as const,
  lockRule: {
    label: '🔓',
    title: 'Bloquea regla',
  } as const,
  lockGroup: {
    label: '🔓',
    title: 'Bloquea grupo',
  } as const,
  lockRuleDisabled: {
    label: '🔒',
    title: 'Desbloquea regla',
  } as const,
  lockGroupDisabled: {
    label: '🔒',
    title: 'Desbloquea grupo',
  } as const,
  valueSourceSelector: {
    title: 'Origen de valor',
  } as const,
};