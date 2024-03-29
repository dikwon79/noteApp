//I used chatgpt to write the codes partly.
class Button {
    constructor(label, clickHandler) {
        this.element = document.createElement('button');
        this.element.textContent = label;
        this.element.addEventListener('click', clickHandler);
    }

    getElement() {
        return this.element;
    }
}

class Textarea {
    constructor(initialValue, inputHandler) {
        this.element = document.createElement('textarea');
        this.element.value = initialValue;
        this.element.addEventListener('input', inputHandler);
    }

    getValue() {
        return this.element.value;
    }

    getElement() {
        return this.element;
    }
}

class Form {
    constructor(note) {
        this.note = note;
    }

    createNoteElement(note, index) {
        const notesContainer = document.getElementById('contents');
        const noteElement = document.createElement('div');
        noteElement.className = 'pair';

        const textarea = new Textarea(note.content, (event) => this.note.updateNoteContent(index, event.target.value));
        const removeButton = new Button('Remove', () => this.note.removeNoteElement(index));
        noteElement.appendChild(textarea.getElement());

        if (getCurrentFileName() === 'writer.html') {
            noteElement.appendChild(removeButton.getElement());
        }
        
        notesContainer.appendChild(noteElement);
    }
}

class Note {
    constructor() {
        this.loadNotes();
        this.displayLastSaveTime();
        if (getCurrentFileName() === 'writer.html') {

            setInterval(() => this.saveNotesToLocalStorage(), 2000);}

        else{

            setInterval(() => this.loadNotes(), 2000);
        
        }
    }
    
    loadNotes() {
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes !== null) {
            this.savedNotes = JSON.parse(storedNotes);
        } else {
            this.savedNotes = [];
        }
        if (getCurrentFileName() === 'reader.html') {
            this.displayLastUpdateTime();
        }
        this.renderNotes();
    }

    renderNotes() {
        this.ui = new Form(this);
        const notesContainer = document.getElementById('contents');
        notesContainer.innerHTML = '';

        this.savedNotes.forEach((note, index) => {
            this.ui.createNoteElement(note, index);
        });


    }
    

    addNote() {
        this.savedNotes.push({ content: '' });
        this.saveNotesToLocalStorage();
        this.renderNotes();
    }

    removeNoteElement(index) {
        this.savedNotes.splice(index, 1);
        this.saveNotesToLocalStorage();
        this.renderNotes();
    }

    updateNoteContent(index, content) {
        this.savedNotes[index].content = content;
    }

    saveNotesToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(this.savedNotes));
        localStorage.setItem('lastSaveTime', new Date().toLocaleTimeString());
        this.displayLastSaveTime();
    }

    displayLastSaveTime() {
        const lastSaveTime = localStorage.getItem('lastSaveTime');
        const storeTimeElement = document.getElementById('last-save-time');
        if (lastSaveTime) {
            storeTimeElement.innerText = lastSaveTime;
        }
    }
    displayLastUpdateTime() {
        const storeTimeElement = document.getElementById('last-save-time');
        storeTimeElement.innerText = new Date().toLocaleTimeString();
    }
}

const note = new Note();

function getCurrentFileName() {
    // Get the current pathname, e.g., "/path/to/your/file.html"
    const pathName = window.location.pathname;

    // Extract the filename from the path
    const fileName = pathName.substring(pathName.lastIndexOf('/') + 1);

    return fileName;
}
