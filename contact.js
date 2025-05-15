const supabaseUrl = 'https://zkubazzdofkfnhyvcetg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprdWJhenpkb2ZrZm5oeXZjZXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDYwNDIsImV4cCI6MjA2Mjg4MjA0Mn0.is9-8herp1NAoq2k6cWYl_wyUF1GXmRva-_fkN2jv1A';

// Initialize the Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const dbIndicator = document.getElementById('db-indicator');
    const closeBtn = dbIndicator.querySelector('.close-x');
    let hideTimeout;

    function showDbIndicator(message, type) {
        dbIndicator.className = `db-indicator ${type} show`;
        dbIndicator.innerHTML = `<span>${message}</span><button class="close-x" aria-label="Close notification">&times;</button>`;
        // Add close handler
        dbIndicator.querySelector('.close-x').onclick = () => hideDbIndicator();
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => hideDbIndicator(), 5000);
    }
    function hideDbIndicator() {
        dbIndicator.className = 'db-indicator';
        dbIndicator.innerHTML = '<button class="close-x" aria-label="Close notification">&times;</button>';
    }
    if (closeBtn) closeBtn.onclick = () => hideDbIndicator();

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                created_at: new Date().toISOString()
            };
            try {
                const { data, error } = await supabase
                    .from('contacts')
                    .insert([formData]);
                if (error) throw error;
                showDbIndicator('✅ Message stored in database!', 'success');
                e.target.reset();
            } catch (error) {
                console.error('Error:', error);
                showDbIndicator('❌ Failed to store message in database.', 'error');
            }
        });
    }
});

function showMessage(text, type) {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = text;

    // Insert after form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}
