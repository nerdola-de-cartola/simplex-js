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

    //TODO: Verifica rse é possível inverter

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
            if (m[i][j] !== 0) {
                const coefficient = -m[i][j] / m[j][j];
                rowAddition(m[i], coefficient, m[j]);
                rowAddition(identity[i], coefficient, identity[j]);
            }
        }
    }

    for (let j = 1; j < n; j++) {
        for (let i = 0; i < j; i++) {
            if (m[i][j] !== 0) {
                const coefficient = -m[i][j] / m[j][j];
                rowAddition(m[i], coefficient, m[j]);
                rowAddition(identity[i], coefficient, identity[j]);
            }
        }
    }

    for (let i = 0; i < n; i++) {
        if (m[i][i] !== 1) {
            const coefficient = 1 / m[i][i];
            rowMultiplication(m[i], coefficient);
            rowMultiplication(identity[i], coefficient);
        }
    }

    return identity;
}

function multiplyMatrix(a: Matrix, b: Matrix) {
    if (a[0].length !== b.length) {
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

function subtractMatrix(a: Matrix, b: Matrix) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error("Could not perform matrix subtraction")
    }

    const result: Matrix = a.map(() => []);
    const totalRows = a.length;
    const totalColumns = a[0].length;

    for (let i = 0; i < totalRows; i++) {
        for (let j = 0; j < totalColumns; j++) {
            result[i][j] = a[i][j] - b[i][j];
        }
    }

    return result;
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

function getBestCost(v: Vector) {
    let bestCostIndex = null;

    for (let index = 0; index < v.length; index++) {
        if (bestCostIndex === null && v[index] > 0) {
            bestCostIndex = index
        } else if (bestCostIndex !== null && v[index] > v[bestCostIndex]) {
            bestCostIndex = index;
        }
    }

    return bestCostIndex;
}

function getNextVariable(v: Vector) {
    let bestIndex = null;

    for (let index = 0; index < v.length; index++) {
        if(bestIndex === null && v[index] >= 0){
            bestIndex = index;
        } else if(bestIndex !== null && v[index] > 0 && v[index] < v[bestIndex]) {
            bestIndex = index;
        }
    }

    return bestIndex;
}

function composeMatrix(m: Matrix, Ib: number[], In: number[]) {
    const compose = [];

    const size = Math.max(Math.max(...Ib), Math.max(...In)) + 1;

    for (let index = 0; index < size; index++) {
        if(In.some((element) => element === index)) {
            compose[index] = 0;
        } else {
            const rowOfm  = Ib.findIndex((element) => element === index);
            compose[index] = m[rowOfm][0];
        }
    }

    return compose;
}

function simplex(A: Matrix, b: Matrix, Ct: Matrix, Ib: number[], In: number[]) {
    console.log(`Ib = ${Ib}`);
    console.log(`In = ${In}`);

    const B = getSubMatrix(A, Ib);
    const N = getSubMatrix(A, In);

    const Ctb = getSubMatrix(Ct, Ib);
    const Ctn = getSubMatrix(Ct, In);

    console.log("");
    console.log("Ctb:");
    printMatrix(Ctb);

    console.log("");
    console.log("Ctn:");
    printMatrix(Ctn);

    const inverseB = inverseMatrix(B);

    console.log("");
    console.log("Inverse B:");
    printMatrix(inverseB);

    const inverseBTimesN = multiplyMatrix(inverseB, N);

    console.log("");
    console.log("Inverse B times N:");
    printMatrix(inverseBTimesN);

    console.log("");
    console.log("Ctb times Inverse B times N:");
    printMatrix(multiplyMatrix(Ctb, inverseBTimesN));

    const [reduceCostVector] = subtractMatrix(Ctn, multiplyMatrix(Ctb, inverseBTimesN));

    console.log("")
    console.log("Reduce cost vector:")
    console.log(reduceCostVector);
    
    const bestCostIndex = getBestCost(reduceCostVector);
    
    const inverseBTimesb = multiplyMatrix(inverseB, b);

    console.log("");
    console.log("Inverse B times b:");
    printMatrix(inverseBTimesb);

    if (bestCostIndex === null) {
        const X = composeMatrix(inverseBTimesb, Ib, In);
        const [[bestValue]] = multiplyMatrix(Ctb, inverseBTimesb);
        return {
            variables: X,
            value: bestValue
        }
    }
    
    const possibleValuesForX = [];
    
    for (let row = 0; row < inverseBTimesb.length; row++) {
        possibleValuesForX.push( inverseBTimesb[row][0] / inverseBTimesN[row][bestCostIndex] )
    }
    
    console.log("")
    console.log("Possible values for X:")
    printMatrix([possibleValuesForX]);
    
    const indexToSwap = getNextVariable(possibleValuesForX);

    if(indexToSwap === null) {
        return Infinity;
    }
    
    
    const newIb = Ib.map((variable, variableIndex) =>
        variableIndex === indexToSwap ? In[bestCostIndex] : variable
        )
        
    const newIn = In.map((variable, variableIndex) =>
        variableIndex === bestCostIndex ? Ib[indexToSwap] : variable
    );

    console.log(`Swap variable X${In[bestCostIndex]} for variable X${Ib[indexToSwap]}`);
    console.log(`-------------------------------------------`);

    return simplex(A, b, Ct, newIb, newIn);
}

function simplexSecondPhase(A: Matrix, b: Matrix, C: Matrix, initialBase: number[]) {
    const Ib = initialBase;
    const In = [];

    // Find initial In from initial Ib
    for (let i = 0; i < A[0].length; i++) {
        if (Ib.every((index) => index !== i)) {
            In.push(i)
        }
    }

    const Ct = transposeMatrix(C);

    return simplex(A, b, Ct, Ib, In);
}

function main() {
    const b = [
        [4],
        [4],
        [4],
        [3]
    ]

    const A = [
        //1  2  3  4  5  6  7  8  9  10  11  12  13  14
        [ 2, 1, 1, 1, 0, 0, 0 ],
        [ 1, 2, 1, 0, 1, 0, 0 ],
        [ 1, 1, 2, 0, 0, 1, 0 ],
        [ 1, 1, 1, 0, 0, 0, 1 ]
    ]

    const C = [
        [3],
        [5],
        [6],
        [0],
        [0],
        [0],
        [0]
    ]

    const result = simplexSecondPhase(A, b, C, [3, 4, 5, 6])

    if (result === Infinity) {
        console.log("O problema é ilimitado");
    }

    console.log(result);
}

main();