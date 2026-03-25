function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`);
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Add click listeners to swatches if needed, or inline them
    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const color = swatch.dataset.color;
            if (color) copyToClipboard(color);
        });
    });
});
