// This is the service worker with the Cache-first network

const CACHE = "pwabuilder-precache";
const precacheFiles = []
const remember = [
  /* Add an array of files to precache for your app */
  "assets/TSN_Light_Cruiser_Pic.png",
  "assets/TSN_Scout_Pic.png",
  "assets/TSN_Battleship_Pic.png",
  "assets/TSN_Missile_Cruiser_Pic.png",
  "assets/TSN_Dreadnought_Pic.png",
  "assets/TSN_Medium_Carrier.png",
  "assets/TSN_Mine_Layer.png",
  "assets/TSN_Juggernaut_Pic.png",
  "assets/Ximni_Light_Cruiser.png",
  "assets/Ximni_Scout.png",
  "assets/Ximni_Battleship.png",
  "assets/Ximni_Missile_Cruiser.png",
  "assets/Ximni_Dreadnought.png",
  "assets/Ximni_Carrier.png}",
  "assets/Pirate_Strongbow.png",
  "assets/Pirate_Longbow.png",
  "assets/Pirate_Brigantine.png",
  'assets/artemis-logo.png',
  'assets/background.png',
  'assets/sounds/picked.mp3',
  'assets/sounds/pick-done.mp3', 
  'assets/sounds/pyl-board2.mp3'
];

self.addEventListener("install", function (event) {
  console.log("Artemis Battle Randomizer Install Event processing");

  console.log("Artemis Battle Randomizer Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Artemis Battle Randomizer Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("Artemis Battle Randomizer Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) { 
  if (event.request.method !== "GET") return;

  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        // The response was found in the cache so we responde with it and update the entry

        // This is where we call the server to get the newest version of the
        // file to use the next time we show view
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        // The response was not found in the cache so we look for it on the server
        return fetch(event.request)
          .then(function (response) {
            // If request was success, add or update it in the cache
            event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function (error) {
            console.log("Artemis Battle Randomizer Network request failed and no cache." + error);
          });
      }
    )
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}
