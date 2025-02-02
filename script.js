let display = document.getElementById('display');

// Handle Enter key for calculation
display.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        calculateResult();
    }
});

// Handle copy/paste and general input
display.addEventListener('input', function(event) {
    // Optional: validate input here if needed
});

// Function to append values to the display
function appendValue(value) {
    const start = display.selectionStart;
    const end = display.selectionEnd;
    const currentValue = display.value;
    
    display.value = currentValue.substring(0, start) + value + currentValue.substring(end);
    
    // Move cursor after inserted text
    const newPosition = start + value.length;
    display.setSelectionRange(newPosition, newPosition);
    display.focus();
}

// Function to clear the entire display
function clearDisplay() {
    display.value = '';
}

// Function to clear the last character (like backspace)
function clearEntry() {
    display.value = display.value.slice(0, -1);  // Remove the last character
}

// Function to calculate the result
function calculateResult() {
    try {
        let result = safeEval(display.value); // Use a custom safe evaluation function
        
        // Format the number to fix floating point precision issues
        result = Number.parseFloat(result.toFixed(10));
        
        // Validate result and display it  
        display.value = !isNaN(result) ? result : 'Error';
    } catch (error) {
        display.value = 'Error';
    }
}

// Basic safe evaluation function using RegEx and Function constructor
function safeEval(expression) {
    try {
        // Replace Math.PI with the actual value
        expression = expression.replace(/Math\.PI/g, 'PI');
        
        // Replace Math.sin, Math.cos, etc. with just sin, cos, etc.
        expression = expression
            .replace(/Math\.(sin|cos|tan|asin|acos|atan)/g, '$1');

        // Define allowed Math functions
        const mathFunctions = {
            'sin': Math.sin,
            'cos': Math.cos,
            'tan': Math.tan,
            'asin': Math.asin,
            'acos': Math.acos,
            'atan': Math.atan,
            'PI': Math.PI
        };

        // For debugging
        console.log('Processed expression:', expression);

        // Create a function with Math methods available in its scope
        const result = new Function(...Object.keys(mathFunctions),
            `"use strict"; return (${expression});`
        )(...Object.values(mathFunctions));

        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error('Invalid result');
        }

        return result;
    } catch (error) {
        console.log('Error in safeEval:', error, 'Expression:', expression);
        throw error;
    }
}
