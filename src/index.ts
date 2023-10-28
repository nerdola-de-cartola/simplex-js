type Matrix = Vector[]
type Vector = number[]

function getSubMatrix(m: Matrix, subColumns: number[]): Matrix {
    const hasNegativeIndex = subColumns.some((columnIndex) => columnIndex < 0);
    const hasOverIndex = subColumns.some((columnIndex) => columnIndex > m[0].length - 1);

    if (hasNegativeIndex || hasOverIndex) {
        throw new Error("Could not get sub matrix")
    }

    const subMatrix: Matrix = m.map(() => []);
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

    if (m[0][0] === 0) {
        for (let i = 0; i < n; i++) {
            if (m[i][0] !== 0) {
                const coefficient = 1 / m[i][0];
                rowAddition(m[0], coefficient, m[i]);
                rowAddition(identity[0], coefficient, identity[i]);
                break;
            }
        }
    }

    for (let j = 0; j < n; j++) {
        for (let i = j + 1; i < n; i++) {
            if(m[i][j] !== 0) {
                const coefficient = -m[i][j] / m[j][j];
                rowAddition(m[i], coefficient, m[j]);
                rowAddition(identity[i], coefficient, identity[j]);
            }
        }
    }

    for (let j = 1; j < n; j++) {
        for (let i = 0; i < j; i++) {
            if(m[i][j] !== 0) {
                const coefficient = -m[i][j] / m[j][j];
                rowAddition(m[i], coefficient, m[j]);
                rowAddition(identity[i], coefficient, identity[j]);
            }
        }
    }

    for (let i = 1; i < n; i++) {
        if (m[i][i] !== 1) {
            const coefficient = 1 / m[i][i];
            rowMultiplication(m[i], coefficient);
            rowMultiplication(identity[i], coefficient);
        }
    }

    return identity;
}

function multiplyMatrix(a: Matrix, b: Matrix) {
    if(a[0].length !== b.length) {
        throw new Error("Could not perform matrix multiplication");
    }

    const numberOfRows = a.length;
    const numberOfColumns = b[0].length;

    const x: Matrix = a.map(() => []);

    for (let row = 0; row < numberOfRows; row++) {
        for (let column = 0; column < numberOfColumns; column++) {
            x[row][column] = 0;

            for (let index = 0; index < b.length; index++) {
                x[row][column] += a[row][index] * b[index][column];
            }
        }
    }

    return x;
}

function transposeMatrix(m: Matrix) {
    const transpose: Matrix = m[0].map(() => []);

    for (let i = 0; i < m.length; i++) {
        for (let j = 0; j < m[i].length; j++) {
            transpose[j][i] = m[i][j];
        }
    }

    return transpose;
}

function simplexSecondPhase(A: Matrix, b: Matrix, C: Matrix, initialBase: number[]) {
    const Ib = initialBase;
    const In = [];

    for (let i = 0; i < A[0].length; i++) {
        if (initialBase.every((index) => index !== i)) {
            In.push(i)
        }
    }

    const B = getSubMatrix(A, Ib);
    const N = getSubMatrix(A, In);

    const Ct = transposeMatrix(C);

    const Ctb = getSubMatrix(Ct, Ib);
    const Ctn = getSubMatrix(Ct, In);   

    printMatrix(Ctb);
    printMatrix(Ctn);

    const inverseB = inverseMatrix(B);

    const inverseBTimesN = multiplyMatrix(inverseB, N);
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
        [6],
        [2],
        [1]
    ]

    const A = [
        [1, 2, 1, 0, 0],
        [4, 0, 0, 1, 0],
        [-1, -5, 0, 0, 1]
    ]

    const C = [
        [1],
        [2],
        [0],
        [0],
        [0]
    ]

    simplexSecondPhase(A, b, C, [3, 1, 0])
}

main()