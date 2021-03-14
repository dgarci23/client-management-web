let newClient = {};
let currentClients = [];

// Event listener for DOM loaded
document.addEventListener("DOMContentLoaded", ()=>{

    getClients().then((data) => {

        currentClients = data.clients;
        while (currentClients.length > 7) {
            currentClients.shift();
        }

        newClient = data.mainClient;

        otherClients();
        
        document.querySelector(".client-information").innerHTML = newClientHTML();

    });

});

async function getClients() {

    const response = await fetch("/user");

    return response.json();

}

// Event listener for new clients
document.getElementById("new-client-btn").addEventListener("click", (e) => {

    getNewClient().then((data) => {

        if (data) {

            if (Object.keys(newClient).length !==0 ) {
                currentClients.push(newClient);
            }
            while (currentClients.length > 7) {
                currentClients.shift();
            }
            
            newClient = data;

            document.querySelector(".client-information").innerHTML = newClientHTML();

            otherClients();

        } else {
            
            showNoClients();
        }
    });

    e.preventDefault();

});

// Get the new clients from the backend
async function getNewClient() {
    let response = await fetch("/new");

    if (response.status !== 404) {
        
        response = await response.json();

    } else {

        return false;
    }

    return response;
}

// This is the HTML code of the new client information
function newClientHTML() {
    return `
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="far fa-clock"></i></button>
        <button disabled="disabled" class="btn button main-client-btn">${newClient.timestamp.substring(0,10)}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="fas fa-phone-alt"></i></button>
        <button disabled="disabled" class="btn button main-client-btn">${newClient.phone}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="far fa-user"></i></button>
        <button disabled="disabled" class="btn button main-client-btn">${newClient.name}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="fas fa-id-card"></i></button>
        <button disabled="disabled" class="btn button main-client-btn">${newClient.doc_id}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="fas fa-loveseat"></i></button>
        <button disabled="disabled" class="btn button main-client-btn">${newClient.type}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="fas fa-building"></i></button>
        <button disabled="disabled" class="btn button main-client-btn">${newClient.branch}</button>
    </div>`;
}

// Pop-up alert when there are no new clients
function showNoClients() {

    const noClientsDiv = document.createElement("div");
    const newClientCard = document.querySelector(".new-client-card");
    const newClientInfo = document.querySelector(".client-information");

    noClientsDiv.className = "alert alert-danger no-clients-alert";

    noClientsDiv.appendChild(document.createTextNode("No hay nuevos clientes disponibles."));
    
    newClientCard.insertBefore(noClientsDiv, newClientInfo);

    setTimeout(clearNoClients, 3000);
}

// Removes the pop-up
function clearNoClients() {

    document.querySelector(".no-clients-alert").remove();

}

// UI functionality for other clients
function otherClients() {

    const otherClientsDiv = document.querySelector(".other-clients");

    otherClientsDiv.innerHTML = "";
    
    currentClients.forEach((client) => {
        
        otherClientsDiv.innerHTML += otherClientsHTML(client);

    });

}

function otherClientsHTML(client) {

    // <button disabled="disabled" class="btn button btn-success"><i class="fas fa-exchange-alt"></i></button>

    return `
    <div class="btn-group container">
        <button disabled="disabled" class="btn button other-client-btn">${client.name}</button>
        <button disabled="disabled" class="btn button other-client-btn">${client.phone}</button>
        <button disabled="disabled" class="btn button other-client-btn">${client.doc_id}</button>
    </div>`;
}