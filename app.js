const userArr = [];
let id_counter = 1;

function addUser() {
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;

    if (!name || !email) {
        alert('Please fill in all fields!');
        return;
    }

    if (!email.includes('@')) {
        alert('Please enter a valid email!');
        return;
    }

    const newUser = {
        id: id_counter++,
        name: name,
        email: email,
        role: role,
        isActive: true
    };

    userArr.push(newUser);
    saveToStorage();

    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';

    showAll();
    alert(`User ${name} added successfully!`);
}

const showAll = () => {
    displayUsers(userArr);
};

function displayUsers(arr) {
    const container = document.getElementById('usersContainer');

    if (arr.length === 0) {
        container.innerHTML = '<p>No users found.</p>';
        return;
    }

    const userHTML = arr.map(user => {
        return `
            <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
                <p><strong>ID:</strong> ${user.id}</p>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.role}</p>
                <p><strong>Status:</strong> ${user.isActive ? 'Active' : 'Inactive'}</p>
                <button onclick="toggleStatus(${user.id})">
                    ${user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onclick="removeUser(${user.id})">Delete</button>
            </div>
        `;
    }).join('');

    container.innerHTML = userHTML;
}

function toggleStatus(userId) {
    const user = userArr.find(u => u.id === userId);

    if (user) {
        user.isActive = !user.isActive;
        saveToStorage();
        showAll();
    } else {
        alert('User not found!');
    }
}

function removeUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const index = userArr.findIndex(u => u.id === userId);
        
        if (index !== -1) {
            userArr.splice(index, 1);
            saveToStorage();
            showAll();
            alert('User deleted successfully!');
        }
    }
}

const showActiveOnly = () => {
    const activeUsers = [...userArr].filter(user => user.isActive === true);
    displayUsers(activeUsers);
};

function filterByRole() {
    const filterSection = document.getElementById('filterSection');
    filterSection.style.display = filterSection.style.display === 'none' ? 'block' : 'none';
}

function applyFilter() {
    const selectedRole = document.getElementById('roleFilter').value;
    const filtered = userArr.filter(user => user.role === selectedRole);
    displayUsers(filtered);
}

function getUser(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = userArr.find(u => u.id === userId);
            
            if (user) {
                resolve(user);
            } else {
                reject(new Error(`User with ID ${userId} not found`));
            }
        }, 1000);
    });
}

function testAsyncFetch() {
    if (userArr.length === 0) {
        alert('Please add some users first!');
        return;
    }

    console.log('Fetching user...');
    
    getUser(1)
        .then(user => {
            console.log('Success! User found:', user);
            alert(`Found user: ${user.name}`);
        })
        .catch(error => {
            console.error('Error:', error.message);
            alert('Error: ' + error.message);
        })
        .finally(() => {
            console.log('Fetch operation completed');
        });
}

async function testAsync() {
    if (userArr.length === 0) {
        alert('Please add some users first!');
        return;
    }

    try {
        console.log('Fetching user with async/await...');
        const user = await getUser(1);
        console.log('Success! User found:', user);
        alert(`Found user: ${user.name}`);
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error: ' + error.message);
    } finally {
        console.log('Async/await operation completed');
    }
}

function runEventLoop() {
    const output = document.getElementById('eventLoopOutput');
    let log = '';

    const addLog = (message) => {
        log += message + '\n';
        output.textContent = log;
    };

    addLog('=== Event Loop Demonstration ===\n');

    addLog('1. Synchronous: Start');

    setTimeout(() => {
        addLog('4. setTimeout: Executed after 0ms (callback queue)');
    }, 0);

    Promise.resolve().then(() => {
        addLog('3. Promise: Resolved (microtask queue)');
    });

    addLog('2. Synchronous: End');

    addLog('\n/* EXECUTION ORDER EXPLANATION:');
    addLog('1. Synchronous code runs first (call stack)');
    addLog('2. Promises are microtasks - run after call stack, before setTimeout');
    addLog('3. setTimeout callbacks are macrotasks - run last');
    addLog('Order: Synchronous → Microtasks (Promises) → Macrotasks (setTimeout) */');
}

function saveToStorage() {
    try {
        localStorage.setItem('users', JSON.stringify(userArr));
        localStorage.setItem('userIdCounter', id_counter.toString());
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromStorage() {
    try {
        const savedUsers = localStorage.getItem('users');
        const savedCounter = localStorage.getItem('userIdCounter');

        if (savedUsers) {
            const parsedUsers = JSON.parse(savedUsers);
            userArr.push(...parsedUsers);
        }

        if (savedCounter) {
            id_counter = parseInt(savedCounter);
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function searchUsers() {
    const searchSection = document.getElementById('searchSection');
    searchSection.style.display = searchSection.style.display === 'none' ? 'block' : 'none';
}

function doSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    if (!searchTerm) {
        showAll();
        return;
    }

    const searchResults = userArr.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );

    displayUsers(searchResults);
}

function showArrayMethods() {
    console.log('=== Array Methods Demonstration ===');

    const userNames = userArr.map(user => user.name);
    console.log('MAP - All user names:', userNames);

    const adminUsers = userArr.filter(user => user.role === 'admin');
    console.log('FILTER - Admin users:', adminUsers);

    const firstActiveUser = userArr.find(user => user.isActive === true);
    console.log('FIND - First active user:', firstActiveUser);
}

function showLoops() {
    console.log('=== Looping Demonstration ===');

    console.log('Using for loop:');
    for (let i = 0; i < userArr.length; i++) {
        console.log(`User ${i + 1}:`, userArr[i].name);
    }

    console.log('Using for...of loop:');
    for (const user of userArr) {
        console.log('User:', user.name);
    }

    console.log('Using forEach:');
    userArr.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} - ${user.role}`);
    });
}

function init() {
    loadFromStorage();
    
    if (userArr.length > 0) {
        showAll();
    }

    console.log('User Management System initialized!');
    console.log('You can call testAsyncFetch() or testAsync() in console to test async features');
}

window.onload = init;

window.testAsyncFetch = testAsyncFetch;
window.testAsync = testAsync;
window.showArrayMethods = showArrayMethods;
window.showLoops = showLoops;
