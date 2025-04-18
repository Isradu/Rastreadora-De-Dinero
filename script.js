// lista para almacenar las transacciones
let transactions = [];

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notificationContainer = document.getElementById('notification-container');
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Añadir barra de progreso
    const progressBar = document.createElement('div');
    progressBar.className = 'notification-progress';
    notification.appendChild(progressBar);
    
    // Añadir al contenedor
    notificationContainer.appendChild(notification);
    
    // Eliminar notificación después de 4 segundos
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Función para agregar ingresos
function addIncome() {
    const description = document.getElementById('income-description').value.trim();
    const amount = parseFloat(document.getElementById('income-amount').value.trim());
    
    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Por favor ingresa una descripción y una cantidad válida.');
        return;
    }
    
    // Crear nueva transacción de ingreso
    const transaction = {
        id: Date.now(),
        description: description,
        category: 'Ingreso',
        amount: amount,
        type: 'Ingreso'
    };
    
    // Agregar a lista de transacciones
    transactions.push(transaction);
    
    // Actualizar la UI
    updateTransactionHistory();
    updateSummary();
    
    // Mostrar notificación de éxito
    showNotification(`Ingreso agregado: ${description} - $${amount.toFixed(2)}`, 'success');
    
    // limpiar inputs al agregar
    document.getElementById('income-description').value = '';
    document.getElementById('income-amount').value = '';
}

// Función para agregar gastos
function addExpense() {
    const description = document.getElementById('expense-description').value.trim();
    const category = document.getElementById('expense-category').value;
    const amount = parseFloat(document.getElementById('expense-amount').value.trim());
    
    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Por favor ingresa una descripción y una cantidad válida.');
        return;
    }
    
    // Crear nueva transacción de gasto
    const transaction = {
        id: Date.now(),
        description: description,
        category: category,
        amount: amount,
        type: 'Gasto'
    };
    
    // Agrega a lista de transacciones
    transactions.push(transaction);
    
    // Actualizar la UI
    updateTransactionHistory();
    updateSummary();
    
    // Mostrar notificación de éxito
    showNotification(`Gasto agregado: ${description} - $${amount.toFixed(2)}`, 'error');
    
    // Limpiar inputs al agregar
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-amount').value = '';
}

// Función para eliminar una transacción de la lista
function deleteTransaction(id) {
    // Obtener la transacción que se va a eliminar para mostrar sus datos en la notificación
    const transactionToDelete = transactions.find(transaction => transaction.id === id);
    
    // Filtrar la transacción seleccionada
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    // Actualizar la UI
    updateTransactionHistory();
    updateSummary();
    
    // Mostrar notificación de eliminación
    if (transactionToDelete) {
        const notificationType = transactionToDelete.type === 'Ingreso' ? 'error' : 'success';
        showNotification(`${transactionToDelete.type} eliminado: ${transactionToDelete.description} - $${transactionToDelete.amount.toFixed(2)}`, notificationType);
    }
}

// Función para actualizar el historial de transacciones
function updateTransactionHistory() {
    const transactionHistory = document.getElementById('transaction-history');
    transactionHistory.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Establecer color según el tipo de transacción
        const amountClass = transaction.type === 'Ingreso' ? 'income-amount' : 'expense-amount';
        
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td class="${amountClass}">${transaction.amount.toFixed(2)}</td>
            <td>${transaction.type}</td>
            <td><button onclick="deleteTransaction(${transaction.id})">Eliminar</button></td>
        `;
        
        transactionHistory.appendChild(row);
    });
}

// Función para actualizar el resumen
function updateSummary() {
    // Calcular totales
    const totalIncome = transactions
        .filter(transaction => transaction.type === 'Ingreso')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
        
    const totalExpenses = transactions
        .filter(transaction => transaction.type === 'Gasto')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
        
    const balance = totalIncome - totalExpenses;
    
    // Calcular porcentajes
    const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome * 100).toFixed(2) : 0;
    const incomePercentage = 100;
    const savingsPercentage = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(2) : 0;
    
    // Calcular porcentaje de gastos fijos (servicios son como gasto fijo)
    const fixedExpenses = transactions
        .filter(transaction => transaction.type === 'Gasto' && transaction.category === 'Servicios')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
        
    const fixedExpensesPercentage = totalIncome > 0 ? (fixedExpenses / totalIncome * 100).toFixed(2) : 0;
    
    // Calcular porcentaje de gastos variables (todos los gastos que no son servicios)
    const variableExpenses = totalExpenses - fixedExpenses;
    const variableExpensesPercentage = totalIncome > 0 ? (variableExpenses / totalIncome * 100).toFixed(2) : 0;
    
    // Actualizar valores en la UI
    document.getElementById('total-income').textContent = totalIncome.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
    document.getElementById('expense-percentage').textContent = expensePercentage;
    document.getElementById('income-percentage').textContent = incomePercentage;
    document.getElementById('savings-percentage').textContent = savingsPercentage;
    document.getElementById('fixed-expenses-percentage').textContent = fixedExpensesPercentage;
    document.getElementById('variable-expenses-percentage').textContent = variableExpensesPercentage;
    
    // Actualizar barras de progreso
    document.getElementById('savings-bar').style.width = `${savingsPercentage}%`;
    document.getElementById('fixed-expenses-bar').style.width = `${fixedExpensesPercentage}%`;
    document.getElementById('variable-expenses-bar').style.width = `${variableExpensesPercentage}%`;
    
    // Aplicar clases según el balance
    const balanceElement = document.getElementById('balance');
    if (balance > 0) {
        balanceElement.classList.add('income-amount');
        balanceElement.classList.remove('expense-amount');
    } else if (balance < 0) {
        balanceElement.classList.add('expense-amount');
        balanceElement.classList.remove('income-amount');
    } else {
        balanceElement.classList.remove('income-amount', 'expense-amount');
    }
}

// Función para limpiar todos los datos
function clearAll() {
    if (confirm('¿Estás seguro que quieres eliminar todas las transacciones?')) {
        transactions = [];
        updateTransactionHistory();
        updateSummary();
        // Mostrar notificación de limpieza
        showNotification('Todas las transacciones han sido eliminadas', 'error');
    }
}

// Funciones para exportar datos
function exportToCSV() {
    if (transactions.length === 0) {
        alert('No hay transacciones para exportar.');
        return;
    }
    
    // Crear titulos paraa CSV
    let csv = 'Descripción,Categoría,Cantidad,Tipo\n';
    
    // Agregar datos
    transactions.forEach(transaction => {
        csv += `"${transaction.description}","${transaction.category}",${transaction.amount},"${transaction.type}"\n`;
    });
    
    // Crear y descargar archivo
    downloadFile(csv, 'transacciones.csv', 'text/csv');
}

function exportToJSON() {
    if (transactions.length === 0) {
        alert('No hay transacciones para exportar.');
        return;
    }
    
    const json = JSON.stringify(transactions, null, 2);
    downloadFile(json, 'transacciones.json', 'application/json');
}

// Función para exportar a PDF utilizando jsPDF
function exportToPDF() {
    if (transactions.length === 0) {
        alert('No hay transacciones para exportar.');
        return;
    }
    
    // Crear una nueva instancia de jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Añadir título
    doc.setFontSize(18);
    doc.text('Historial de Transacciones', 14, 22);
    
    // Preparar datos para la tabla
    const tableColumn = ["Descripción", "Categoría", "Cantidad", "Tipo"];
    const tableRows = [];
    
    // Añadir filas de datos
    transactions.forEach(transaction => {
        const transactionData = [
            transaction.description,
            transaction.category,
            `$${transaction.amount.toFixed(2)}`,
            transaction.type
        ];
        tableRows.push(transactionData);
    });
    
    // Generar la tabla
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        styles: {
            fontSize: 10,
            cellPadding: 3
        },
        headStyles: {
            fillColor: [255, 105, 180],
            textColor: [255, 255, 255]
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });
    
    // Añadir resumen
    const totalIncome = transactions
        .filter(transaction => transaction.type === 'Ingreso')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
        
    const totalExpenses = transactions
        .filter(transaction => transaction.type === 'Gasto')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total de Ingresos: $${totalIncome.toFixed(2)}`, 14, finalY);
    doc.text(`Total de Gastos: $${totalExpenses.toFixed(2)}`, 14, finalY + 7);
    doc.text(`Balance: $${balance.toFixed(2)}`, 14, finalY + 14);
    
    // Guardar el PDF
    doc.save('transacciones.pdf');
}

// Función para exportar a Excel utilizando SheetJS
function exportToExcel() {
    if (transactions.length === 0) {
        alert('No hay transacciones para exportar.');
        return;
    }
    
    // Preparar datos para Excel
    const workbook = XLSX.utils.book_new();
    const worksheetData = transactions.map(transaction => ({
        'Descripción': transaction.description,
        'Categoría': transaction.category,
        'Cantidad': transaction.amount,
        'Tipo': transaction.type
    }));
    
    // Crear hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Añadir hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transacciones');
    
    // Guardar archivo
    XLSX.writeFile(workbook, 'transacciones.xlsx');
}

// Función auxiliar para descargar archivos
function downloadFile(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Cargar datos guardados cuando se inicia la página
window.addEventListener('load', function() {
    // Intentar cargar datos del localStorage
    const savedTransactions = localStorage.getItem('transactions');
    
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        updateTransactionHistory();
        updateSummary();
    }
});

// Guardar datos cuando se cierre la página
window.addEventListener('beforeunload', function() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
});

