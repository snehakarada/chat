const fetchFriends = async () => {
  const response = await fetch('/getfriends');
  const friends = await response.json();
  console.log('friends', friends);
  return friends;
};

const renderFriends = async () => {
  const friends = await fetchFriends();
  const container = document.getElementById('friends-list');

  friends.forEach((friend) => {
    const div = document.createElement('div');
    div.className = 'friend';
    div.textContent = friend;

    div.addEventListener('click', () => {
      alert(`You clicked on ${friend}`);
      // or handle further logic here
    });

    container.appendChild(div);
  });
};

const showChat = async () => {
  alert('hi');
  const friendName = 'bhagya';
  const response = await fetch(`/chat/${friendName}`);
  console.log('The response is', response.text());
};

const main = async () => {
  renderFriends();
};

globalThis.onload = main;
