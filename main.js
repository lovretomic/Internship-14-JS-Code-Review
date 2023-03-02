const baseUrl = 'https://homework-server1.onrender.com';
const key = 'lovretomic';

const codeNums = document.querySelector('.code__nums');
const codeContent = document.querySelector('.code__content');

function addNote(lineIndex) {

}

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
        codeNums.innerHTML += `<div class="code__nums-num">${i}</div>`;
      }
    })
    .catch((err) => console.log(err));
