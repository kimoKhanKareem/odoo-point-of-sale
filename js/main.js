const cartSection = document.querySelector(".cart-section");
const cartAddItem = document.querySelector(".add-cart-items");
const textLength = document.querySelector(".divicons");
const totalPrice = document.querySelector(".total-price");

let cart = [];

class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price, para } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, para, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
   displayProducts(products) {
      let result = "";
      products.map((product) => {
        return result += `
                      <div class="btn inside-section-cart d-nonAdjustable" data-id=${product.id}>
                          <div class="imag-container ">
                              <h4 class="bag-btn" >$ ${product.price}</h4>
                              <img class="imgModern" style="width: 170px; height: 170px;" src=${product.image} alt="img">
                              <div class="text-images">
                                  <h4>${product.title}</h4>
                                  <h4>(${product.para})</h4>
                              </div>
                          </div>
                      </div>
                      `;
      });
      return cartSection.innerHTML = result;
    }

    getItems() {
      const items = [...document.querySelectorAll(".inside-section-cart")];
      items.map((item) => {
        let idItems = item.dataset.id;
        let cartItems = { ...Storage.getproducts(idItems) };
        item.addEventListener("click", () => {
          let productIndex = cart.findIndex((item) => item.id === cartItems.id);
          if (productIndex === -1 ) {
            cart.push({
              ...cartItems,
              qty: 1,
            });
          } else {
            cart[productIndex].qty++;
          }

          this.setItems();
          //save cart in localStorage
          Storage.saveCart(cart);
          // value cart
          this.setCartValue(cart);
          //add product class active item
          this.itemsActive(cartItems);   
        });
      });
    };

    setItems = () => {
      let data = "";
      cart.map((item) => {
        return (data += `
                <div class="box-items" data-id=${item.id}>
                  <div class="box-child">
                      <div class="item-in-carts f-nonAdjustable s-nonAdjustable">
                          <div class="f-nonAdjustable a-nonAdjustable">
                              <h4>${item.title}</h4>
                              <h4>(${item.para})</h4>
                              </div>
                          <div class="box-price">
                              <h4>$${(item.price * item.qty).toFixed(2)}</h4>
                              <i class="gg-trash"></i>
                          </div>
                      </div>
                      <div class="f-nonAdjustable">
                          <p>${item.qty} Qty /</p>
                          <p class=""> $${item.price} Units</p>
                      </div>
                  </div>
                </div>
        `);
      });
      if (cart.length) {
        textLength.style.display = "none";
        cartAddItem.innerHTML = data;
      }
      // select product cart (push class active)
      this.selectItems();  
    };

    // value cart
    setCartValue = (cart) => {
      let CartTotal = 0;
      cart.map((item) => {
        CartTotal += item.price * item.qty;
      });
      totalPrice.innerHTML = parseFloat(CartTotal.toFixed(2));
    };

    //  add product class active item
    itemsActive = (cartItems) => {
      if (cart) {
        const items = document.querySelectorAll(".box-items");
        items.forEach((item) => {
          item.classList.remove("active");
          items.forEach((item) => {
            let itemid = item.dataset.id;
            if(itemid === cartItems.id){
              item.classList.add("active");
            }
          });
        });
      }
    }
    // select items and get class active 
    selectItems = () => {
      if(cart) {
        const items = document.querySelectorAll(".box-items");
        items.forEach((item)=>{
          item.addEventListener("click", ()=>{
            items.forEach((item)=>{
              item.classList.remove("active");
            })
              item.classList.add("active");
          })
        })
      }
    }
    // add app local
    setupAPP() {
       cart =  Storage.getCart();
        this.setCartValue(cart);
        this.setItems(cart)
    }
}


// add local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getproducts(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")): [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  ui.setupAPP();
  
  products.getProducts().then((products) => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  })
  .then(() => {
    ui.getItems();
    })
});

