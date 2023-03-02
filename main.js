const baseUrl = 'https://homework-server1.onrender.com';
const key = 'lovretomic';

const codeNumsBar = document.querySelector('.code__nums');
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
      const codeNums = document.querySelectorAll('.code__nums-num');
      for(let i = 0; i < codeNums.length; i++) {
        codeNums[i].addEventListener('click', () => {
          addNoteMenu.style.display = 'block';
          addNoteMenu.style.top = `${5 + i * 25}px`;
          codeNums[i].classList.add('selected');
        })
      }
    })
    .catch((err) => console.log(err));

