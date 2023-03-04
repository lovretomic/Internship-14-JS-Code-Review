const addNoteMenuStatus = {
  opened: false,
  index: -1
}

const baseUrl = 'https://homework-server1.onrender.com';
const key = 'lovretomic';
const lsKey = 'notes';

if (!localStorage.getItem(lsKey)) localStorage.setItem(lsKey, JSON.stringify([]));

const codeNumsBar = document.querySelector('.code__nums');
let codeNums;
const codeContent = document.querySelector('.code__content');
const addNoteMenu = document.querySelector('.code__add');

const lineHeight = 25;

fetch(`${baseUrl}/code`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      key
    },
  })
    .then((response) => response.json())
    .then((response) => response.code.split('\n'))
    .then((response) => {
      for(let i = 0; i < response.length; i++) {
        codeContent.innerHTML += `<p class="code__content-line">${response[i]}</p>`;
        codeNumsBar.innerHTML += `<div class="code__nums-num">${i + 1}</div>`;
      }
    })
    .then(() => {
      codeNums = document.querySelectorAll('.code__nums-num');
      for(let i = 0; i < codeNums.length; i++) {
        codeNums[i].addEventListener('click', () => {
          if (addNoteMenuStatus.index !== -1) codeNums[addNoteMenuStatus.index].classList.remove('selected');
          if (addNoteMenuStatus.opened === false) toggleAddNoteMenu(i);
          else {addNoteMenuStatus.index = i; refreshAddNoteMenu();}

          addNoteMenu.style.top = `${5 + i * 25}px`;
          codeNums[i].classList.add('selected');

          const noteSection = document.querySelector('.code__add-note');
          const addNoteButton = document.querySelector('.code__add-buttons-button:nth-of-type(2)');
          const commentSection = document.querySelector('.code__add-comment');
          const addCommentButton = document.querySelector('.code__add-buttons-button:nth-of-type(1)');

          noteSection.style.display = 'none';
          commentSection.style.display = 'none';

          const notesData = JSON.parse(localStorage.getItem(lsKey));
          for (data of notesData) {
            if (data.line == i) {
              const noteSectionOutput = document.querySelector('.code__add-note > .code__add-output');
              noteSection.style.display = 'flex';
              noteSectionOutput.innerHTML = data.body;
              addNoteButton.disabled = true;
              break;
            }
          }
            
        })
      }
    })
    .then(() => refresh())
    .catch((err) => console.log(err));

window.addEventListener('click', (e) => {  
  console.log(addNoteMenuStatus.index);
  if (!(addNoteMenu.contains(e.target) || codeNumsBar.contains(e.target))){
    if (addNoteMenuStatus.opened === true) toggleAddNoteMenu();
  }
});

class Note {
  constructor(type, line, body) {
    this.type = type;
    this.line = line;
    this.body = body;
  }
  post() {
    console.log('Posted!', this.body);
    if (this.type === 'note') {
      let allNotes = JSON.parse(localStorage.getItem(lsKey));
      allNotes.push({line: this.line, body: this.body});
      localStorage.setItem(lsKey, JSON.stringify(allNotes));
    }
  }
}

function addNote() {
  if (addNoteMenuStatus.index < 0) { console.error('No line selected.'); return; }
  const input = document.querySelector('.code__add-input').innerHTML;
  if (input === '') {
    alert('Notes and comments must not be empty!');
    return;
  }
  const note = new Note('note', addNoteMenuStatus.index, input);
  note.post();
  refresh();
  toggleAddNoteMenu();
  document.querySelector('.code__add-input').innerHTML = '';
}

function removeNote() {
  if (addNoteMenuStatus.index === -1) return;
  let lsData = JSON.parse(localStorage.getItem(lsKey));
  let i = 0;
  for (data of lsData) {
    if (data.line === addNoteMenuStatus.index) {
      lsData.splice(i, 1);
      break;
    }
    i++;
  }
    
  localStorage.setItem(lsKey, JSON.stringify(lsData));
  refresh();
  toggleAddNoteMenu();
}

function refresh() {
  for (line of codeNums)
    line.classList.remove('note');
  const notesData = JSON.parse(localStorage.getItem(lsKey));
  if (notesData.length === 0) return;
  for (data of notesData) {
    codeNums[data.line].classList.add('note');
  }
}

function refreshAddNoteMenu() {
  document.querySelector('.code__add-note').style.display = 'none';
  document.querySelector('.code__add-buttons-button:nth-of-type(2)').disabled = false;
  document.querySelector('.code__add-comment').style.display = 'none';
  document.querySelector('.code__add-buttons-button:nth-of-type(1)').disabled = false;
}

function toggleAddNoteMenu(i = -1) {
  if (addNoteMenuStatus.opened === true) {
    addNoteMenuStatus.opened = false;
    addNoteMenu.style.display = 'none';
    codeNums[addNoteMenuStatus.index].classList.remove('selected');
  }
  else {
    addNoteMenuStatus.opened = true;
    addNoteMenu.style.display = 'block';
  }
  addNoteMenuStatus.index = i;
  refreshAddNoteMenu();
}
