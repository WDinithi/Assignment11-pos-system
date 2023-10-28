import {OrderModel} from "../model/orderModel";
import {customer_db} from "../db/db";
import {item_db} from "../db/db";
import {order_db} from "../db/db";
import {Item} from "../model/ItemModel";

let cusRowIndex = null;
let itemRowIndex = null;
let total = 0;
let subTotal = 0;
let tempItems = [];
let addedItems = [];

const loadAddItemTable = ()=>{
    $("#orderedItemTBody").html("");
    addedItems.map((item) => {
        $("#orderedItemTBody").append(`
                    <tr>
                        <td> ${item.item_id} </td>
                        <td> ${item.item_name} </td>
                        <td> ${item.item_price} </td>
                        <td> ${item.item_qty} </td>
                        <td> ${item.item_price * item.item_qty} </td>
                    </tr>
    `   );
    })
}

const loadIdDate = () =>{
    if(customer_db.length == 0){
        $("#orderId").val("OD001");
    }else{
        $("#orderId").val(generateNewId(order_db[order_db.length - 1].orderId));
    }

    $("#date").val(new Date().toLocaleDateString('en-GB'));
};
loadIdDate();

//loadCustomers
$(".order").on('click', ()=>{
    $("#orderCusId").html("");
    customers.map((customer) => {
        $('#orderCusId').append($('<option>', {
            value: customer.customer_id,
            text: customer.customer_id
        }));
    });
    $("#orderCusId").val("");
});

//setCustomerDetails
$("#customerSelector").on('click','select', function (){
    cusRowIndex = customer_db.findIndex(customer => customer.customer_id === $(this).val());
    if(cusRowIndex == -1) return;
    $("#orderCusName").val( customer_db[cusRowIndex].customer_name );
    $("#orderCusAddress").val( customer_db[cusRowIndex].customer_address );
    $("#orderCusSalary").val( customer_db[cusRowIndex].customer_salary );

});

//loadItems
$(".order").on('click', ()=> {
    $("#orderItemId").html("");
    items.map((item) => {
        $('#orderItemId').append($('<option>', {
            value: item.id,
            text: item.id
        }));
    });
    $("#orderItemId").val("");
});

//setItemDetails
$("#itemSelector").on('click','select', function (){
    itemRowIndex = item_db.findIndex(item => item.item_id === $(this).val());
    if(itemRowIndex == -1) return;
    $("#orderItemName").val( item_db[itemRowIndex].item_name );
    $("#orderItemPrice").val( item_db[itemRowIndex].item_price );
    $("#qty-on-hand").val( item_db[itemRowIndex].item_qty );
});

//add-item action
$("#add-item-btn").on('click', ()=>{
    let id = $("#orderItemId").val(),
        name = $("#orderItemName").val(),
        price = Number.parseFloat($("#orderItemPrice").val()),
        qty = Number.parseInt($("#orderItemQty").val()),
        itemTotal = price * qty;

    if(qty > item_db[itemRowIndex].item_qty || !qty) {
        showErrorAlert("Please enter a valid qty..Need to be lower than or equal to qty on hand");
        return;
    }

    let existingItem = addedItems.findIndex(item => item.item_id === id);
    console.log("index : " + existingItem);

    if(existingItem < 0){
        addedItems.push(new Item(id, name, price, qty, itemTotal));
    }else {
        addedItems[existingItem].qty += qty;
    }
    loadAddItemTable();

    tempItems.push(item_db[itemRowIndex]);
    item_db[itemRowIndex].item_qty -= qty;
    $("#qty-on-hand").val( item_db[itemRowIndex].item_qty );

    subTotal += itemTotal;
    $("#subTotal").text(`Sub Total: Rs. ${subTotal}`);
});

//show balance
$("#cash").on('input', ()=>{
    console.log(Number.parseFloat($("#cash").val()));
    console.log(Number.parseFloat($("#subTotal").text().slice(15)));
    $("#balance").val(Number.parseFloat($("#cash").val()) - Number.parseFloat($("#subTotal").text().slice(15)));
})

//save order
$("#order-btn").on('click', ()=>{
    console.log("ordered");

    let orderId = $("#orderId").val(),
        date = $("#date").val(),
        customer = $("#orderCusId").val(),
        items = addedItems,
        total = Number.parseFloat($("#subTotal").text().slice(15)),
        discount = Number.parseFloat($("#discount").val());

    if(checkValidation(orderId, date, customer, items, total, discount)){
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Place Order!'
        }).then((result) => {
            if (result.isConfirmed) {

                let order = new Order(orderId, date, customer, items, discount, total);
                orders.push(order);

                console.log(order);

                $("balance").val(Number.parseFloat($("#cash").val()) - total);

                $("#order-section form").trigger('reset');
                $("select").val("");
                loadIdDate();
                addedItems = [];
                loadAddItemTable();
                Swal.fire(
                    `Rs: ${total}`,
                    'The Order has been placed!',
                    'success'
                )
            }
        })
    }
});

//cancel order
$("#cancel-order-btn").on('click', ()=>{
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Cancel the order!'
    }).then((result) => {
        if (result.isConfirmed) {

            addedItems.map((addedItem) =>{
                let i = item_db.findIndex(item => item.item_id === addedItem.item_id);
                item_db[i].qty += addedItem.qty;
            });

            $("#order-section form").trigger('reset');
            $("select").val("");;
            $("#subTotal").text('Sub Total: Rs. 0000.00');
            addedItems = [];
            loadAddItemTable();

            Swal.fire(
                `Canceled`,
                'The Order has been canceled!',
                'success'
            )
        }
    })
})

//check validations
function checkValidation(orderId, date, customer, items, total, discount) {
    if(!customer){
        showErrorAlert("Please select a customer to place order");
        return false;
    }
    if(item_db.length == 0){
        showErrorAlert("Please select a item/items to place order");
        return false;
    }
    if(!$("#cash").val()){
        showErrorAlert("Please enter the cash amount");
        return false;
    }
    if((Number.parseFloat($("#cash").val()) - total) < 0){
        showErrorAlert("The cash is not enough to pay the order!!!");
        return false;
    }
    return true;
}

//generateNewID
function generateNewId(lastId) {
    const lastNumber = parseInt(lastId.slice(2), 10);
    const newNumber = lastNumber + 1;
    const newId = "OD" + newNumber.toString().padStart(3, "0");
    return newId;
}

//showErrorAlert
function showErrorAlert(message){
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
    });
}