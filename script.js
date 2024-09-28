// script.js
document.getElementById('serviceForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch('/api/save-service', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Service details saved successfully!');
            // Optionally, redirect to service category page or clear the form
            this.reset();
        } else {
            alert('Error saving service details.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error saving service details.');
    });
});
