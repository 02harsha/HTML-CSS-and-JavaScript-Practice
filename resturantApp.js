
const menus = [
    { itemId: 1, name: 'biriyani', price: '250' },
    { itemId: 2, name: 'panner', price: '150' },
    { itemId: 3, name: 'chicken Curry', price: '200' }
];

const tables = [
    { tableId: 1, itemsOrdered: 0, totalPrice: 0, items: {} },
    { tableId: 2, itemsOrdered: 0, totalPrice: 0, items: {} },
    { tableId: 3, itemsOrdered: 0, totalPrice: 0, items: {} }
];

document.addEventListener('DOMContentLoaded', () => {
    displayTables();
    displayMenu();
});

const displayTables = () => {
    let tableColumn = document.querySelector('.table-section');
    tables.forEach((table) => {
        let eachTable = document.createElement('div');
        eachTable.className = `table-card-${table.tableId}`;
        eachTable.dataset.tableId = table.tableId;  // Store tableId in dataset
        eachTable.draggable = true;
        eachTable.innerHTML = `
            <h2>Table ${table.tableId}</h2>
            <p>Items Ordered: ${table.itemsOrdered}</p>
            <p>Total price: ${table.totalPrice}</p>`;
        tableColumn.append(eachTable);
        eachTable.addEventListener('dragover', dragOver);
        eachTable.addEventListener('drop', drop);
        eachTable.addEventListener('click',()=>{
            displayItems(eachTable.dataset.tableId)   
        })
        
    });
    
};

const displayMenu = () => {
    let menuColumn = document.querySelector('.menu-section');
    menus.forEach((menu, index) => {
        let eachMenu = document.createElement('div');
        eachMenu.id = `menu-item-${index}`;  // Assigning unique IDs to menu items
        eachMenu.dataset.name = menu.name;
        eachMenu.dataset.price = menu.price;
        eachMenu.className = 'menu-card';
        eachMenu.draggable = true;
        eachMenu.innerHTML = `
            <h2>${menu.name}</h2>
            <p>Price: ${menu.price}</p>`;
        menuColumn.append(eachMenu);
        eachMenu.addEventListener('dragstart', dragStart);
    });
};

function dragStart(event) {
    event.dataTransfer.setData('text/plain', `#${event.target.id}`);
    console.log('dragged');
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    console.log('dropped');
    event.preventDefault();
    
    const itemId = event.dataTransfer.getData('text/plain');
    const itemElement = document.querySelector(itemId);

    if (!itemElement) return;

    const itemName = itemElement.dataset.name;
    const itemPrice = parseInt(itemElement.dataset.price);
    
    // Look for the closest parent div whose class starts with 'table-card-'
    const tableDiv = event.target.closest('div');
    const tableId = tableDiv && tableDiv.className.match(/table-card-(\d+)/)[1];  // Extract the tableId

    if (itemName && itemPrice && tables.find((t) => t.tableId == tableId)) {
        addItemToTable(tableId, itemName, itemPrice);
    }
}

function addItemToTable(tableId, itemName, itemPrice) {
    const table = tables.find((t) => t.tableId == tableId);
    if (!table.items[itemName]) {
        table.items[itemName] = { quantity: 1, price: itemPrice };
    } else {
        table.items[itemName].quantity += 1;
    }
    table.itemsOrdered += 1;
    table.totalPrice += itemPrice;
    
    // Update the table UI
    const tableElement = document.querySelector(`.table-card-${tableId}`);
    tableElement.innerHTML = `
        <h2>Table ${table.tableId}</h2>
        <p>Items Ordered: ${table.itemsOrdered}</p>
        <p>Total price: ${table.totalPrice}</p>`;
}

function displayItems(id) {
    document.querySelector('.order-modal').style.display = 'block';

    let modal = document.querySelector('tbody');
    
    // Clear the previous content
    modal.innerHTML = '';

    let res = tables.find((ele) => ele.tableId == id);
    let item_list = Object.keys(res.items);
    
    if (item_list.length > 0) {
        item_list.forEach((item) => {
            let row = document.createElement('tr');

            // Item name
            let itemName = document.createElement('td');
            itemName.textContent = item;

            // Item price
            let itemPrice = document.createElement('td');
            itemPrice.textContent = res.items[item].price;

            // Item quantity
            let itemQuantity = document.createElement('td');
            itemQuantity.textContent = res.items[item].quantity;

            //Remove Item
            let removeBtn=document.createElement('button')
            removeBtn.innerText='remove'
            let removeItem=document.createElement('td')
            removeItem.append(removeBtn)
            removeBtn.addEventListener('click',()=>{removeItemFromTable(id,item);displayItems(id)})

            row.appendChild(itemName);
            row.appendChild(itemPrice);
            row.appendChild(itemQuantity);
            row.append(removeItem)
            modal.appendChild(row);
        });
    } else {
        // If no items are ordered, display a message
        let row = document.createElement('tr');
        let noItemsCell = document.createElement('td');
        noItemsCell.colSpan = 4;
        noItemsCell.textContent = "No items ordered.";
        row.appendChild(noItemsCell);
        modal.appendChild(row);
    }
}

function closePopup() {
    document.querySelector('.order-modal').style.display = 'none';
}

function removeItemFromTable(tableId, itemName) {
    const table = tables.find((t) => t.tableId == tableId);
    
    if (table.items[itemName]) {
        // Decrease the quantity or remove the item if the quantity is 1
        if (table.items[itemName].quantity > 1) {
            table.items[itemName].quantity -= 1;
        } else {
            delete table.items[itemName];
        }

        // Update the items ordered and total price
        table.itemsOrdered -= 1;
        table.totalPrice -= table.items[itemName].price;

        // Update the table UI
        const tableElement = document.querySelector(`.table-card-${tableId}`);
        tableElement.innerHTML = `
            <h2>Table ${table.tableId}</h2>
            <p>Items Ordered: ${table.itemsOrdered}</p>
            <p>Total price: ${table.totalPrice}</p>`;
    }
}

function searchTable() {
    let tableName = document.getElementById('tableNumber').value.toLowerCase();
    
    const tableColumn = document.querySelector('.table-section');
    
    // Clear the current table display
    tableColumn.innerHTML = '';

    tables.forEach((table) => {
        if (`table ${table.tableId}`.toLowerCase().includes(tableName)) {
            let eachTable = document.createElement('div');
            eachTable.className = `table-card-${table.tableId}`;
            eachTable.dataset.tableId = table.tableId;
            eachTable.draggable = true;
            eachTable.innerHTML = `
                <h2>Table ${table.tableId}</h2>
                <p>Items Ordered: ${table.itemsOrdered}</p>
                <p>Total price: ${table.totalPrice}</p>`;
            tableColumn.append(eachTable);
            eachTable.addEventListener('dragover', dragOver);
            eachTable.addEventListener('drop', drop);
            eachTable.addEventListener('click', () => {
                displayItems(eachTable.dataset.tableId);
            });
        }
    });
}
