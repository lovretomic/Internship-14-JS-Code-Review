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
        codeNumsBar.innerHTML += `<div class="code__nums-num">${i}</div>`;
      }
    })
    .then(() => {
      codeNums = document.querySelectorAll('.code__nums-num');
      for(let i = 0; i < codeNums.length; i++) {
        codeNums[i].addEventListener('click', () => {
          addNoteMenuStatus.opened = true;
          addNoteMenuStatus.index = i;
          codeNums[addNoteMenuStatus.index].classList.remove('selected');
          addNoteMenu.style.display = 'block';
          addNoteMenu.style.top = `${5 + i * 25}px`;
          codeNums[i].classList.add('selected');
        })
      }
    })
    .catch((err) => console.log(err));

window.addEventListener('click', (e) => {   
  if (!(addNoteMenu.contains(e.target) || codeNumsBar.contains(e.target))){
    if (addNoteMenu.style.display !== 'none') {
      addNoteMenuStatus.opened = false;
      addNoteMenu.style.display = 'none'
      codeNums[addNoteMenuStatus.index].classList.remove('selected');
      addNoteMenuStatus.index = -1;
    };
  }
});

class Note {
  constructor(type, line, body) {
    this.type = type;
    this.line = line;
    this.body = body;
  }
  post() {
    console.log("Posted!", this.body);
    if (this.type === 'note') {
      let allNotes = JSON.parse(localStorage.getItem(lsKey));
      allNotes.push({line: this.line, body: this.body});
      localStorage.setItem(lsKey, JSON.stringify(allNotes));
    }
  }
}

function addNote() {
  if (addNoteMenuStatus.index < 0) { console.error('No line selected.'); return; }
  const note = new Note('note', addNoteMenuStatus.index, document.querySelector('.code__add-input').innerHTML);
  note.post();
}
