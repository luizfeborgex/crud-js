'use strict';

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];

const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient));

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
};

const readClient = () => getLocalStorage();

const updateClient = (index, client) => {
    const dbClient = getLocalStorage()
    dbClient[index] = client
    setLocalStorage(dbClient)
};

const deleteClient = (index) => {
    const dbClient = getLocalStorage()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
};

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
};

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            name: document.getElementById('input-name').value,
            email: document.getElementById('input-email').value,
            city: document.getElementById('input-city').value,
            cpf: document.getElementById('input-cpf').value,
            telephone: document.getElementById('input-telephone').value
        }
        const index = document.getElementById('input-name').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
        } else {
            updateClient(index, client)
            updateTable()
        }
    }
};

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${index}</td>
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.city}</td>
        <td>${client.cpf}</td>
        <td>${client.telephone}</td>
        <td>
            <button type="button" class="button-edit" id="edit-${index}">Editar</button>
            <button type="button" class="button-delete" id="delete-${index}">Excliur</button>
        </td>
    `
    document.querySelector('#tb-client>tbody').appendChild(newRow)
};

const clearTable = () => {
    const rows =  document.querySelectorAll('#tb-client>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
};

const updateTable = () => {
    const dbClient = getLocalStorage()
    clearTable()
    dbClient.forEach(createRow)
};

const fillFields = (client) => {
    document.getElementById('input-name').value = client.name
    document.getElementById('input-email').value = client.email
    document.getElementById('input-cpf').value = client.cpf
    document.getElementById('input-city').value = client.city
    document.getElementById('input-telephone').value = client.telephone
    document.getElementById('input-name').dataset.index = client.index
};

const editClient = (index) => {
    const client = getLocalStorage()[index]
    client.index = index
    fillFields(client)
    openModal()
};

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')
        if (action == 'edit') {
            editClient(index)
        } else {
            const client = getLocalStorage()[index]
            const response = confirm(`Deseja realmente excluir o cliente (${client.name})?`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
};

updateTable()

const clearFiels = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
};

document.getElementById('input-cpf').addEventListener('input', (e) => {
    var value = e.target.value
    var cpfPattern = value.replace(/\D/g, '') 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d)/, '$1.$2') 
    .replace(/(\d{3})(\d)/, '$1-$2') 
    .replace(/(-\d{2})\d+?$/, '$1');
    e.target.value = cpfPattern
});

document.getElementById('input-telephone').addEventListener('input', (e) => {
    var value = e.target.value
    var telephonePattern = value.replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1')
    e.target.value = telephonePattern
});

const searchClients = () => {
    if (filterClients.value != '') {
        clearTable()
        const dbClient = getLocalStorage()
        dbClient.forEach((client, index) => {
            const nameClient = client.name.toLowerCase()
            const filterClient = filterClients.value.toLowerCase()
            if (nameClient.includes(filterClient)) {
                createRow(client, index)
            }
          })
    } else {
        updateTable()
    }
};

const openModal = () => document.querySelector('.modal').classList.add('active');
const closeModal = () => {
    clearFiels()
    document.querySelector('.modal').classList.remove('active');
};
const filterClients = document.getElementById('filter-client');
filterClients.addEventListener('input', searchClients);

document.getElementById('button-register').addEventListener('click', openModal);
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('register-client').addEventListener('click', saveClient);
document.getElementById('cancel-button').addEventListener('click', clearFiels); 
document.querySelector('#tb-client>tbody').addEventListener('click', editDelete);