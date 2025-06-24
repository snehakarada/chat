const sendMessage = () => {
  alert('sending');
};

const renderMessages = (messages) => {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = '';

  messages.forEach((msg) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(msg.from === 'me' ? 'from-me' : 'from-other');
    div.textContent = `${msg.from}: ${msg.message}`;
    messagesContainer.appendChild(div);
  });
};

const receiveMessage = async () => {
  const response = await fetch('/getmessage');
  const jsonData = await response.json();

  // Use this line only if you're not sure about response type
  // console.log(await response.text());

  renderMessages(jsonData);
};

const main = () => {
  receiveMessage();
  const button = document.getElementById('send');
  button.addEventListener('click', sendMessage);
};

globalThis.onload = main;
