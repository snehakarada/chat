const fetchFriends = async () => {
  const response = await fetch('/getfriends');
  const friends = await response.json();
  console.log('friends', friends);
  return friends;
};

const showChat = async (friendName) => {
  const response = await fetch(`/chat/${friendName}`);
  const messages = await response.json();
  console.log('The response is', messages);
  renderChat(messages, friendName);
};

const renderChat = (messages, friendName) => {
  const chatWindow = document.getElementById('chat-window');
  chatWindow.innerHTML = `<h2>Chat with ${friendName}</h2>`;

  const messagesContainer = document.createElement('div');
  messagesContainer.style.flex = '1';
  messagesContainer.style.overflowY = 'auto';

  messages.forEach((msg, index) => {
    console.log(`Message ${index}:`, msg);

    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(msg.from === friendName ? 'from-them' : 'from-me');
    div.textContent = msg.msg;

    // TEMP: debugging visuals
    div.style.border = '1px solid red';
    div.style.backgroundColor = 'yellow';

    messagesContainer.appendChild(div);
  });

  // Input box and send button
  const inputBox = document.createElement('input');
  inputBox.type = 'text';
  inputBox.placeholder = 'Type your message';
  inputBox.style.marginTop = '10px';
  inputBox.style.padding = '10px';
  inputBox.style.borderRadius = '5px';
  inputBox.style.border = '1px solid #ccc';
  inputBox.style.width = 'calc(100% - 22px)';

  const sendBtn = document.createElement('button');
  sendBtn.textContent = 'Send';
  sendBtn.style.marginTop = '10px';
  sendBtn.style.padding = '10px';
  sendBtn.style.borderRadius = '5px';
  sendBtn.style.marginLeft = '5px';

  const inputContainer = document.createElement('div');
  inputContainer.style.display = 'flex';
  inputContainer.style.marginTop = '10px';

  inputContainer.appendChild(inputBox);
  inputContainer.appendChild(sendBtn);

  sendBtn.addEventListener('click', async () => {
    const msg = inputBox.value.trim();
    if (!msg) return;

    try {
      await fetch('/storechat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: friendName,
          msg: msg,
        }),
      });

      inputBox.value = '';
      // Optionally: refresh the chat window after sending
      // await showChat(friendName);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  chatWindow.appendChild(messagesContainer);
  chatWindow.appendChild(inputContainer);
};

const renderFriends = async () => {
  const friends = await fetchFriends();
  const container = document.getElementById('friends-list');

  friends.forEach((friend) => {
    const div = document.createElement('div');
    div.className = 'friend';
    div.textContent = friend;

    div.addEventListener('click', () => {
      showChat(friend);
    });

    container.appendChild(div);
  });
};

const main = async () => {
  renderFriends();
};

globalThis.onload = main;
