document.addEventListener('DOMContentLoaded', () => {
    let rowCount = 1;

    const addRowButton = document.getElementById('addRowButton');
    const calculateButton = document.getElementById('calculateButton');
    const inputsContainer = document.getElementById('inputsContainer');
    const resultDiv = document.getElementById('result');

    const addRow = () => {
        rowCount++;
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('inputGroup');
        inputGroup.setAttribute('id', `row${rowCount}`);
        inputGroup.innerHTML = `
            <label for="length${rowCount}">Długość (mm):</label>
            <input type="number" id="length${rowCount}" class="length" required>
            <label for="quantity${rowCount}">Ilość:</label>
            <input type="number" id="quantity${rowCount}" class="quantity" required>
            <button type="button" class="deleteRowButton" data-row="row${rowCount}">Usuń</button>
        `;
        inputsContainer.appendChild(inputGroup);

        inputGroup.querySelector('.deleteRowButton').addEventListener('click', (e) => {
            const rowId = e.target.getAttribute('data-row');
            const row = document.getElementById(rowId);
            if (row) {
                row.remove();
            }
        });
    };

    addRowButton.addEventListener('click', addRow);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addRow();
        }
    });

const calculate = () => {
    resultDiv.textContent = '';

    const lengths = document.querySelectorAll('.length');
    const quantities = document.querySelectorAll('.quantity');
    const constantSelection = document.querySelector('input[name="constant"]:checked');
    const MAX_LENGTH = parseInt(constantSelection?.value);

    if (!constantSelection || isNaN(MAX_LENGTH)) {
        resultDiv.textContent = 'Wybierz poprawną długość pręta.';
        return;
    }

    let materialSegments = [];
    let totalRequiredLength = 0;

    for (let i = 0; i < lengths.length; i++) {
        const length = parseInt(lengths[i].value);
        const quantity = parseInt(quantities[i].value);

        if (isNaN(length) || isNaN(quantity) || length <= 0 || quantity <= 0) {
            resultDiv.textContent = 'Upewnij się, że wszystkie dane są poprawne.';
            return;
        }

        if (length > MAX_LENGTH) {
            resultDiv.textContent = `Długość pręta nie może przekroczyć ${MAX_LENGTH} mm.`;
            return;
        }

        for (let j = 0; j < quantity; j++) {
            materialSegments.push(length);
        }

        totalRequiredLength += length * quantity;
    }

    materialSegments.sort((a, b) => b - a);

    let totalBars = 0;
    let totalWaste = 0;
    let cuts = [];
    let barLengths = [];

    while (materialSegments.length > 0) {
        let remainingLength = MAX_LENGTH;
        totalBars++;

        let currentCuts = [];
        for (let i = 0; i < materialSegments.length; i++) {
            if (materialSegments[i] <= remainingLength) {
                remainingLength -= materialSegments[i];
                currentCuts.push(materialSegments[i]);
                materialSegments.splice(i, 1);
                i--; 
            }
        }

        barLengths.push(MAX_LENGTH - remainingLength);
        cuts.push(currentCuts);
        totalWaste += remainingLength; 
    }

    const barDiv = document.createElement('div');
    barDiv.classList.add('resultRow');
    barDiv.textContent = `Potrzebne pręty: ${totalBars}`;
    resultDiv.appendChild(barDiv);

    const wasteDiv = document.createElement('div');
    wasteDiv.classList.add('resultRow');
    wasteDiv.textContent = `Pozostały odpad: ${totalWaste} mm`;
    resultDiv.appendChild(wasteDiv);

    const lengthDiv = document.createElement('div');
    lengthDiv.classList.add('resultRow');
    lengthDiv.textContent = `Długość pręta: ${MAX_LENGTH / 1000} m`;
    resultDiv.appendChild(lengthDiv);

    const totalLengthDiv = document.createElement('div');
    totalLengthDiv.classList.add('resultRow');
    totalLengthDiv.textContent = `Całkowita długość potrzebna: ${totalRequiredLength} mm`;
    resultDiv.appendChild(totalLengthDiv);

    const cutsDiv = document.createElement('ul');
    cutsDiv.classList.add('resultRowCut');
    cutsDiv.textContent = `Cięcia prętów:`;

    cuts.forEach((cut, index) => {
        const cutRow = document.createElement('li');
        cutRow.classList.add('resultRowLi');
        const totalCutLength = cut.reduce((sum, length) => sum + length, 0);
        cutRow.textContent = `Pręt ${index + 1}: ${cut.join(' mm, ')} mm (Suma: ${totalCutLength} mm, Odpad: ${MAX_LENGTH - totalCutLength} mm)`;
        cutsDiv.appendChild(cutRow);
    });

    resultDiv.appendChild(cutsDiv);
};


    calculateButton.addEventListener('click', calculate);
});
