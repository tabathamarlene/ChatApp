// URL und Token bereitstellen
const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";
const currentUser = "Tom"; // Der aktuell eingeloggte Benutzer

// Nutzer aus der Freundesliste extrahieren
const friendList = Array.from(document.querySelectorAll(".friendlist .listitems")).map(el => el.textContent);

// Funktion, um Nutzer vom Backend zu laden
function loadUsers() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const data = JSON.parse(xmlhttp.responseText);
            console.log("Alle Nutzer vom Backend:", data);
            populateDatalist(data);
        }
    };
    xmlhttp.open("GET", `${backendUrl}/user`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// Funktion, um datalist mit erlaubten Nutzern zu befüllen
function populateDatalist(users) {
        const datalist = document.getElementById("friend-selector");
        datalist.innerHTML = ""; // Alte Einträge löschen

         // Freundesliste korrekt extrahieren
    const friendList = Array.from(document.querySelectorAll(".friendlist .listitems"))
    .map(el => el.textContent.trim());
console.log("Freundesliste nach Extraktion:", friendList);

const allowedUsers = users.filter(user => {
    const isCurrentUser = user === currentUser;
    const isInFriendList = friendList.some(friend => friend.toLowerCase() === user.toLowerCase());
    return !isCurrentUser && !isInFriendList;
});
console.log("Gefilterte Nutzer:", allowedUsers);

    

    // Optionen zur datalist hinzufügen
    allowedUsers.forEach(user => {
        const option = document.createElement("option");
        option.value = user;
        datalist.appendChild(option);
    });
}

// Funktion, um eine Freundschaftsanfrage zu erstellen
function sendFriendRequest(username) {
     //Validierung: Ist der Nutzername in der datalist enthalten?
    const validUsernames = Array.from(document.querySelectorAll("#friend-selector option")).map(opt => opt.value);
    if (!validUsernames.includes(username)) {
        alert("Ungültiger Nutzername oder Nutzer ist bereits Freund!");
        return;
    }

    // Anfrage senden
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 204) {
                alert("Freundschaftsanfrage erfolgreich gesendet!");
            } else {
                alert("Fehler beim Senden der Anfrage.");
            }
        }
    };
    xmlhttp.open("POST", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    const payload = JSON.stringify({ username });
    xmlhttp.send(payload);
}

// Event-Listener für den Add-Button
document.querySelector(".greybuttonroundaction").addEventListener("click", () => {
    const input = document.getElementById("friend-request-name");
    const username = input.value.trim();
    sendFriendRequest(username);
    input.value = ""; // Inputfeld zurücksetzen
});

// Nutzer laden, sobald die Seite geladen ist
document.addEventListener("DOMContentLoaded", loadUsers);


//ab hier Aufgabe b2
// Funktion, um die Freundesliste zu aktualisieren
function loadFriends() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const data = JSON.parse(xmlhttp.responseText);
            console.log("Daten vom Backend (Freundesliste):", data);

            // Daten analysieren
            const acceptedFriends = data.filter(friend => friend.status === "accepted");
            const friendRequests = data.filter(friend => friend.status === "requested");

            // Freundesliste aktualisieren
            updateFriendList(acceptedFriends);

            // Freundschaftsanfragen aktualisieren
            updateFriendRequests(friendRequests);
        }
    };
    xmlhttp.open("GET", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// Funktion, um Freundschaftsanfragen zu aktualisieren
function updateFriendList(friends) {
    const friendListContainer = document.querySelector(".friendlist ul");
    friendListContainer.innerHTML = ""; // Alte Liste löschen

    friends.forEach(friend => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.classList.add("listitems");
        link.setAttribute("href", `chat.html?friend=${friend.username}`);
        link.textContent = friend.username;
        li.appendChild(link);
        friendListContainer.appendChild(li);
    });

    console.log("Freundesliste aktualisiert:", friends);
}

// Freundschaftsanfragen aktualisieren
function updateFriendRequests(requests) {
    const requestsContainer = document.querySelector("ol");
    requestsContainer.innerHTML = ""; // Alte Anfragen löschen

    requests.forEach(request => {
        const li = document.createElement("li");
        li.classList.add("listitems");
        li.textContent = `Friend Request from ${request.username}`;

        // Buttons für "Accept" und "Reject"
        const acceptButton = document.createElement("button");
        acceptButton.classList.add("acceptbutton");
        acceptButton.textContent = "Accept";
        acceptButton.addEventListener("click", () => handleRequest(request.username, "accepted"));

        const rejectButton = document.createElement("button");
        rejectButton.classList.add("rejectbutton");
        rejectButton.textContent = "Reject";
        rejectButton.addEventListener("click", () => handleRequest(request.username, "rejected"));

        li.appendChild(acceptButton);
        li.appendChild(rejectButton);
        requestsContainer.appendChild(li);
    });

    console.log("Freundschaftsanfragen aktualisiert:", requests);
}

// Event-Listener für den "Accept" und "Reject" Button
function handleRequest(username, action) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 204) {
                alert(`Anfrage ${action === "accepted" ? "angenommen" : "abgelehnt"}!`);
                loadFriends(); // Aktualisiere die Listen nach der Aktion
            } else {
                alert("Fehler beim Verarbeiten der Anfrage.");
            }
        }
    };
    xmlhttp.open("POST", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);

    // JSON-Payload mit `username` und `status` senden
    const payload = JSON.stringify({ username: username, status: action });
    xmlhttp.send(payload);
}




// Starte die periodische Aktualisierung alle 1 Sekunde
window.setInterval(() => {
    loadFriends();
}, 1000);

// Erster Aufruf, um direkt Daten zu laden
loadFriends();


















