const signUp = async (event) => {
  event.preventDefault();
  const form = document.getElementById('form');
  const formData = new FormData(form);
  const username = formData.get('username');
  const password = formData.get('pwd');
  const data = { username, password };
  const response = await fetch('/signup', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('The response is ', await response.text());

  globalThis.location.href = '../main.html';
};

const main = () => {
  const button = document.querySelector('.submit');
  console.log('button', button);
  button.addEventListener('click', (event) => signUp(event));
};
globalThis.onload = main;
