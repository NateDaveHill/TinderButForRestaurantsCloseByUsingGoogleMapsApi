document.addEventListener('DOMContentLoaded', () => {
  const API_ENDPOINT = 'http://localhost:3000/api/restaurants'; // Proxy server URL
  const GOOGLE_MAPS_API_KEY = 'AIzaSyCEj_vL2caLxmvy2NcvVdoZdfBysjZMHbM'; // Replace with your API key

  async function fetchRestaurants(latitude, longitude) {
    try {
      const response = await fetch(`${API_ENDPOINT}?latitude=${latitude}&longitude=${longitude}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status !== 'OK') {
        throw new Error(`API error! status: ${data.status}`);
      }
      return data.results;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  }

  function getPhotoUrl(photoReference) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
  }

  function createProfileCard(restaurant) {
    const profileCard = document.createElement('div');
    profileCard.classList.add('profile');

    const img = document.createElement('img');
    if (restaurant.photos && restaurant.photos.length > 0) {
      img.src = getPhotoUrl(restaurant.photos[0].photo_reference);
    } else {
      img.src = 'default-image.jpg'; // Fallback image
    }
    profileCard.appendChild(img);

    const name = document.createElement('h2');
    name.textContent = restaurant.name;
    profileCard.appendChild(name);

    const address = document.createElement('p');
    address.textContent = restaurant.vicinity;
    profileCard.appendChild(address);

    return profileCard;
  }

  function displayProfiles(restaurants) {
    const profilesContainer = document.getElementById('profiles');
    profilesContainer.innerHTML = ''; // Clear existing profiles

    restaurants.forEach((restaurant, index) => {
      const profileCard = createProfileCard(restaurant);
      profileCard.style.zIndex = restaurants.length - index;
      profilesContainer.appendChild(profileCard);
    });

    initSwipe();
  }

  function initSwipe() {
    const profiles = document.querySelectorAll('.profile');
    let startX, startY, initialX, initialY, offsetX, offsetY, currentProfile;

    function handleTouchStart(event) {
      currentProfile = event.currentTarget;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      initialX = currentProfile.offsetLeft;
      initialY = currentProfile.offsetTop;
      offsetX = 0;
      offsetY = 0;
    }

    function handleTouchMove(event) {
      offsetX = event.touches[0].clientX - startX;
      offsetY = event.touches[0].clientY - startY;
      currentProfile.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    function handleTouchEnd() {
      if (Math.abs(offsetX) > currentProfile.clientWidth / 2) {
        currentProfile.style.transform = `translate(${offsetX > 0 ? '100%' : '-100%'}, ${offsetY}px)`;
        currentProfile.style.opacity = 0;
        setTimeout(() => {
          currentProfile.remove();
        }, 300);
      } else {
        currentProfile.style.transform = 'translate(0, 0)';
      }
    }

    profiles.forEach(profile => {
      profile.addEventListener('touchstart', handleTouchStart);
      profile.addEventListener('touchmove', handleTouchMove);
      profile.addEventListener('touchend', handleTouchEnd);
    });
  }

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetchRestaurants(latitude, longitude).then(displayProfiles);
  });
});
