// Function to apply bold or italic formatting to the selected text
function applyFormat(command: string): void {
    const focusedElement = document.activeElement as HTMLTextAreaElement | HTMLDivElement;

    if (focusedElement instanceof HTMLTextAreaElement) {
        const startPos = focusedElement.selectionStart;
        const endPos = focusedElement.selectionEnd;
        const selectedText = focusedElement.value.slice(startPos, endPos);
        
        if (selectedText) {
            const formattedText = command === 'bold' ? `**${selectedText}**` : `*${selectedText}*`;
            focusedElement.setRangeText(formattedText, startPos, endPos, 'select');
        } else {
            const cursorPosition = focusedElement.selectionStart;
            const formatText = command === 'bold' ? '**' : '*';
            focusedElement.setRangeText(formatText + formatText, cursorPosition, cursorPosition, 'select');
        }
    } else if (focusedElement instanceof HTMLDivElement) {
        if (command === 'bold') {
            document.execCommand('bold', false, '');
        } else if (command === 'italic') {
            document.execCommand('italic', false, '');
        }
    }
}

// Listen for the keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic)
document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Check if Ctrl (or Cmd on Mac) is pressed along with B or I
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault(); // Prevent default action for Ctrl+B
        applyFormat('bold');
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault(); // Prevent default action for Ctrl+I
        applyFormat('italic');
    }
});

// Event listener for generating the resume
document.getElementById('generate-resume')?.addEventListener('click', () => {
    const pictureInput = document.getElementById('upload-picture') as HTMLInputElement;
    let name = (document.getElementById('name') as HTMLInputElement).value;
    let objective = (document.getElementById('objective') as HTMLTextAreaElement).value;
    let contact = (document.getElementById('contact') as HTMLTextAreaElement).value;
    let experience = (document.getElementById('experience') as HTMLTextAreaElement).value;
    let education = (document.getElementById('education') as HTMLTextAreaElement).value;
    let skills = (document.getElementById('skills') as HTMLTextAreaElement).value;
    let projects = (document.getElementById('projects') as HTMLTextAreaElement).value;
    let certificates = (document.getElementById('certificates') as HTMLTextAreaElement).value;

    if (!name || !objective || !contact || !experience || !education || !skills || !projects || !certificates) {
        alert("Please fill all the required fields.");
        return;
    }

    let pictureHTML = '';
    if (pictureInput.files && pictureInput.files[0]) {
        const pictureURL = URL.createObjectURL(pictureInput.files[0]);
        pictureHTML = `<img src="${pictureURL}" alt="Profile Picture">`;
    }

    // Format list-like inputs
    const formatList = (text: string) => {
        return text.split(/,|\n/).map(item => item.trim()).filter(Boolean).map(item => `<li>${item}</li>`).join('');
    };

    // Format paragraphs with <br> for line breaks
    const formatParagraphs = (text: string) => {
        return text.split('\n').map(line => `<p>${line}</p>`).join('');
    };

    // Format paragraphs with <br> for line breaks (to preserve line breaks in output)
    const formatTextWithLineBreaks = (text: string) => {
        return text.replace(/\n/g, '<br>');
    };

    const resumeHTML = `
        ${pictureHTML}
        <h1 contenteditable="true" id="edit-name">${name}</h1>
        <h3>Objective</h3>
        <p contenteditable="true" id="edit-objective">${formatTextWithLineBreaks(objective)}</p>
        <h3>Contact Info</h3>
        <p contenteditable="true" id="edit-contact">${formatTextWithLineBreaks(contact)}</p>
        <h3>Experience</h3>
        <p contenteditable="true" id="edit-experience">${formatTextWithLineBreaks(experience)}</p>
        <h3>Education</h3>
        <p contenteditable="true" id="edit-education">${formatTextWithLineBreaks(education)}</p>
        <h3>Skills</h3>
        <ul contenteditable="true" id="edit-skills">${formatList(skills)}</ul>
        <h3>Projects</h3>
        <p contenteditable="true" id="edit-projects">${formatTextWithLineBreaks(projects)}</p>
        <h3>Certificates</h3>
        <p contenteditable="true" id="edit-certificates">${formatTextWithLineBreaks(certificates)}</p>
        <button id="print-resume">Print Resume</button>
    `;

    const newWindow = window.open("", "Resume", "width=800,height=1000");
    if (newWindow) {
        newWindow.document.write(`
            <html>
                <head>
                    <title>Generated Resume</title>
                    <style>
                        body {
                            font-family: 'Poppins', sans-serif;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        h1 { text-align: center; color: #007bff; }
                        h3 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
                        p, ul { font-size: 1.2rem; line-height: 1.6; }
                        ul { padding-left: 20px; }
                        li { margin-bottom: 5px; }
                        img { display: block; margin: 0 auto; border-radius: 50%; width: 150px; height: 150px; }
                        button { padding: 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer; margin: 5px; }
                        
                        /* Hide buttons and header in print */
                        @media print {
                            button, header {
                                display: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <header style="display: none;">Generated Resume - ${new Date().toLocaleDateString()}</header>
                    ${resumeHTML}
                </body>
            </html>
        `);
        
        newWindow.document.close();

        const printButton = newWindow.document.getElementById("print-resume") as HTMLButtonElement;
        printButton?.addEventListener("click", () => {
            newWindow.print();
            const buttons = newWindow.document.querySelectorAll("button");
            buttons.forEach(button => button.remove());

            const header = newWindow.document.querySelector("header");
            if (header) header.remove();
        });
    }
});
