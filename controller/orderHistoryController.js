import {order_db} from "../db/db.js";

const loadtTable = () =>{
    $("#order-history-section tbody").html("");
    order_db.map(order => {
        $("#order-history-section tbody").append(`
            <tr>
                <td>${order.id}</td>
                <td> ${order.date} </td>
                <td> ${order.customer} </td>
                <td> <i class="fa-solid fa-circle-info"></i> ${order.items.length}  </td>
                <td> ${order.discount} </td>
                <td> ${order.total} </td>
            </tr>
        `);
    });
};

$("#history-order-btn").on('click', ()=>{
    loadtTable();

})

//table row action
$("#order-history-section tbody").on('click', 'tr', function (){
    let selectedId = $(this).find("td:nth-child(1)").text();
    console.log(selectedId);

    let index = order_db.findIndex(order => order.id === selectedId);
    console.log(index);

    if(index == -1) return;

    let details = "";
    order_db[index].items.map((item) => {
        details += item.id + " - " + item.name + "\n";
    });

    Swal.fire(details);
});