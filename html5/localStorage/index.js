var value = document.querySelector('#ta');
var btn = document.querySelector('#btn');
btn.addEventListener('click', saveData, false);
if(localStorage.text) {
  value.value = localStorage.text;
}
function saveData () {
  localStorage.text = value.value;
}