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
  const { isAccountCreated, messgae } = await response.json();
  if (isAccountCreated) {
    globalThis.location.href = '../main.html';
  }

  alert(error);
};

const main = () => {
  const button = document.querySelector('.submit');
  button.addEventListener('click', (event) => signUp(event));
};

globalThis.onload = main;
