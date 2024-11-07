const data = await response.json();

        if (data.success) {
            // Update the note card in the DOM
            const noteCard = document.querySelector(`[data-id="${noteId}"]`).closest('.col-md-4');
            noteCard.querySelector('.card-title').textContent = title;
            noteCard.querySelector('.note-content').textContent = content;

            // Close modal and show success message
            bootstrap.Modal.getInstance(document.getElementById('editNoteModal')).hide();
            showToast('Note updated successfully', 'success');
        } else {
            throw new Error(data.error || 'Error updating note');
        }
    } catch (err) {
        showToast(err.message, 'error');
    } finally {
        hideLoadingSpinner();
    }
}

// Update notes count in the dashboard
function updateNotesCount() {
    const totalNotes = document.querySelectorAll('.note-card').length;
    const notesCountElement = document.querySelector('.card-title + h3');
    if (notesCountElement) {
        notesCountElement.textContent = totalNotes;
    }
}

// Show/hide loading spinner
function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('successToast');
    const toastBody = toast.querySelector('.toast-body');

    toast.classList.remove('bg-success', 'bg-danger');
    toast.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');

    toastBody.textContent = message;

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Handle text overflow in note cards
function setupTextOverflow() {
    const noteContents = document.querySelectorAll('.note-content');
    noteContents.forEach(content => {
        if (content.scrollHeight > content.clientHeight) {
            const parent = content.closest('.card-body');
            const expandButton = document.createElement('button');
            expandButton.className = 'btn btn-link btn-sm p-0 mt-2';
            expandButton.textContent = 'Read more';
            expandButton.onclick = () => {
                content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
                expandButton.textContent = content.style.maxHeight ? 'Read less' : 'Read more';
            };
            parent.appendChild(expandButton);
        }
    });
}

// Initialize setup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupTextOverflow();
});
