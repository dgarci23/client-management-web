document.getElementById("new-client-btn").addEventListener("click", (e) => {

    console.log("Clicked");

    let newClient = {};

    getNewClient().then((data) => {
        newClient = data;

        console.log(newClient);
        if (newClient !== undefined) {
            
            document.querySelector(".new-client-card").innerHTML = newClientHTML(newClient) + document.querySelector(".new-client-card").innerHTML;
        }
    });

    e.preventDefault();

});

async function getNewClient() {
    let response = await fetch("/new");

    response = await response.json();

    return response;
}

function newClientHTML(newClient) {
    return `
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="far fa-clock"></i></button>
        <button disabled="disabled" class="btn button">${newClient.timestamp}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="fas fa-phone-alt"></i></button>
        <button disabled="disabled" class="btn button">${newClient.phone}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="far fa-user"></i></button>
        <button disabled="disabled" class="btn button">${newClient.name}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="fas fa-id-card"></i></button>
        <button disabled="disabled" class="btn button">${newClient.doc_id}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="fas fa-loveseat"></i></button>
        <button disabled="disabled" class="btn button">${newClient.type}</button>
    </div>
    <div class="btn-group container">
        <button disabled="disabled" class="btn button"><i class="fas fa-building"></i></button>
        <button disabled="disabled" class="btn button">${newClient.branch}</button>
    </div>`;
}