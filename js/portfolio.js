function copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            console.log('URL copied to clipboard');
        })
        .catch((err) => {
            console.error('Error copying URL to clipboard:', err);
        });
}