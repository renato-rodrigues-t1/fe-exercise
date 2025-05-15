type Token = {
    type: "NUMBER" |
    "OPERATOR" |
    "OPEN_PARENTHESIS" |
    "CLOSE_PARENTHESIS";
    value: string;
};
type Success = {
    success: true;
    value: Token[];
    rest: string
}
type Failure = {
    success: false;
    reason: string;
}
type Result = Success | Failure;

type Parser = (input: string) => Result;



const success = (value: Token[], rest: string): Result =>
    ({ success: true, value: value, rest });
const failure = (reason: string): Result =>
    ({ success: false, reason });


const parseNumber: Parser = (input: string) => {
    const match = /^\d+/.exec(input);
    if (match) {
        return success([
            { type: "NUMBER", value: match[0] }
        ], input.slice(match[0].length));
    }
    return failure("Not a number");
}

console.log(parseNumber("123"));
console.log(parseNumber("1 + 2"));
console.log(parseNumber("+ 2"));



//15
const parseOperator: Parser = (input: string) => {
    const match = /^[+-]/.exec(input.trimStart()); // Ensure it starts with + or -
    if (match) {
        return success([{ type: "OPERATOR", value: match[0] }], input.slice(match[0].length));
    }
    return failure("Expected '+ or -'");
};

console.log("\nEx. 15\n");
console.log(parseOperator("+"));
console.log(parseOperator("1 +"));
console.log(parseOperator("+ 2"));


//16

const parseOpenParenthesis: Parser = (input: string) => {
    const match = /^\(/.exec(input.trimStart()); // Ensure it starts with (
    if (match) {
        return success([{ type: "OPEN_PARENTHESIS", value: match[0] }], input.slice(match[0].length));
    }
    return failure("Expected '('");
};

console.log("\n---------- Ex. 16:\n");
console.log(parseOpenParenthesis("("));
console.log(parseOpenParenthesis("+ ("));
console.log(parseOpenParenthesis(")"));

//17

const parseCloseParenthesis: Parser = (input: string) => {
    const match = /^\)/.exec(input.trimStart()); // Ensure it starts with )
    if (match) {
        return success([{ type: "CLOSE_PARENTHESIS", value: match[0] }], input.slice(match[0].length));
    }
    return failure("Expected ')'");
};

console.log("\n---------- Ex. 17:\n");
console.log(parseCloseParenthesis(")"));
console.log(parseCloseParenthesis("+ )"));
console.log(parseCloseParenthesis("("));

//18
const parseCharacter = (char: string, tokenType: Token["type"]): Parser => {
    return (input: string) => {
        const match = new RegExp(`^\\${char}`).exec(input.trimStart());
        if (match) {
            return success([{ type: tokenType, value: match[0] }], input.slice(match[0].length));
        }
        return failure(`Expected '${char}'`);
    };
};

//19

const parseOpenParenthesis2 = parseCharacter("(", "OPEN_PARENTHESIS");
const parseCloseParenthesis2 = parseCharacter(")", "CLOSE_PARENTHESIS");

console.log("\n---------- Ex. 19:\n");
console.log(parseOpenParenthesis2("("));
console.log(parseOpenParenthesis2("+ ("));
console.log(parseOpenParenthesis2(")"));
console.log(parseCloseParenthesis2(")"));
console.log(parseCloseParenthesis2("+ )"));
console.log(parseCloseParenthesis2("("));

//20

const choice = (p1: Parser, p2: Parser) => {
    return (input: string) => {
        const result1 = p1(input);
        return result1.success ? result1 : p2(input);
    };
};

console.log("\n---------- Ex. 20:\n");
console.log(choice(parseNumber, parseOperator)("1+2"));
console.log(choice(parseNumber, parseOperator)("+2"));
console.log(choice(parseNumber, parseOperator)("(+"));

//21

const parseOperator2 = choice(
    parseCharacter("+", "OPERATOR"),
    parseCharacter("-", "OPERATOR")
);

console.log("\n---------- Ex. 21:\n");
console.log(parseOperator2("+"));
console.log(parseOperator2("1 +"));
console.log(parseOperator2("+ 2"));

//22

const choiceN = (parsers: Parser[]): Parser => {
    return (input: string): Result => {
        for (const parser of parsers) {
            const result = parser(input);
            if (result.success) return result;
        }
        return failure("Choice parser: All choices failed on input");
    };
};

// For testing
const parseNumberOrOperatorOrParenthesis = choiceN([
    parseNumber,
    parseOpenParenthesis,
    parseOperator
]
);

console.log("\n---------- Ex. 22:\n");
console.log(parseNumberOrOperatorOrParenthesis("1 + 2"));
console.log(parseNumberOrOperatorOrParenthesis(")1 + 2("));

//23 ------
const zip = (parser1: Parser, parser2: Parser): Parser => {
    return (input: string) => {
        const result1 = parser1(input);
        if (!result1.success) {
            return result1;
        }

        const result2 = parser2(result1.rest);
        if (!result2.success) {
            return result2;
        }

        return success(
            [...result1.value, ...result2.value],
            result2.rest
        );
    };
};

console.log("\n---------- Ex. 23:\n");
console.log(zip(parseNumber, parseOperator)("1+"));
console.log(zip(parseNumber, parseOperator)("+1"));
console.log(zip(parseNumber, parseOperator)("1+2+3"));

//24

const isEmpty: Parser = (input) => {
    if (input === "") return success([], "");
    return failure("Not an empty string");
};


function doUntil(parser: Parser): Parser {
    const recursiveParse = (input: string, tokens: Token[] = []): Result => {
        if (input.trim() === "") return success(tokens, "");

        const result = parser(input);

        if (result.success) {
            return recursiveParse(result.rest, [...tokens, ...result.value]);
        } else {
            return failure("Choice parser: All choices failed on input");
        }
    };

    return (input: string) => recursiveParse(input);
}

console.log("\n---------- Ex. 24:\n");
console.log(
    doUntil(choiceN([parseNumber, parseOperator]))("1+2")
);
console.log(
    doUntil(choiceN([parseNumber, parseOperator]))("1+(")
);

//25
const tokenizer = doUntil(
    choiceN([
        parseNumber,
        parseOperator,
        parseOpenParenthesis,
        parseCloseParenthesis
    ])
);

// Test Cases:
console.log("\n---------- Ex. 25:\n");
console.log(tokenizer("1 + 2"));
/* Expected:
{
  success: true,
  value: [
    { type: "NUMBER", value: "1" },
    { type: "OPERATOR", value: "+" },
    { type: "NUMBER", value: "2" }
  ],
  rest: ""
}
*/

console.log(tokenizer("(1 + 2) * 3"));
/* Expected:
{
  success: true,
  value: [
    { type: "OPEN_PARENTHESES", value: "(" },
    { type: "NUMBER", value: "1" },
    { type: "OPERATOR", value: "+" },
    { type: "NUMBER", value: "2" },
    { type: "CLOSE_PARENTHESES", value: ")" },
    { type: "OPERATOR", value: "*" },
    { type: "NUMBER", value: "3" }
  ],
  rest: ""
}
*/

console.log(tokenizer("1 + (2 - 3)"));
/* Expected:
{
  success: true,
  value: [
    { type: "NUMBER", value: "1" },
    { type: "OPERATOR", value: "+" },
    { type: "OPEN_PARENTHESES", value: "(" },
    { type: "NUMBER", value: "2" },
    { type: "OPERATOR", value: "-" },
    { type: "NUMBER", value: "3" },
    { type: "CLOSE_PARENTHESES", value: ")" }
  ],
  rest: ""
}
*/

console.log(tokenizer("1 + (2 - 3"));
/* Expected:
{
  success: false,
  reason: "Unexpected character: ("
}
*/
