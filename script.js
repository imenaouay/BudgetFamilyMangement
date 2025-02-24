// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    /**
     * Renders the Hero Geometric component inside the #hero container.
     *
     * @param {string} badge - The badge text.
     * @param {string} title1 - The first line of the title.
     * @param {string} title2 - The second line of the title.
     * @param {string} buttonText - The text for the button.
     * @param {string} buttonLink - The URL to navigate when the button is clicked.
     */
    function renderHeroGeometric(badge, title1, title2, buttonText, buttonLink) {
      const heroContainer = document.getElementById("hero");
  
      // Apply the hero class to style the container
      heroContainer.classList.add("hero");
  
      // Set the inner HTML with our hero content
      heroContainer.innerHTML = `
        <div class="hero-content">
          <div class="badge">${badge}</div>
          <h1 class="title">
            <span>${title1}</span>
            <span>${title2}</span>
          </h1>
          <a href="${buttonLink}" class="button">${buttonText}</a>
        </div>
      `;
    }
  
    // Call the render function with updated styles
    renderHeroGeometric("Family Budget Manager", "Smart Financial Planning", " For Your Family's Future ", "Start Planning", "budget.html");
  });
  
 
  function calculateTotals() {
    const income = parseFloat(document.getElementById('income').value) || 0;

    const fixedExpenses = Array.from(document.querySelectorAll('.fixed'))
        .reduce((sum, el) => sum + (parseFloat(el.value) || 0), 0);

    const variableExpenses = Array.from(document.querySelectorAll('.variable'))
        .reduce((sum, el) => sum + (parseFloat(el.value) || 0), 0);

    const savings = Array.from(document.querySelectorAll('.savings'))
        .reduce((sum, el) => sum + (parseFloat(el.value) || 0), 0);

    const totalExpenses = fixedExpenses + variableExpenses + savings;
    const difference = income - totalExpenses;

    document.getElementById('totalIncome').textContent = `$${income.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('difference').textContent = `$${difference.toFixed(2)}`;
    document.getElementById('difference').style.color = difference >= 0 ? '#28a745' : '#dc3545';
}


        function addFixedExpense() {
            const section = document.getElementById('fixed-section');
            const addButton = section.querySelector('.export-btn');
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            const labelInput = document.createElement('input');
            labelInput.type = 'text';
            labelInput.className = 'expense-label';
            labelInput.placeholder = 'Expense Name';
            labelInput.style.width = '180px';
            
            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.className = 'fixed';
            amountInput.min = '0';
            amountInput.oninput = calculateTotals;
            
            inputGroup.appendChild(labelInput);
            inputGroup.appendChild(amountInput);
            
            addButton.insertAdjacentElement('beforebegin', inputGroup);
        }

        function addVariableExpense() {
            const section = document.getElementById('variable-section');
            const addButton = section.querySelector('.export-btn');
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            const labelInput = document.createElement('input');
            labelInput.type = 'text';
            labelInput.className = 'expense-label';
            labelInput.placeholder = 'Expense Name';
            labelInput.style.width = '180px';
            
            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.className = 'variable';
            amountInput.min = '0';
            amountInput.oninput = calculateTotals;
            
            inputGroup.appendChild(labelInput);
            inputGroup.appendChild(amountInput);
            
            addButton.insertAdjacentElement('beforebegin', inputGroup);
        }

        function addSavings() {
            const section = document.getElementById('savings-section');
            const addButton = section.querySelector('.export-btn');
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            const labelInput = document.createElement('input');
            labelInput.type = 'text';
            labelInput.className = 'expense-label';
            labelInput.placeholder = 'Savings/Debt Name';
            labelInput.style.width = '180px';
            
            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.className = 'savings';
            amountInput.min = '0';
            amountInput.oninput = calculateTotals;
            
            inputGroup.appendChild(labelInput);
            inputGroup.appendChild(amountInput);
            
            addButton.insertAdjacentElement('beforebegin', inputGroup);
        }

        function exportToExcel() {
            const sections = document.querySelectorAll('.section');
            let csvContent = "data:text/csv;charset=utf-8,Budget Data\n";
            
            sections.forEach(section => {
                const title = section.querySelector('.section-title')?.textContent || '';
                csvContent += `"${title}"\n`;
                
                section.querySelectorAll('input').forEach(input => {
                    const label = input.previousElementSibling?.textContent || input.previousElementSibling?.placeholder;
                    const value = input.value || 0;
                    csvContent += `"${label}",$${value}\n`;
                });
                
                csvContent += '\n';
            });
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "budget.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function exportToPDF() {
            const doc = new window.jspdf.jsPDF();
            
            doc.setFontSize(24);
            doc.setTextColor(22, 163, 74);
            doc.text("Family Budget Report", 14, 30);
            
            doc.setFontSize(14);
            doc.text(`Total Income: $${document.getElementById('totalIncome').textContent.replace('$','')}`, 14, 45);
            doc.text(`Total Expenses: $${document.getElementById('totalExpenses').textContent.replace('$','')}`, 14, 55);
            doc.text(`Difference: $${document.getElementById('difference').textContent.replace('$','')}`, 14, 65);
            
            doc.setFontSize(12);
            doc.text("Detailed Breakdown:", 14, 80);
            
            let y = 85;
            document.querySelectorAll('.section').forEach(section => {
                const title = section.querySelector('.section-title')?.textContent || '';
                doc.setFontSize(11);
                doc.setTextColor(45, 183, 156);
                doc.text(title, 14, y);
                y += 10;
                
                section.querySelectorAll('input').forEach(input => {
                    const label = input.previousElementSibling?.textContent || input.previousElementSibling?.placeholder;
                    const value = input.value || 0;
                    doc.setFontSize(10);
                    doc.setTextColor(61, 62, 68);
                    doc.text(`-${label}: $${value}`, 20, y);
                    y += 8;
                });
                
                y += 5;
            });

            doc.save('budget.pdf');
        }
  