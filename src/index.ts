type Matrix = Vector[]
type Vector = number[]

function getSubMatrix(m: Matrix, subColumns: number[]): Matrix {
    const hasNegativeIndex = subColumns.some((columnIndex) => columnIndex < 0);
    const hasOverIndex = subColumns.some((columnIndex) => columnIndex > m[0].length - 1);

    if (hasNegativeIndex || hasOverIndex) {
        throw new Error("Could not get sub matrix")
    }

    const subMatrix: Matrix = []
    let subJ = 0;

    for (let i = 0; i < m.length; i++) {
        subMatrix.push([])

        for (let j = 0; j < m[i].length; j++) {
            if (subColumns.some((columnIndex) => columnIndex === j)) {
                subMatrix[i][subJ] = m[i][j];
                subJ++;
            }
        }
    }

    return subMatrix;
}

function identityMatrix(n: number): Matrix {
    if (n < 1) {
        throw new Error(`Could not find identity of size ${n}`)
    }

    const identity: Matrix = [];


    for (let i = 0; i < n; i++) {
        identity.push([])

        for (let j = 0; j < n; j++) {
            identity[i][j] = i === j ? 1 : 0;
        }
    }

    return identity;
}

function inverseMatrix(m: Matrix): Matrix {
    const numberOfRows = m.length;
    const numberOfColumns = m[0].length;

    if (numberOfColumns !== numberOfRows) {
        throw new Error("Could not find inverse of matrix")
    }

    const n = numberOfRows;

    const identity = identityMatrix(n)

    printMatrix(identity);

    return [[]];
}

function simplexSecondPhase(A: Matrix, b: Vector, C: Vector) {
    printMatrix(A);

    const Xb = [2, 3, 4];
    const Xn = [0, 1];

    const B = getSubMatrix(A, Xb);
    const N = getSubMatrix(A, Xn);

    printMatrix(B);
    printMatrix(N);

    const inverseB = inverseMatrix(B);

    printMatrix(inverseB);
}

function printVector(v: Vector) {
    console.log(v);
}


function printMatrix(m: Matrix) {
    m.forEach((line) => {
        process.stdout.write("| ")

        line.forEach((element, index) => {
            const amountOfDecimalPlaces = element < 0 ? 2 : 3;
            process.stdout.write(`${element.toFixed(amountOfDecimalPlaces)}`)

            if (index < line.length - 1) {
                process.stdout.write(`  `);
            }
        })
        process.stdout.write(" |\n")
    })

    console.log("");
}

function main() {
    const b = [
        6, 2, 1
    ]

    const A = [
        [1, 2, 1, 0, 0],
        [4, 0, 0, 1, 0],
        [1, -5, 0, 0, 1]
    ]

    const C = [
        1, 2, 0, 0
    ]

    simplexSecondPhase(A, b, C)
}

main()