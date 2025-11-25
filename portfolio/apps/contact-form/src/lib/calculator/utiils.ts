export type UnaryOperator = "-" | "+"
export type Operator = UnaryOperator | "*" | "/";

export interface NumberNode {
    type: "Number";
    value: number;
}

export interface BinaryOpNode {
    type: "BinaryOp";
    operator: Operator;
    left: CalcNode;
    right: CalcNode;
}

export interface UnaryOpNode {
    type: "UnaryOp";
    operator: UnaryOperator;
    expr: CalcNode;
}

export type CalcNode = NumberNode | BinaryOpNode | UnaryOpNode;

export function numberNode(value:number): CalcNode {
    return { type: "Number", value };
}

export function binaryNode(operator:Operator, left:CalcNode, right:CalcNode): CalcNode {
    return { type: "BinaryOp", operator, left, right };
}

export function unaryNode(operator:UnaryOperator, expr:CalcNode): CalcNode {
    return { type: "UnaryOp", operator, expr };
}