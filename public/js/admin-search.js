// Load event listener for typing on the search bar
const table = document.getElementById("table-body");
document.getElementById("search").addEventListener("keyup", (e)=>{
    if (e.target.value.length > 3) {
        console.log("Ees");
        getClients(e.target.value).then((clients)=>{

            clients = clients.clients;

            table.innerHTML = "";

            clients.forEach((client)=>{

                uiAddClient(client);

            });

        });
    }

})

// Async function to get clients from the database
async function getClients(criteria) {

    const response = await fetch("/admin/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({criteria: criteria}),
        credentials: "include"
    });

    return await response.json();

}

// UI function to add client
function uiAddClient(client) {

    table.innerHTML += `
        <tr>
            <th>${client.name}</th>
            <th>${client.phone}</th>
            <th>${client.doc_id}</th>
            <th>${client.user}</th>
        </tr>    
    `;

    

}