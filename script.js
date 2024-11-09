var _a;
// Function to apply bold or italic formatting to the selected text
function applyFormat(command) {
    var focusedElement = document.activeElement;
    if (focusedElement instanceof HTMLTextAreaElement) {
        var startPos = focusedElement.selectionStart;
        var endPos = focusedElement.selectionEnd;
        var selectedText = focusedElement.value.slice(startPos, endPos);
        if (selectedText) {
            var formattedText = command === 'bold' ? "**".concat(selectedText, "**") : "*".concat(selectedText, "*");
            focusedElement.setRangeText(formattedText, startPos, endPos, 'select');
        }
        else {
            var cursorPosition = focusedElement.selectionStart;
            var formatText = command === 'bold' ? '**' : '*';
            focusedElement.setRangeText(formatText + formatText, cursorPosition, cursorPosition, 'select');
        }
    }
    else if (focusedElement instanceof HTMLDivElement) {
        if (command === 'bold') {
            document.execCommand('bold', false, '');
        }
        else if (command === 'italic') {
            document.execCommand('italic', false, '');
        }
    }
}
// Listen for the keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic)
document.addEventListener('keydown', function (e) {
    // Check if Ctrl (or Cmd on Mac) is pressed along with B or I
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault(); // Prevent default action for Ctrl+B
        applyFormat('bold');
    }
    else if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault(); // Prevent default action for Ctrl+I
        applyFormat('italic');
    }
});
// Event listener for generating the resume
(_a = document.getElementById('generate-resume')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    var pictureInput = document.getElementById('upload-picture');
    var name = document.getElementById('name').value;
    var objective = document.getElementById('objective').value;
    var contact = document.getElementById('contact').value;
    var experience = document.getElementById('experience').value;
    var education = document.getElementById('education').value;
    var skills = document.getElementById('skills').value;
    var projects = document.getElementById('projects').value;
    var certificates = document.getElementById('certificates').value;
    if (!name || !objective || !contact || !experience || !education || !skills || !projects || !certificates) {
        alert("Please fill all the required fields.");
        return;
    }
    var pictureHTML = '';
    if (pictureInput.files && pictureInput.files[0]) {
        var pictureURL = URL.createObjectURL(pictureInput.files[0]);
        pictureHTML = "<img src=\"".concat(pictureURL, "\" alt=\"Profile Picture\">");
    }
    // Format list-like inputs
    var formatList = function (text) {
        return text.split(/,|\n/).map(function (item) { return item.trim(); }).filter(Boolean).map(function (item) { return "<li>".concat(item, "</li>"); }).join('');
    };
    // Format paragraphs with <br> for line breaks
    var formatParagraphs = function (text) {
        return text.split('\n').map(function (line) { return "<p>".concat(line, "</p>"); }).join('');
    };
    // Format paragraphs with <br> for line breaks (to preserve line breaks in output)
    var formatTextWithLineBreaks = function (text) {
        return text.replace(/\n/g, '<br>');
    };
    var resumeHTML = "\n        ".concat(pictureHTML, "\n        <h1 contenteditable=\"true\" id=\"edit-name\">").concat(name, "</h1>\n        <h3>Objective</h3>\n        <p contenteditable=\"true\" id=\"edit-objective\">").concat(formatTextWithLineBreaks(objective), "</p>\n        <h3>Contact Info</h3>\n        <p contenteditable=\"true\" id=\"edit-contact\">").concat(formatTextWithLineBreaks(contact), "</p>\n        <h3>Experience</h3>\n        <p contenteditable=\"true\" id=\"edit-experience\">").concat(formatTextWithLineBreaks(experience), "</p>\n        <h3>Education</h3>\n        <p contenteditable=\"true\" id=\"edit-education\">").concat(formatTextWithLineBreaks(education), "</p>\n        <h3>Skills</h3>\n        <ul contenteditable=\"true\" id=\"edit-skills\">").concat(formatList(skills), "</ul>\n        <h3>Projects</h3>\n        <p contenteditable=\"true\" id=\"edit-projects\">").concat(formatTextWithLineBreaks(projects), "</p>\n        <h3>Certificates</h3>\n        <p contenteditable=\"true\" id=\"edit-certificates\">").concat(formatTextWithLineBreaks(certificates), "</p>\n        <button id=\"print-resume\">Print Resume</button>\n    ");
    var newWindow = window.open("", "Resume", "width=800,height=1000");
    if (newWindow) {
        newWindow.document.write("\n            <html>\n                <head>\n                    <title>Generated Resume</title>\n                    <style>\n                        body {\n                            font-family: 'Poppins', sans-serif;\n                            padding: 20px;\n                            background-color: #f9f9f9;\n                        }\n                        h1 { text-align: center; color: #007bff; }\n                        h3 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px; }\n                        p, ul { font-size: 1.2rem; line-height: 1.6; }\n                        ul { padding-left: 20px; }\n                        li { margin-bottom: 5px; }\n                        img { display: block; margin: 0 auto; border-radius: 50%; width: 150px; height: 150px; }\n                        button { padding: 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer; margin: 5px; }\n                        \n                        /* Hide buttons and header in print */\n                        @media print {\n                            button, header {\n                                display: none;\n                            }\n                        }\n                    </style>\n                </head>\n                <body>\n                    <header style=\"display: none;\">Generated Resume - ".concat(new Date().toLocaleDateString(), "</header>\n                    ").concat(resumeHTML, "\n                </body>\n            </html>\n        "));
        newWindow.document.close();
        var printButton = newWindow.document.getElementById("print-resume");
        printButton === null || printButton === void 0 ? void 0 : printButton.addEventListener("click", function () {
            newWindow.print();
            var buttons = newWindow.document.querySelectorAll("button");
            buttons.forEach(function (button) { return button.remove(); });
            var header = newWindow.document.querySelector("header");
            if (header)
                header.remove();
        });
    }
});
