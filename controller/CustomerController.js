/*
import {customerModel} from "../model/customer-model";
// import {customer_db} from ;

$("#customer-save-btn").on('click', () => {
    event.preventDefault();
    console.log("clicked save button");
});

$("#customer-save-btn").on('click', () => {
    event.preventDefault(); // Prevent the default behavior of the button click
    console.log("clicked save button");

    var customerId = $("#cusId").val();
    var customerName = $("#cusName").val();
    var customerAddress = $("#cusAddress").val();
    var customerSalary = $("#cusSalary").val();

    var customer = new customerModel(
        customerId,
        customerName,
        customerAddress,
        customerSalary
    );

    console.log(customer);
});

*/

import {CustomerModel} from "../model/CustomerModel";
import {customer_db} from "../db/db" ;

let row_index=null;

//generateNewID
function generateNewId(lastId) {
    const lastNumber = parseInt(lastId.slice(1), 10);
    const newNumber = lastNumber + 1;
    const newId = "C" + newNumber.toString().padStart(3, "0");
    return newId;
}

$("#cus-reset").on('click', ()=>{
    setTimeout(loadId, 10);
})

const loadId =()=>{
    if (customer_db.length==0){
        $("#cusId").val("C001");
    }
    else{
        $("#cusId").val(generateNewId(customer_db[customer_db.length-1].customer_id));
    }
};

loadId();

const loadCustomerTable = () =>{
    $("customer-tbl-body").html("");
    customer_db.map((customer)=>{
        $("customer-tbl-body").append(<tr><td>${customer.customer_id}</td> <td>${customer.customer_name}</td> <td>{customer.customer_address}</td> ${customer.customer_salary}</tr>);
    });
};

$(".customer").on('click' , ()=> loadCustomerTable());


//save
//validation
function checkValidation(id, name, address, salary){
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
    if(!/^\d+(\.\d{1,2})?$/.test(salary.toString())){ //check salary
        showErrorAlert("Please enter a valid salary");
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



$("#cus-save").on('click',()=>{
    let customer_id = $("#cusId").val(),
    customer_name = $("#cusName").val(),
    customer_address = $("#cusAddress").val(),
    customer_salary = Number.parseFloat($("#cusSalary").val());

    if (!checkValidation(customer_id,customer_name,customer_address,customer_salary)) return;

    let CustomerModel = new CustomerModel(customer_id,customer_name,customer_address,customer_salary);
    customer_db.push(CustomerModel);

    loadCustomerTable();
    $("#cus-reset").click();
    loadId();
    Swal.fire({
        icon: 'success',
        title: 'Customer has been saved',
        showConfirmButton: false,
        timer: 1500
    })
});


//search
$("#customer-tbl-body").on('click', "tr", function(){
    let selectedId = $(this).find("td:nth-child(1)").text();

    $("#cusId").val(selectedId);
    $("#cusName").val($(this).find("td:nth-child(2)").text());
    $("#cusAddress").val($(this).find("td:nth-child(3)").text());
    $("#cusSalary").val(Number.parseFloat($(this).find("td:nth-child(4)").text()));

    row_index = customer_db.findIndex((customerModel => customerModel.customer_id == selectedId));
});


//update
$("#cus-update").on('click', () => {
    let customer_id = $("#cusId").val(),
        customer_name = $("#cusName").val(),
        customer_address = $("#cusAddress").val(),
        customer_salary = Number.parseFloat($("#cusSalary").val());

    if(!checkValidation(customer_id,customer_name,customer_address,customer_salary)) return;

    customer_db[row_index].customer_id = customer_id;
    customer_db[row_index].customer_name = customer_name;
    customer_db[row_index].customer_address = customer_address;
    customer_db[row_index].customer_salary = customer_salary;

    loadCustomerTable();

    $("#cus-reset").click();
    loadId();
    row_index = null;
    Swal.fire({
        icon: 'success',
        title: 'Customer has been updated',
        showConfirmButton: false,
        timer: 1500
    })
});

$("#cus-delete").on('click', () => {
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
            customers.splice(row_index, 1);
            loadCustomerTable();
            $("#cus-reset").click();
            loadId();
            Swal.fire(
                'Deleted!',
                'Customer has been deleted.',
                'success'
            )
        }
    })
});