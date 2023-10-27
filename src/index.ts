type Matrix = Vector[]
type Vector = number[]

function getSubMatrix(m: Matrix, subColumns: number[]): Matrix {
    const hasNegativeIndex = subColumns.some((columnIndex) => columnIndex < 0);
    const hasOverIndex = subColumns.some((columnIndex) => columnIndex > m[0].length - 1);

    if (hasNegativeIndex || hasOverIndex) {
        throw new Error("Could not get sub matrix")
    }

    const subMatrix: Matrix = m.map((row) => []);
    let subJ = 0;

    subColumns.forEach((j) => {
        for (let i = 0; i < m.length; i++) {
            subMatrix[i][subJ] = m[i][j];
        }

        subJ++;
    })

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

function rowMultiplication(row: Vector, coefficient: number) {
    for (let j = 0; j < row.length; j++) {
        row[j] *= coefficient;
    }
}

function rowAddition(targetRow: Vector, coefficient: number, supportRow: Vector) {
    for (let j = 0; j < targetRow.length; j++) {
        targetRow[j] += coefficient * supportRow[j];
    }
}

function inverseMatrix(m: Matrix): Matrix {
    const numberOfRows = m.length;
    const numberOfColumns = m[0].length;

    if (numberOfColumns !== numberOfRows) {
        throw new Error("Could not find inverse of matrix")
    }

    const n = numberOfRows;

    const identity = identityMatrix(n)

    printMatrix(m);

    if (m[0][0] === 0) {
        for (let i = 0; i < n; i++) {
            if (m[i][0] !== 0) {
                rowAddition(m[0], 1 / m[i][0], m[i]);
                rowAddition(identity[0], 1 / m[i][0], m[i]);
                break;
            }
        }
    }

    for (let j = 0; j < n; j++) {
        for (let i = j + 1; i < n; i++) {
            if(m[i][j] !== 0) {
                const coefficient = -m[i][j] / m[i-1][j];
                rowAddition(m[i], coefficient, m[i-1]);
                rowAddition(identity[i], coefficient, m[i-1]);
            }
        }
    }

    /**
     * 
    for (let i = 0; i < n; i++) {
        if (m[i][i] !== 1) {
            const coefficient = 1 / m[i][i];
            rowMultiplication(m[i], coefficient);
            rowMultiplication(identity[i], coefficient);
        }
    }
    */

    printMatrix(m);
    printMatrix(identity);


    return identity;
}

function simplexSecondPhase(A: Matrix, b: Vector, C: Vector, initialBase: number[]) {
    const Ib = initialBase;
    const In = [];

    for (let i = 0; i < A[0].length; i++) {
        if (initialBase.every((index) => index !== i)) {
            In.push(i)
        }
    }

    const B = getSubMatrix(A, Ib);
    const N = getSubMatrix(A, In);

    const inverseB = inverseMatrix(B);
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
        [-1, -5, 0, 0, 1]
    ]

    const C = [
        1, 2, 0, 0
    ]

    simplexSecondPhase(A, b, C, [3, 1, 0])
}

main()