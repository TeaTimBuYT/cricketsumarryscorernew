// JavaScript code

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("matchForm");
    const display = document.getElementById("display");
    const loginForm = document.getElementById("loginForm");
    const content = document.getElementById("content");
    const viewResults = document.getElementById("viewResults");
    const matchesList = document.getElementById("matchesList");
    const viewWithoutLogin = document.getElementById("viewWithoutLogin");
    const backButton = document.getElementById("backButton");
    const backButtonAdmin = document.getElementById("backButtonAdmin");
    const summaryPage = document.getElementById("summaryPage");
    const backToResultsButton = document.getElementById("backToResultsButton");

    const correctPassword = "cricket2024"; // Predefined password

    // Open or create the database
    const request = indexedDB.open("CricketDB", 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore("matches", { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        fetchMatches(db);
    };

    request.onerror = function (event) {
        console.error("Database error:", event.target.errorCode);
    };

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const passwordInput = document.getElementById("passwordInput").value;
        if (passwordInput === correctPassword) {
            loginForm.style.display = "none";
            content.style.display = "block";
        } else {
            alert("Incorrect password");
        }
    });

    viewWithoutLogin.addEventListener("click", function () {
        loginForm.style.display = "none";
        viewResults.style.display = "block";
    });

    backButton.addEventListener("click", function () {
        viewResults.style.display = "none";
        loginForm.style.display = "block";
    });

    backButtonAdmin.addEventListener("click", function () {
        content.style.display = "none";
        loginForm.style.display = "block";
    });

    backToResultsButton.addEventListener("click", function () {
        summaryPage.style.display = "none";
        viewResults.style.display = "block";
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const matchPhoto = document.getElementById("matchPhoto").files[0];
        const matchSummary = document.getElementById("matchSummary").value;
        const captainsRemarks = document.getElementById("captainsRemarks").value;
        const awards = document.getElementById("awards").value;

        if (matchPhoto) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
                const match = {
                    photo: imageUrl,
                    summary: matchSummary,
                    remarks: captainsRemarks,
                    awards: awards
                };
                saveMatch(match);
                form.reset();
                alert("Match details added successfully");
            };
            reader.readAsDataURL(matchPhoto);
        } else {
            const match = {
                photo: null,
                summary: matchSummary,
                remarks: captainsRemarks,
                awards: awards
            };
            saveMatch(match);
            form.reset();
            alert("Match details added successfully");
        }
    });

    function fetchMatches(db) {
        const transaction = db.transaction(["matches"], "readonly");
        const objectStore = transaction.objectStore("matches");
        const request = objectStore.getAll();

        request.onsuccess = function (event) {
            const matches = event.target.result;
            updateMatchesList(matches);
        };
    }

    function saveMatch(match) {
        const request = indexedDB.open("CricketDB", 1);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(["matches"], "readwrite");
            const objectStore = transaction.objectStore("matches");
            objectStore.add(match);

            transaction.oncomplete = function () {
                fetchMatches(db);
            };
        };
    }

    function updateMatchesList(matches) {
        matchesList.innerHTML = '';
        matches.forEach((match, index) => {
            const matchItem = document.createElement('div');
            matchItem.textContent = `Match ${index + 1}`;
            matchItem.addEventListener('click', () => displayMatchDetails(match));
            matchesList.appendChild(matchItem);
        });
        if (matches.length > 0) {
            viewResults.style.display = 'block';
        } else {
            viewResults.style.display = 'none';
        }
    }

    function displayMatchDetails(match) {
        summaryPage.style.display = "block";
        viewResults.style.display = "none";
        if (match.photo) {
            display.innerHTML = `
                <div class="match-photo">
                    <img src="${match.photo}" alt="Match Photo">
                </div>
                <div class="match-summary">
                    <h2>Match Summary</h2>
                    <p>${match.summary}</p>
                </div>
                <div class="captains-remarks">
                    <h2>Captain's Remarks</h2>
                    <p>${match.remarks}</p>
                </div>
                <div class="awards">
                    <h2>Awards of the Match</h2>
                    <p>${match.awards}</p>
                </div>
            `;
        } else {
            display.innerHTML = `
                <div class="match-summary">
                    <h2>Match Summary</h2>
                    <p>${match.summary}</p>
                </div>
                <div class="captains-remarks">
                    <h2>Captain's Remarks</h2>
                    <p>${match.remarks}</p>
                </div>
                <div class="awards">
                    <h2>Awards of the Match</h2>
                    <p>${match.awards}</p>
                </div>
            `;
        }
    }
});