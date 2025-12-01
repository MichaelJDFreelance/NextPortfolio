import {Token} from "@/lib/calculator/ast-parser";

export function tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < input.length) {
        const c = input[i];

        // Skip spaces
        if (c === " ") {
            i++;
            continue;
        }

        // Number (multi-digit, optional decimal)
        if (/\d/.test(c)) {
            let numStr = c;
            i++;

            // Read more digits or a decimal point
            while (i < input.length && /[\d.]/.test(input[i])) {
                numStr += input[i];
                i++;
            }

            tokens.push({
                type: "Number",
                value: Number(numStr),
            });

            continue;
        }

        // Operators + parentheses
        switch (c) {
            case "+":
                tokens.push({ type: "Plus" });
                break;
            case "-":
                tokens.push({ type: "Minus" });
                break;
            case "*":
                tokens.push({ type: "Star" });
                break;
            case "/":
                tokens.push({ type: "Slash" });
                break;
            case "(":
                tokens.push({ type: "LParen" });
                break;
            case ")":
                tokens.push({ type: "RParen" });
                break;
            default:
                throw new Error("Unknown character: " + c);
        }

        i++;
    }

    return tokens;
}