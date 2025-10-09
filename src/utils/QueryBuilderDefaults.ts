import {
  defaultPlaceholderFieldGroupLabel,
  defaultPlaceholderFieldLabel,
  defaultPlaceholderFieldName,
  defaultPlaceholderOperatorGroupLabel,
  defaultPlaceholderOperatorLabel,
  defaultPlaceholderOperatorName,
  defaultPlaceholderValueGroupLabel,
  defaultPlaceholderValueLabel,
  defaultPlaceholderValueName,
  type DefaultCombinators,
  type DefaultCombinatorsExtended,
  type DefaultOperators,
  type TranslationsFull
} from "react-querybuilder";

export const defaultCombinators: DefaultCombinators = [
  { name: 'and', value: 'and', label: 'Todos' } as const,
  { name: 'or', value: 'or', label: 'Alguno' } as const,
];

export const defaultCombinatorsExtended: DefaultCombinatorsExtended = [
  ...defaultCombinators,
  { name: 'xor', value: 'xor', label: 'Alguno, pero no todos' } as const,
];

export const defaultOperators: DefaultOperators = [
  { name: '=', value: '=', label: '=' },
  { name: '!=', value: '!=', label: '!=' },
  { name: '<', value: '<', label: '<' },
  { name: '>', value: '>', label: '>' },
  { name: '<=', value: '<=', label: '<=' },
  { name: '>=', value: '>=', label: '>=' },
  { name: 'contains', value: 'contains', label: 'contiene' },
  { name: 'beginsWith', value: 'beginsWith', label: 'empieza con' },
  { name: 'endsWith', value: 'endsWith', label: 'termina con' },
  { name: 'doesNotContain', value: 'doesNotContain', label: 'no contiene' },
  { name: 'doesNotBeginWith', value: 'doesNotBeginWith', label: 'no empieza con' },
  { name: 'doesNotEndWith', value: 'doesNotEndWith', label: 'no termina con' },
  { name: 'null', value: 'null', label: 'es null' },
  { name: 'notNull', value: 'notNull', label: 'no es null' },
  { name: 'in', value: 'in', label: 'presente en' },
  { name: 'notIn', value: 'notIn', label: 'ausente en' },
  { name: 'between', value: 'between', label: 'entre' },
  { name: 'notBetween', value: 'notBetween', label: 'fuera' },
];

export const defaultTranslations: TranslationsFull = {
  fields: {
    title: 'Campos',
    placeholderName: defaultPlaceholderFieldName,
    placeholderLabel: defaultPlaceholderFieldLabel,
    placeholderGroupLabel: defaultPlaceholderFieldGroupLabel,
  } as const,
  operators: {
    title: 'Operadores',
    placeholderName: defaultPlaceholderOperatorName,
    placeholderLabel: defaultPlaceholderOperatorLabel,
    placeholderGroupLabel: defaultPlaceholderOperatorGroupLabel,
  } as const,
  values: {
    title: 'Valores',
    placeholderName: defaultPlaceholderValueName,
    placeholderLabel: defaultPlaceholderValueLabel,
    placeholderGroupLabel: defaultPlaceholderValueGroupLabel,
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
    label: '⨯',
    title: 'Quita regla',
  } as const,
  removeGroup: {
    label: '⨯',
    title: 'Quita grupo',
  } as const,
  addRule: {
    label: '+ Regla',
    title: 'Agrega regla',
  } as const,
  addGroup: {
    label: '+ Grupo',
    title: 'Agrega grupo',
  } as const,
  combinators: {
    title: 'Combinadores',
  } as const,
  notToggle: {
    label: 'No',
    title: 'Invierte este grupo',
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
} satisfies TranslationsFull;