// src/utils/ui/queryBuilder/QueryBuilder.tsx

"use client"
import React from 'react';
import { ThemeProvider } from '@mui/material';
import QueryBuilderComponent, { FullCombinator, FullField, FullOperator, QueryBuilderProps, RuleGroupTypeAny } from 'react-querybuilder';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import * as rtl from "@/utils/ui/queryBuilder/QueryBuilderDefaults"
import theme from '@/styles/theme';
import "./QueryBuilder.css"
import CustomNotToggle from './CustomNotToggle';
import CustomCombinatorSelector from './CustomCombinatorSelector'; // <-- ¡NUEVA IMPORTACIÓN!

const customControlElements = {
    notToggle: CustomNotToggle,
    combinatorSelector: CustomCombinatorSelector,
}
export interface QueryBuilderProperties<RG extends RuleGroupTypeAny, F extends FullField, O extends FullOperator, C extends FullCombinator> {

}
/**
* See https://react-querybuilder.js.org/ for demos and documentation.
* @group Components
*/
export default function QueryBuilder(
    {
        combinators = rtl.combinators,
        operators = rtl.operators,
        translations = rtl.translations,
        controlClassnames = rtl.classnames,
        controlElements, 
        ...rest
    }: any // Asegúrate de que el tipo 'controlElements' sea correcto si usas TypeScript estricto
) {
    return (
        <ThemeProvider theme={theme}>
            <QueryBuilderMaterial>
                <QueryBuilderComponent
                    combinators={combinators}
                    operators={operators}
                    translations={translations}
                    controlClassnames={controlClassnames}
                    showNotToggle // <-- ¡Asegura que el toggle esté visible!
                    listsAsArrays
                    // Inyectamos nuestro componente personalizado
                    controlElements={customControlElements}
                    {...rest}
                />
            </QueryBuilderMaterial>
        </ThemeProvider>
    );
}
