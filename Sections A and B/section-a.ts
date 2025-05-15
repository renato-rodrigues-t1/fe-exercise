//sum
function sumInts(a: number, b: number): number {
    return (a > b) ? 0 : a + sumInts(a + 1, b)
}
console.log(sumInts(1, 5));

// 1
function sumSquares(a: number, b: number): number {
    return Array.from({ length: b - a + 1 }, (_, i) => (a + i) ** 2)
        .reduce((acc, val) => acc + val, 0);
}
console.log(sumSquares(1, 5)); // Output: 55

//2
function sumCubes(a: number, b: number): number {
    return Array.from({ length: b - a + 1 }, (_, i) => (a + i) ** 3)
        .reduce((acc, val) => acc + val, 0);
}
console.log(sumCubes(1, 5)); // Output: 225

//3
const factorial = (n: number): number => n <= 1 ? 1 : n * factorial(n - 1);

function sumFactorial(a: number, b: number): number {
    return Array.from({ length: b - a + 1 }, (_, i) => factorial(a + i))
        .reduce((acc, val) => acc + val, 0);
}

console.log(sumFactorial(1, 5));// Output: 153

//4
const sumMap = (mapFn: (value: number) => number) => (a: number, b: number): number => {
    return Array.from({ length: b - a + 1 }, (_, i) => mapFn(a + i))
        .reduce((acc, val) => acc + val, 0);
};
console.log(sumMap(x => x)(1, 5)); // Output: 15
console.log(sumMap(x => x * x)(1, 5)); // Output: 55

//5
// Refactored Functions using sumMap
const sumInts2 = sumMap(x => x);
const sumSquares2 = sumMap(x => x * x);
const sumCubes2 = sumMap(x => x * x * x);
const sumFactorial2 = sumMap(factorial);

console.log(sumInts2(1, 5)); // Output: 15
console.log(sumSquares2(1, 5)); // Output: 55
console.log(sumCubes2(1, 5)); // Output: 225
console.log(sumFactorial2(1, 5)); // Output: 153


//6
const prodInts = (a: number, b: number): number => {
    return Array.from({ length: b - a + 1 }, (_, i) => a + i)
        .reduce((acc, val) => acc * val, 1);
};
console.log(prodInts(1, 5)); // Output: 120

//7
function prodSquares(a: number, b: number): number {
    return Array.from({ length: b - a + 1 }, (_, i) => (a + i) ** 2)
        .reduce((acc, val) => acc * val, 1);
}
console.log(prodSquares(1, 5)); // Output: 14400

//8
function prodCubes(a: number, b: number): number {
    return Array.from({ length: b - a + 1 }, (_, i) => (a + i) ** 3)
        .reduce((acc, val) => acc * val, 1);
}
console.log(prodCubes(1, 5)); // Output: 1728000

// 9
function prodFactorial(a: number, b: number): number {
    return Array.from({ length: b - a + 1 }, (_, i) => factorial(a + i))
        .reduce((acc, val) => acc * val, 1);
}
console.log(prodFactorial(1, 5)); // Output: 34560

// 10
const prodMap = (mapFn: (value: number) => number) => (a: number, b: number): number => {
    return Array.from({ length: b - a + 1 }, (_, i) => mapFn(a + i))
        .reduce((acc, val) => acc * val, 1);
};

// 11. Refactored Functions using prodMap
const prodInts2 = prodMap(x => x);
const prodSquares2 = prodMap(x => x * x);
const prodCubes2 = prodMap(x => x * x * x);
const prodFactorial2 = prodMap(factorial);

console.log(prodInts2(1, 5));        // Output: 120
console.log(prodSquares2(1, 5));     // Output: 14400
console.log(prodCubes2(1, 5));       // Output: 1728000
console.log(prodFactorial2(1, 5));   // Output: 34560

//12
const mapReduce = (
    mapFn: (value: number) => number,
    reduceFn: (first: number, second: number) => number,
    zero: number
) => (a: number, b: number) => {
    return Array.from({ length: b - a + 1 }, (_, i) => mapFn(a + i))
        .reduce(reduceFn, zero);
};

//13
const mapReduce2 =
    (reduceFn: (first: number, second: number) => number, zero: number) =>
        (mapFn: (value: number) => number) =>
            (a: number, b: number) => {
                return Array.from({ length: b - a + 1 }, (_, i) => mapFn(a + i))
                    .reduce(reduceFn, zero);
            };

//14
const sumMap2 = mapReduce2((a, b) => a + b, 0);
const prodMap2 = mapReduce2((a, b) => a * b, 1);
