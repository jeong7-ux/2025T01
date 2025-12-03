function openPaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('hidden');
    // Force reflow to enable transition
    void modal.offsetWidth;
    modal.classList.add('visible');
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('visible');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Match transition duration
}

function handlePayment(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    // Simulate processing
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = '처리중...';
    btn.disabled = true;
    
    setTimeout(() => {
        alert(`결제가 완료되었습니다!\n\n주문자: ${name}\n이메일: ${email}\n\n강의실 입장이 가능합니다.`);
        closePaymentModal();
        btn.innerText = originalText;
        btn.disabled = false;
        event.target.reset();
    }, 1500);
}

// Close modal when clicking outside
document.getElementById('payment-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePaymentModal();
    }
});
