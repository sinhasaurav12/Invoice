let itemCounter = 0;

function addInvoiceItems() {
    itemCounter++; // Increment itemCounter for unique IDs
    const newItemRow = `<tr id="itemRow${itemCounter}">
    <td><input type="text" class="form-control" placeholder="Enter Description" required></td>
    <td><input type="number" class="form-control quantity" placeholder="Quantity" required></td>
    <td><input type="number" class="form-control unitPrice" placeholder="Unit Price" required></td>
    <td><input type="number" class="form-control totalItemPrice" disabled readonly></td>
    <td><button type="button" class="btn btn-danger mt-2" onclick="removeInvoiceItem(${itemCounter})">Remove</button></td></tr>`;

    $("#invoiceItems").append(newItemRow);

    // Update Total Amount
    updatedTotalAmount();
}

function removeInvoiceItem(itemId) {
    $(`#itemRow${itemId}`).remove();
    updatedTotalAmount();
}

function updatedTotalAmount() {
    let totalAmount = 0;
    $("tr[id^='itemRow']").each(function () {
        const quantity = parseFloat($(this).find(".quantity").val()) || 0;
        const unitPrice = parseFloat($(this).find(".unitPrice").val()) || 0;
        const totalItemPrice = quantity * unitPrice;
        $(this).find(".totalItemPrice").val(totalItemPrice.toFixed(2));
        totalAmount += totalItemPrice;
    });
    $("#totalAmount").val(totalAmount.toFixed(2));
}

// Current Date code
$(document).ready(function(){
    let currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0,10);
    $("#invoiceDate").val(formattedDate);
});

$("#invoiceForm").submit(function(event){
    event.preventDefault();
});

// Print Bill Invoice
function printInvoice(){
    const customerName = $("#customerName").val();
    const invoiceDate = $("#invoiceDate").val();
    const items = [];
    $("tr[id^='itemRow']").each(function(){
        const description = $(this).find("td:eq(0) input").val();
        const quantity = $(this).find("td:eq(1) input").val();
        const unitPrice = $(this).find("td:eq(2) input").val();
        const totalItemPrice = $(this).find("td:eq(3) input").val();

        items.push({
            description:description,
            quantity:quantity,
            unitPrice:unitPrice,
            totalItemPrice:totalItemPrice
        });
    });
    const totalAmount = $("#totalAmount").val();
    const invoiceContent = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title>Invoice Slip</title>
        <style>
            body {
                font-family: Arial, Helvetica, sans-serif;
                margin: 20px;
            }
    
            h2 {
                color: #0B5ED7;
            }
    
            th,
            td {
                text-align: left;
            }
        </style>
    </head>
    
    <body>
        <h2>Invoice Slip</h2>
        <p><strong>Customer Name: </strong>${customerName}</p>
        <p><strong>Date: </strong>${invoiceDate}</p>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((item)=> `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice}</td>
                    <td>${item.totalItemPrice}</td>
                </tr>`).join("")}
            </tbody>
        </table>
        <p class="total">Total Amount:${totalAmount}</p>
    </body>
    
    </html>`;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
}
