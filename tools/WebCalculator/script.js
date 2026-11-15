// Khởi tạo Class để chứa logic máy tính
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    // Xóa tất cả trạng thái
    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    // Xóa ký tự cuối cùng
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    // Thêm số vào currentOperand
    appendNumber(number) {
        // Ngăn chặn nhập nhiều dấu thập phân
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    // Chọn phép toán
    chooseOperation(operation) {
        if (this.currentOperand === '') return
        // Nếu đã có previousOperand, thực hiện phép tính trước rồi lưu phép toán mới
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = '' // Xóa currentOperand để sẵn sàng nhập số tiếp theo
    }

    // Bước 5: Hàm Tính toán Core (compute())
    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        
        // Xử lý trường hợp không có số hoặc chỉ có một số (ví dụ: bấm = ngay sau AC)
        if (isNaN(prev) || isNaN(current)) return

        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case '*':
                computation = prev * current
                break
            case '/':
                if (current === 0) { // Xử lý chia cho 0
                    computation = 'Error: Division by 0'
                    this.previousOperand = ''
                    this.operation = undefined
                    this.currentOperand = computation
                    return
                }
                computation = prev / current
                break
            default:
                return
        }
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    // Định dạng hiển thị số (ví dụ: thêm dấu phẩy ngăn cách hàng nghìn)
    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay

        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            // Định dạng số nguyên: 'en-US' dùng dấu phẩy cho hàng nghìn
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    // Cập nhật màn hình hiển thị
    updateDisplay() {
        this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand)
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandTextElement.innerText = ''
        }
    }
}


// === Lắng nghe sự kiện (DOM Manipulation) ===
const numberButtons = document.querySelectorAll('[data-number]')
const operatorButtons = document.querySelectorAll('[data-operator]')
const equalsButton = document.querySelector('[data-equals]')
const deleteButton = document.querySelector('[data-delete]')
const allClearButton = document.querySelector('[data-all-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')


// Khởi tạo đối tượng máy tính
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

// 1. Nút số và dấu thập phân
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText)
        calculator.updateDisplay()
    })
})

// 2. Nút phép toán
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

// 3. Nút Bằng (=)
equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})

// 4. Nút Xóa (AC)
allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})

// 5. Nút DEL (Xóa ký tự cuối cùng)
deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})