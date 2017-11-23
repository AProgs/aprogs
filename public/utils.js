

function insertRowInTable(name) {
    var table = document.getElementById("myTable");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
}

function myFunction() {
    var table = document.getElementById("myTable");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = "NEW CELL1";
    //  cell2.innerHTML = "NEW CELL2";

    var tableSlave = document.createElement("TABLE");
    tableSlave.className = "myTableShort";
    var rowSlave = tableSlave.insertRow(0);
    var cell1Slave = rowSlave.insertCell(0);
    var cell2Slave = rowSlave.insertCell(1);
    var cell3Slave = rowSlave.insertCell(2);
    cell1Slave.innerHTML = "NEW CELL1te0";
    cell2Slave.innerHTML = "NEW CELL2ti0";
    cell2Slave.innerHTML = "NEW CELL3tu0";

    rowSlave = tableSlave.insertRow(1);
    cell1Slave = rowSlave.insertCell(0);
    cell2Slave = rowSlave.insertCell(1);
    cell3Slave = rowSlave.insertCell(2);
    cell1Slave.innerHTML = "NEW CELL1te1";
    cell2Slave.innerHTML = "NEW CELL2ti1";
    cell2Slave.innerHTML = "NEW CELL3tu1";
    cell2.style.width = "60%";

    cell2.appendChild(tableSlave);

    var removeRow = document.createElement("BUTTON");
    var name = document.createTextNode("Delete");
    removeRow.appendChild(name);
    removeRow.title = "Delete";
    //	removeRow.onclick="";
    removeRow.className = "btn btn-warning";
    removeRow.addEventListener('click', function() {
        removeElement(row.rowIndex);
    });
    cell3.appendChild(removeRow);

}

function mongodbFind(){
var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017);
var mongoClient = new mongodb.MongoClient(server);
mongoClient.open(function(err, client){
 var db = client.db('alexafpws');
//queries over the db
});
}

function removeElement(elementNunmber) {
    document.getElementById("myTable").deleteRow(elementNunmber);
}
