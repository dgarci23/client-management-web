document.querySelector(".user-list").addEventListener("click", (e) => {addUserClients(e)});

// Event listener function when clicking for user information
function addUserClients(e) {

    if (e.target.classList.contains("user-button")) {
        const username = e.target.textContent;

        getUserInfo(username).then((data) => {
            
            const clients = data.clients;

            const clientsContainer = document.querySelector(".clients-container");
            clientsContainer.innerHTML = "";

            clients.forEach((client) => {uiAddClient(client)});

            document.querySelectorAll(".user-button").forEach((button)=>{
                button.style.backgroundColor = "#EF4F4F";
            });
            e.target.style.backgroundColor = "#0AAB9B";
        });
    }    
}

// Gets the clients from the backend
async function getUserInfo(username) {

    const response = await fetch(`/user/${username}`);

    return response.json();

}

// UI function for adding a client
function uiAddClient(client) {

    const clientsContainer = document.querySelector(".clients-container");

    clientsContainer.innerHTML += otherClientsHTML(client);

}

// HTML for client element
function otherClientsHTML(client) {


    return `
    <div class="btn-group container client">
        <button disabled="disabled" class="btn button other-client-btn">${client.name}</button>
        <button disabled="disabled" class="btn button other-client-btn">${client.phone}</button>
        <button disabled="disabled" class="btn button other-client-btn">${client.doc_id}</button>
    </div>`;
}