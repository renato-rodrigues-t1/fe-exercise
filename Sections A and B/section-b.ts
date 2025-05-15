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
console.log(parseNumber("1+ 2"));