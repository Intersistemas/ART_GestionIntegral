import QueryBuilder, { formatQuery, type Field, type RuleGroupType } from 'react-querybuilder';
import { useState } from 'react';
import { PropositionQueryBuilderJSONInterpreter } from '@/utils/interpreters/PropositionQueryBuilderJSONInterpreter';
import { QueriesAPI, type Query } from '@/data/queryAPI';

const fields: Field[] = [
  { name: "A.AC", label: "AC" },
  { name: "B.BC", label: "BC", }
];

const interpreter: PropositionQueryBuilderJSONInterpreter = new PropositionQueryBuilderJSONInterpreter();

export default function QueryBuilderExample() {
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: "and",
    not: true,
    rules: [
      { field: "A.AC", operator: "=", value: "igual" },
      { field: "A.AC", operator: "!=", value: "distinto" },
      { field: "A.AC", operator: "<", value: "menor" },
      { field: "A.AC", operator: ">", value: "mayor" },
      { field: "A.AC", operator: "<=", value: "menor o igual" },
      { field: "A.AC", operator: ">=", value: "mayor o igual" },
      {
        combinator: "or",
        rules: [
          { field: "A.AC", operator: "contains", value: "contiene" },
          { field: "A.AC", operator: "beginsWith", value: "inicia con" },
          { field: "A.AC", operator: "endsWith", value: "termina con" },
          { field: "A.AC", operator: "doesNotContain", value: "no contiene" },
          { field: "A.AC", operator: "doesNotBeginWith", value: "no inicia con" },
          { field: "A.AC", operator: "doesNotEndWith", value: "no termina con" }
        ]
      },
      { field: "A.AC", operator: "null", value: "" },
      { field: "A.AC", operator: "notNull", value: "" },
      { field: "A.AC", operator: "in", value: "presente,entre".split(",") },
      { field: "A.AC", operator: "notIn", value: "ausente,entre".split(",") },
      { field: "A.AC", operator: "between", value: "desde,hasta".split(",") },
      { field: "A.AC", operator: "notBetween", value: "desden't,hastan't".split(",") }
    ]
  });
  const [json, setJSON] = useState<string>("");
  const [proposition, setProposition] = useState<string>("");
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "800px", gap: "5px" }}>
      {/* <div><QueryBuilder fields={fields} query={query} onQueryChange={setQuery} showNotToggle listsAsArrays controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}/></div> */}
      {/* <div><QueryBuilder fields={fields} query={query} onQueryChange={setQuery} showNotToggle listsAsArrays controlClassnames={{ queryBuilder: 'queryBuilder-branches' }} /></div> */}
      {/* <div><QueryBuilder fields={fields} query={query} onQueryChange={setQuery} /></div> */}
      <div>
        <QueryBuilder
          fields={fields}
          query={query}
          onQueryChange={setQuery}
          showNotToggle
          listsAsArrays
          controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
        />
      </div>
      <div style={{ overflow: "scroll" }}><span>{json}</span></div>
      <div style={{ overflow: "scroll" }}><span>{proposition}</span></div>
      <div><button onClick={() => {
        const json = formatQuery(query, "json_without_ids");
        const proposition = interpreter.interpret(JSON.parse(json)) ?? "";
        setJSON(json);
        setProposition(proposition);
        const queriesApi = new QueriesAPI();
        (async () => {
          const query: Query = {
            select: [
              { value: "a.AA" },
              { value: "a.AB" },
              { value: "a.AC" },
              { value: "-(A.aA,A.Ab)", name: "AAAB" },

              { value: "b.BA" },
              { value: "b.BB" },
              { value: "b.BC" },
              { value: "+(B.Ba,B.bB)", name: "BABB" },

              { value: "add(A.aa,B.BA)", name: "AABA" },
              { value: "aDd(A.aB,B.Bb)", name: "ABBB" },
              { value: "aDD(A.AA,B.bb)", name: "AABB" },
              { value: "Add(A.ab,B.ba)", name: "ABBA" }
            ],
            from: [
              {
                name: "A",
                values: {
                  AA: ["1", "2", "3"],
                  AB: ["0.1", "+0.2", "-0.3"],
                  AC: ["'a'", null, "null"]
                }
              },
              {
                name: "B",
                values: {
                  BA: ["4", "5", "6"],
                  BB: [".4", "+.5", "-.6"],
                  BC: ["'b'", null, "null"]
                }
              }
            ],
            where: proposition,
          };
          console.log({ query });
          await queriesApi.analyze(query)
            .then((ok) => console.log("analyze", { ok }))
            .catch((error) => console.log("analyze", { error }));
          await queriesApi.execute(query)
            .then((ok) => console.log("execute", { ok }))
            .catch((error) => console.log("execute", { error }));
        })();
      }}>Export</button></div>
    </div>
  );
};