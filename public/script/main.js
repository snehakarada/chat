let currentUser = null;

const fetchCurrentUser = async () => {
  if (currentUser) return currentUser;
  const res = await fetch('/me');
  const { username } = await res.json();
  currentUser = username;

  const userAvatar = document.getElementById('user-avatar');
  if (userAvatar) {
    userAvatar.textContent = username[0]?.toUpperCase() || '?';
  }

  return username;
};

const fetchFriends = async () => {
  const response = await fetch('/chat-list');
  const friends = await response.json();
  return friends;
};

const showChat = async (chat_id) => {
  const response = await fetch(`/chat/${chat_id}`);
  const { chatName, chats } = await response.json();
  renderChat(chats, chatName, chat_id);
};

const renderChat = (messages, chatName, chatId) => {
  const chatWindow = document.getElementById('chat-window');
  chatWindow.innerHTML = '';

  const header = document.createElement('h2');
  header.textContent = `Chat with ${chatName}`;
  chatWindow.appendChild(header);

  const messagesContainer = document.createElement('div');
  messagesContainer.style.flex = '1';
  messagesContainer.style.overflowY = 'auto';

  const myUsername = currentUser;

  messages.forEach((msg) => {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper');

    if (msg.from === myUsername) {
      messageWrapper.classList.add('from-me');
    } else {
      messageWrapper.classList.add('from-them');
    }

    const messageBubble = document.createElement('div');
    messageBubble.className = 'message';
    messageBubble.textContent = msg.msg;

    messageWrapper.appendChild(messageBubble);
    messagesContainer.appendChild(messageWrapper);
  });

  const inputBox = document.createElement('input');
  inputBox.type = 'text';
  inputBox.placeholder = 'Type your message';
  inputBox.className = 'chat-input';

  const sendBtn = document.createElement('button');
  sendBtn.textContent = 'Send';
  sendBtn.className = 'send-button';

  const inputContainer = document.createElement('div');
  inputContainer.className = 'input-container';
  inputContainer.appendChild(inputBox);
  inputContainer.appendChild(sendBtn);

  sendBtn.addEventListener('click', async () => {
    const msg = inputBox.value.trim();
    if (!msg) return;

    try {
      const response = await fetch('/storechat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: chatName,
          msg: msg,
        }),
      });

      inputBox.value = '';
      await showChat(chatId);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  chatWindow.appendChild(messagesContainer);
  chatWindow.appendChild(inputContainer);
};

const renderFriends = async () => {
  const response = await fetchFriends();
  const friends = response.data.chats;
  const container = document.getElementById('friends-list');
  container.innerHTML = '';

  const header = document.createElement('h3');
  header.textContent = 'Friends';
  header.className = 'friends-header';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search friends';
  searchInput.className = 'chat-input search-box';
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    const allFriends = container.querySelectorAll('.friend');
    allFriends.forEach((friend) => {
      const name = friend
        .querySelector('.friend-name')
        .textContent.toLowerCase();
      friend.style.display = name.includes(filter) ? 'flex' : 'none';
    });
  });

  container.appendChild(header);
  container.appendChild(searchInput);

  friends.forEach((friend) => {
    const div = document.createElement('div');
    div.className = 'friend';

    const profileCircle = document.createElement('div');
    profileCircle.className = 'profile-circle';
    profileCircle.textContent = friend.name[0]?.toUpperCase() || '?';

    const details = document.createElement('div');
    details.className = 'friend-details';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'friend-name';
    nameDiv.textContent = friend.name;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'last-message';
    msgDiv.textContent = friend.last_message;

    details.appendChild(nameDiv);
    details.appendChild(msgDiv);

    div.appendChild(profileCircle);
    div.appendChild(details);

    div.addEventListener('click', () => {
      showChat(friend.chat_id);
    });

    container.appendChild(div);
  });
};

const sentFollowRequest = async (name) => {
  alert(`sent request to ${name} `);
  const response = await fetch(`/request/${name}`);
  console.log('The response of request is', await response.text());
  renderFriends();
};

const searchNewFriends = async (input) => {
  const name = input.value.trim();
  if (!name) return;

  try {
    const res = await fetch(`/search/${name}`);
    const result = await res.json();

    let old = document.getElementById('search-result');
    if (old) old.remove();

    if (result.isExist) {
      const resultDiv = document.createElement('div');
      resultDiv.id = 'search-result';

      const nameSpan = document.createElement('span');
      nameSpan.textContent = name;

      const followBtn = document.createElement('button');
      followBtn.textContent = 'Follow';
      followBtn.addEventListener('click', () => sentFollowRequest(name));

      resultDiv.appendChild(nameSpan);
      resultDiv.appendChild(followBtn);

      input.parentElement.appendChild(resultDiv);
    } else {
      alert('User not found.');
    }
  } catch (err) {
    console.error('Search failed', err);
  }
};

const showSearchBar = () => {
  let container = document.getElementById('new-friend-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'new-friend-container';

    const input = document.createElement('input');
    input.id = 'new-friend-input';
    input.type = 'text';
    input.placeholder = 'Enter new friend username';

    const btn = document.createElement('button');
    btn.textContent = 'Find';
    btn.className = 'send-button';

    btn.addEventListener('click', () => searchNewFriends(input));

    container.appendChild(input);
    container.appendChild(btn);

    const parent = document.getElementById('friends-list');
    parent.appendChild(container);
  } else {
    container.style.display =
      container.style.display === 'none' ? 'flex' : 'none';
  }
};

const main = async () => {
  await fetchCurrentUser();
  renderFriends();
  const icon = document.getElementById('icon');
  icon.addEventListener('click', showSearchBar);
};

globalThis.onload = main;
