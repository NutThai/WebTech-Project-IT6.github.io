
if (localStorage.allcart == null) {
    var incart = []

} else {
    var incart = JSON.parse(localStorage.allcart)
}


function productPage(e) {
    id = Number(e.dataset.id)
    localStorage.setItem("productPage", id)
    window.location.href = 'detail.html'
}
function categoryPage(e) {
    cate = e.dataset.category
    localStorage.setItem("categoryPage", cate)
    if(cate == "bakery" || cate == "cafe"){
        window.location.href = cate+'.html'
    }
    else{
        window.location.href = 'category.html'
    }
}
function addToCart(e) {
    if(localStorage.Username == null){
        window.location.href = 'login.php'
    }
    id = Number(e.dataset.id)
    if (id in incart && incart[id] != null) {
        incart[id].qty++
    } else {
        let item = {
            id: id,
            qty: 1
        }
        incart[id] = item
    }

    // update cart ใน localStorage
    localStorage.setItem("allcart", JSON.stringify(incart))
    showMe()
}
function removeFromCart(e) {
    id = Number(e.dataset.id)
    if (id in incart && incart[id] != null) {
        if (incart[id].qty > 0) {
            incart[id].qty--
        }
        else {
            incart[id].qty = 0
        }
    }
    else {
        let item = {
            id: id,
            qty: 0
        }
        incart[id] = item
    }
    localStorage.setItem("allcart", JSON.stringify(incart))
    showMe()
}
function clearFromCart(e) {
    id = Number(e.dataset.id)
    if (id in incart && incart[id] != null) {
        if (incart[id].qty > 0) {
            incart[id].qty = 0
        }
        else {
            incart[id].qty = 0
        }
    }
    else {
        let item = {
            id: id,
            qty: 0
        }
        incart[id] = item
    }
    localStorage.setItem("allcart", JSON.stringify(incart))
    showMe()
}

function getItems(){
    let total = 0
    const cart = JSON.parse(localStorage.getItem("allcart"))
    cart.reduce((total, item) => {
        total += parseInt(item)
    }, 0)
    return parseInt(total)
}

function showMe() {
    let cart = "";
    let checkout = "";
    let total = parseInt(getItems());
    if (localStorage.allcart == null){
        total = 0;
    }
    let amount = 0;
    i = 0
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            while (incart.length > i) {
                if (incart[i] != null && incart[i].qty != 0) {
                    cart += `
                    <tr>
                        <td class="cartimg"><img src="img/${data[i].img[0]}" class="img_cart"></td>
                        <td class="cartname">${data[i].name}</td>
                        <td clasd="price">${data[i].price*incart[i].qty} <br> THB</td>
                        <td class="gap"></td>
                        <td><button data-id="${data[i].id}" onclick="addToCart(this)">+</button></td>
                        <td id="counting_cart" class="count">${incart[i].qty}</td>
                        <td><button data-id="${data[i].id}" onclick="removeFromCart(this)">-</button></td>
                        <td class="gap"></td>
                        <td><button data-id="${data[i].id}" onclick="clearFromCart(this)" class="fas fa-times"></button></td>
                        <td class="gap"></td>
                    </tr>
                    `;
                    checkout += `
                    <tr>
                        <td class="cartimgcheck"><img src="img/${data[i].img[0]}" class="img_cart"></td>
                        <td class="cartname">${data[i].name}</td>
                        <td class="price">${data[i].price*incart[i].qty} <br> THB</td>
                        <td class="gap"></td>

                        <td id="counting_cart" class="count">x ${incart[i].qty}</td>
                        <td class="gap"></td>
                    </tr>
                    `;
                    
                    total += Number(data[i].price)*Number(incart[i].qty);
                    amount += Number(incart[i].qty)
                
                }
                i++
            }

            // <button data-id="${product.id}" onclick="addToCart(this)">+</button>
            // <button data-id="${product.id}" onclick="removeFromCart(this)">-</button>
            document.getElementById("howmuch").innerHTML = amount
            document.getElementsByClassName("totals")[0].innerHTML = total +" THB"
            document.getElementById("cartmenu").innerHTML = cart
            try{
                
                
                // checkout += `<td id="counting_cart" class="totalprice">${total} THB</td>`
                document.getElementById("checkout").innerHTML = checkout
                document.getElementById("total").innerHTML = `<h6>Delivery fee : 0 THB<h6><h6>Total : ${total} THB </h6><h6>Amount : ${amount}</h6>`
            }
            catch(e){
                
            }
        })
        .catch(error => {
            alert(`User live server or local server`);
            //URL scheme must be "http" or "https" for CORS request. You need to be serving your index.html locally or have your site hosted on a live server somewhere for the Fetch API to work properly.
        })
}

showMe()