type Matrix = Vector[]
type Vector = number[]

function simplexSecondPhase(A: Matrix, b: Vector, C: Vector) {
    printMatrix(A);
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

            if(index < line.length - 1) {
                process.stdout.write(`  `);
            }
        })
        process.stdout.write(" |\n")
    })
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