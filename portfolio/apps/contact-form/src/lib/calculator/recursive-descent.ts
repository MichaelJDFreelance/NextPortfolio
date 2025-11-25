import {CalcNode} from "@/lib/calculator/utiils";

export function evaluate(node: CalcNode): number {
    switch (node.type) {
        case "Number":
            return node.value;

        case "UnaryOp":
            return node.operator === "-"
                ? -evaluate(node.expr)
                : evaluate(node.expr);

        case "BinaryOp":
            const left = evaluate(node.left);
            const right = evaluate(node.right);

            switch (node.operator) {
                case "+": return left + right;
                case "-": return left - right;
                case "*": return left * right;
                case "/": return left / right;
            }
    }
}