import {CustomerModel} from "../model/CustomerModel.js";
import {customer_db} from "../db/db.js";

var row_index = null;

const loadId = () =>{
    if (customer_db.length == 0){
        $("#cusId").val("C001");
    }else{
        $("#cusId").val(generateNewId(customer_db[customer_db.length - 1].id));
    }
};

loadId();

const loadCustomerData = () => {
    $('#cusTable').html(""); // make tbody empty
    customer_db.map((customer) => {
        $("#cusTable").append(`<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.contact}</td></tr>`);
    });
};



$(".customer").on('click', ()=> loadCustomerData());

// submit
$("#save").on('click', () => {
    console.log("ABC")
    let id = $("#cusId").val(),
        name = $("#cusName").val(),
        address = $("#cusAddress").val(),
        contact = $("#cusContact").val();

    if(!checkValidation(id, name, address, contact)) return;

    let customer = new CustomerModel(id, name, address, contact);
    customer_db.push(customer);

    loadCustomerData();
    $("#reset").click();
    loadId();
    Swal.fire({
        icon: 'success',
        title: 'Customer has been saved',
        showConfirmButton: false,
        timer: 1500
    })
});

//search
$("#cusTable").on('click', "tr", function(){
    let selectedId = $(this).find("td:nth-child(1)").text();

    $("#cusId").val(selectedId);
    $("#cusName").val($(this).find("td:nth-child(2)").text());
    $("#cusAddress").val($(this).find("td:nth-child(3)").text());
    $("#cusContact").val($(this).find("td:nth-child(4)").text());

    row_index = customer_db.findIndex((customer => customer.id == selectedId));
});

// update
$("#update").on('click', () => {
    let id = $("#cusId").val(),
        name = $("#cusName").val(),
        address = $("#cusAddress").val(),
        contact = $("#cusContact").val();

    if(!checkValidation(id, name, address, contact)) return;

    customer_db[row_index].id = id;
    customer_db[row_index].name = name;
    customer_db[row_index].address = address;
    customer_db[row_index].salary = contact;

    loadCustomerData();

    $("#reset").click();
    loadId();
    row_index = null;
    Swal.fire({
        icon: 'success',
        title: 'Customer has been updated',
        showConfirmButton: false,
        timer: 1500
    })
});

// delete
$("#delete").on('click', () => {
    if (row_index == null) return;
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete customer!'
    }).then((result) => {
        if (result.isConfirmed) {
            customer_db.splice(row_index, 1);
            loadCustomerData();
            $("#reset").click();
            loadId();
            Swal.fire(
                'Deleted!',
                'Customer has been deleted.',
                'success'
            )
        }
    })
});

//validation
function checkValidation(id, name, address, contact){
    console.log(id);
    if(!/^C\d{3}$/.test(id)){ //chekc ID
        showErrorAlert("Please enter a valid ID!")
        return false;
    }
    if(!name){ //check name
        showErrorAlert("Please enter a valid name!");
        return false;
    }
    if(!address){ //check address
        showErrorAlert("Please enter a valid address!");
        return false;
    }
    if(!contact){ //check address
        showErrorAlert("Please enter a valid Contact!");
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
    const newId = "C" + newNumber.toString().padStart(3, "0");
    return newId;
}

$("#reset").on('click', ()=>{
    setTimeout(loadId, 10);
})
