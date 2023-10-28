export class OrderModel {
    constructor(orderId, orderDate, orderCustomer, orderItems, orderDiscount, orderTotal) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.orderCustomer = orderCustomer;
        this.items = orderItems;
        this.orderDiscount = orderDiscount;
        this.orderTotal = orderTotal;
    }
}
