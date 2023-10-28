import {Item} from "../model/ItemModel";
import {customer_db, item_db} from "../db/db";

let row_index = null;
const loadId = () =>{
    if(item_db.length == 0){
        $("#itemId").val("I001");
    }else{
        $("#itemId").val(generateNewId(item_db[item_db.length - 1].item_id));
    }
};

loadId();
const loadItemTable = () => {
    $("#itemTable").html("");
    item_db.map((item) => {
        $("#itemTable").append(`<tr><td>${item.item_id}</td><td>${item.item_name}</td><td>${item.item_price}</td><td>${item.item_qty}</td></tr>`);
    });
};

$(".item").on('click', ()=> loadItemTable());

//save
$("#item-save").on('click', () => {
    let id = $("#itemId").val(),
        name = $("#itemName").val(),
        price = Number.parseFloat($("#itemPrice").val()),
        qty = Number.parseInt($("#itemQty").val());

    if(!checkValidation(id, name, price, qty)) return;

    let item = new Item(id, name, price, qty);
    item_db.push(item);

    loadItemTable();
    $("#item-reset").click();
    loadId();
    Swal.fire({
        icon: 'success',
        title: 'Item has been saved',
        showConfirmButton: false,
        timer: 1500
    })
});

//search
$("#itemTable").on('click', "tr", function(){
    let selectedId = $(this).find("td:nth-child(1)").text();

    $("#itemId").val( selectedId );
    $("#itemName").val( $(this).find("td:nth-child(2)").text() );
    $("#itemPrice").val( Number.parseFloat($(this).find("td:nth-child(3)").text() ) );
    $("#itemQty").val( Number.parseInt( $(this).find("td:nth-child(4)").text() ) );

    row_index = item_db.findIndex((item => item.item_id == selectedId));
});

//update
$("#item-update").on('click', () => {
    let id = $("#itemId").val(),
        name = $("#itemName").val(),
        price = Number.parseFloat($("#itemPrice").val()),
        qty = Number.parseInt($("#itemQty").val());

    if(!checkValidation(id, name, price, qty)) return;

    item_db[row_index].item_id = id;
    item_db[row_index].item_name = name;
    item_db[row_index].item_price = price;
    item_db[row_index].item_qty = qty;

    loadItemTable();
    $("#item-reset").click();
    row_index = null;
    loadId();
    Swal.fire({
        icon: 'success',
        title: 'Item has been updated',
        showConfirmButton: false,
        timer: 1500
    })
});

//remove
$("#item-delete").on('click', () => {
    if (row_index == null) return;
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            item_db.splice(row_index, 1);
            loadItemTable();
            $("#item-reset").click();
            loadId();
            Swal.fire(
                'Deleted!',
                'Item has been deleted.',
                'success'
            )
        }
    })
});

//validation
function checkValidation(id, name, price, qty){
    console.log(id);
    if(!/^I\d{3}$/.test(id)){ //chekc ID
        showErrorAlert("Please enter a valid ID!")
        return false;
    }
    if(!name){ //check name
        showErrorAlert("Please enter a name!");
        return false;
    }
    if(!/^\d+(\.\d{1,2})?$/.test(price.toString())){ //check address
        showErrorAlert("Please enter a price for item!");
        return false;
    }
    if(!qty || qty == 0){ //check salary
        showErrorAlert("Please enter a quantity");
        return false;
    }
    return true;
}

//showErrorAlert
function showErrorAlert(message){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}

//generateNewID
function generateNewId(lastId) {
    const lastNumber = parseInt(lastId.slice(1), 10);
    const newNumber = lastNumber + 1;
    const newId = "I" + newNumber.toString().padStart(3, "0");
    return newId;
}

$("#item-reset").on('click', ()=>{
    setTimeout(loadId, 10);
})