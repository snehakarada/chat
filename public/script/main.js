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
  messages.forEach((msg, index) => {
    console.log(`Message ${index}:`, msg);

    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(msg.from === friendName ? 'from-them' : 'from-me');

    div.textContent = msg.msg;

    // TEMP: debugging visuals
    div.style.border = '1px solid red';
    div.style.backgroundColor = 'yellow';

    chatWindow.appendChild(div);
  });
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
