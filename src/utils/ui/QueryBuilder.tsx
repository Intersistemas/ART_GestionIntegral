"use client"
import React from 'react';
import { ThemeProvider } from '@mui/material';
import QueryBuilderComponent, { FullCombinator, FullField, FullOperator, QueryBuilderProps, RuleGroupTypeAny } from 'react-querybuilder';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import * as rtl from "@/utils/QueryBuilderDefaults"
import theme from '@/styles/theme';

export interface QueryBuilderProperties<RG extends RuleGroupTypeAny, F extends FullField, O extends FullOperator, C extends FullCombinator> {

}
/**
* The query builder component for React.
*
* See https://react-querybuilder.js.org/ for demos and documentation.
*
* @group Components
*/
export default function QueryBuilder(
  {
    combinators = rtl.combinatorsExtended,
    operators = rtl.operators,
    translations = rtl.translations,
    controlClassnames = rtl.classnames,
    ...rest
  }: any
) {
  return (
    <ThemeProvider theme={theme}>
      <QueryBuilderMaterial>
        <QueryBuilderComponent
          combinators={combinators}
          operators={operators}
          translations={translations}
          controlClassnames={controlClassnames}
          showNotToggle
          listsAsArrays
          {...rest}
        />
      </QueryBuilderMaterial>
    </ThemeProvider>
  );
}
