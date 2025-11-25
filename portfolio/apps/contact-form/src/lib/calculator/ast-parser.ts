import {binaryNode, CalcNode, NumberNode, numberNode, unaryNode} from "@/lib/calculator/utiils";

export type Token =
    | { type: "Number"; value: number }
    | { type: "Plus" }
    | { type: "Minus" }
    | { type: "Star" }
    | { type: "Slash" }
    | { type: "LParen" }
    | { type: "RParen" };

export function Parser(tokens:Token[]) {
    let i = 0;

    function peek() {
        return tokens[i];
    }

    function consume(type: string) {
        if (peek()?.type === type) {
            return tokens[i++];
        }
        throw new Error("Expected " + type + ", got " + peek()?.type);
    }

    function parseExpression() {
        let node = parseTerm();

        while (peek()?.type === "Plus" || peek()?.type === "Minus") {
            const op = peek().type === "Plus" ? "+" : "-";
            consume(peek().type);
            const right = parseTerm();
            node = binaryNode(op, node, right);
        }

        return node;
    }

    function parseTerm() {
        let node = parseUnary();

        while (peek()?.type === "Star" || peek()?.type === "Slash") {
            const op = peek().type === "Star" ? "*" : "/";
            consume(peek().type);
            const right = parseUnary();
            node = binaryNode(op, node, right);
        }

        return node;
    }

    function parseUnary(): CalcNode {
        if (peek()?.type === "Plus") {
            consume("Plus");
            return parseUnary();
        }

        if (peek()?.type === "Minus") {
            consume("Minus");
            return unaryNode("-", parseUnary());
        }

        return parsePrimary();
    }

    function parsePrimary() {
        if (peek()?.type === "Number") {
            const node = consume("Number") as NumberNode;
            const value = node.value;
            return numberNode(value);
        }

        if (peek()?.type === "LParen") {
            consume("LParen");
            const expr = parseExpression();
            consume("RParen");
            return expr;
        }

        throw new Error("Unexpected token: " + peek()?.type);
    }

    // Entry point
    return parseExpression();
}
