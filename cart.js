var totel = 0;

//AJAX function
const ajax = async (config) => {
    const request = await fetch(config.url, {
        method: config.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config.data)
    });
    const response = await request.json();
    console.log(reponse.status);
    return response;
}

// Function to check login status and display user info
function checkLoginStatus() {
    // Try to get user email from localStorage first, then sessionStorage
    let loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
        loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
    }

    if (!loggedInUserEmail) {
        window.location.href = 'index.js'
    }
}

function loadCart(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => carts(data));
}
async function carts(data) {
    const select = document.getElementById('cart-item');

    // Try to get user email from localStorage first, then sessionStorage
    let loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
        loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
    }
    if (loggedInUserEmail) {
        // --- ขั้นตอนสำคัญ: ดึงข้อมูลสินค้าทั้งหมด 'ครั้งเดียว' ---
        let allProducts = [];
        try {
            const productsResponse = await fetch('http://localhost:5000/api/products'); // ดึงข้อมูลสินค้าทั้งหมด
            if (!productsResponse.ok) {
                throw new Error(`HTTP error! status: ${productsResponse.status}`);
            }
            allProducts = await productsResponse.json(); // รอให้แปลงเป็น JSON
        } catch (error) {
            console.error("Error fetching product data:", error);
            // แสดงข้อความผิดพลาดหากดึงข้อมูลสินค้าไม่ได้
            return;
        }


        data.forEach(cart => {
            //const product = allProducts.find(p => p.id == cart.item);
            //console.log(allProducts)
            if (cart.email == loggedInUserEmail) {
                for (let i = 0; i < cart.carts.length; i++) {
                    const cartCard = document.createElement('div');
                    let img = '';
                    let name = '';
                    let price = '';
                    for (let j = 0; j < allProducts.length; j++) {
                        if (allProducts[j].id == cart.carts[i].item) {
                            img = allProducts[j].img[0];
                            name = allProducts[j].name;
                            price = allProducts[j].price;
                        }
                    }
                    totel += parseInt(price) * parseInt(cart.carts[i].amount);
                    cartCard.innerHTML =
                        `<div>` +
                        `<img src="./backend${img}" height="100" width="100">` +
                        `<h1>Name: ${name}</h1>` +
                        `<h3>Price ${price}</h3>` +
                        `<h3>Size: ${cart.carts[i].size}</h3>` +
                        `<a><button onclick="addCart(${cart.carts[i].item},'${cart.carts[i].size}')">+</button></a>${cart.carts[i].amount}` +
                        `<a><button onclick="removeCart(${cart.carts[i].item},'${cart.carts[i].size}')">-</button></a>` +
                        `</div>`

                    select.appendChild(cartCard);
                }
            }
        })
    }
    document.getElementById('totel-price').innerHTML = `Totel : ${totel}`
}

function addCart(item, size) {
    let loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
        loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
    }

    let data = {
        email: loggedInUserEmail,
        item: item,
        size: size
    }
    console.log(data)
    let config = {
        url: 'http://localhost:5000/api/carts/add',
        method: 'POST',
        data: data
    }
    let response = ajax(config);
}
function removeCart(item, size) {
    let loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
        loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
    }

    let data = {
        email: loggedInUserEmail,
        item: item,
        size: size
    }
    console.log(data)
    let config = {
        url: 'http://localhost:5000/api/carts/remove',
        method: 'POST',
        data: data
    }
    let response = ajax(config);
}

async function checkOut() {
    let loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
        loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
    }

    if (loggedInUserEmail) {
        let allCarts = [];
        try {
            const cartsResponse = await fetch('http://localhost:5000/api/carts');
            if (!cartsResponse.ok) {
                throw new Error(`HTTP error! status: ${cartsResponse.status}`);
            }
            allCarts = await cartsResponse.json();
        } catch (error) {
            console.error("Error fetching cart data:", error);
            return;
        }
        let indexCartid = 0;
        for (let i = 0; i < allCarts.length; i++) {
            if (allCarts[i].email == loggedInUserEmail) {
                indexCartid = i;
            }
        }
        if (confirm('You are sure??') == true && allCarts[indexCartid].carts.length != 0) {
            const oldAllCarts = allCarts[indexCartid].carts;
            const emailCarts = allCarts[indexCartid].email;
            for (let i = 0; i < allCarts[indexCartid].carts.length; i++) {
                for (let j = 0; j < allCarts[indexCartid].carts[i].amount; j++) {
                    let data = {
                        email: loggedInUserEmail,
                        item: allCarts[indexCartid].carts[i].item,
                        size: allCarts[indexCartid].carts[i].size
                    }
                    console.log(data)
                    let config = {
                        url: 'http://localhost:5000/api/carts/remove',
                        method: 'POST',
                        data: data
                    }
                    let response = ajax(config);
                }
            }
            let data = {
                email: loggedInUserEmail,
                order: oldAllCarts
            }
            console.log(data)
            let config = {
                url: 'http://localhost:5000/api/users/addOrder',
                method: 'POST',
                data: data
            }
            let response = ajax(config);
        } else {
            alert('You cart is null');
        }
    } else {
        window.location.href = 'index.html'
    }
}

// --- ส่วนของการตั้งเวลา Polling ---
// กำหนดช่วงเวลา (เป็นมิลลิวินาที) เช่น 5000ms = 5 วินาที
const POLLING_INTERVAL = 5000; // 5 วินาที

window.onload = function () {
    loadCart('http://localhost:5000/api/carts');
    checkLoginStatus();

    // ตั้งค่าให้ loadProduct ถูกเรียกซ้ำทุกๆ POLLING_INTERVAL
    setInterval(loadCart, POLLING_INTERVAL);
}