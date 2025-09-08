export interface InterpreterExpression<OutType> {
  interpret(): OutType;
}

export interface InterpreterContextualExpression<OutType, ContextType> {
  interpret(context: ContextType): OutType;
}

export default interface Interpreter<OutType, InType> {
  interpret(expression: InType): OutType;
}

export abstract class AbstractInterpreter<OutType, InType> implements Interpreter<OutType, InType> {
  public abstract interpret(expression: InType): OutType;
}

export abstract class AbstractIntermediateInterpreter<OutType, InType> extends AbstractInterpreter<OutType, InType> {
  interpret = (expression: InType) => this.interpretExpression(expression).interpret();
  protected abstract interpretExpression(expression: InType): InterpreterExpression<OutType>;
}

export abstract class AbstractIntermediateContextualInterpreter<OutType, InType, ContextType> extends AbstractInterpreter<OutType, InType> {
  private context: ContextType;

  constructor(context: ContextType) {
    super();
    this.context = context;
  }

  interpret = (expression: InType) => this.interpretExpression(expression).interpret(this.context);
  protected abstract interpretExpression(expression: InType): InterpreterContextualExpression<OutType, ContextType>;
}