
    let app = new Vue({
        el: '#app',
        data:{
            items: [],
            cart:[],
            page: "items",
            sortBy: '',
            sortDirection: 'asc',
            search:'',
        },
        methods: {
            //This function is used to add items to cart and decrement space by 1//
            addtocart: function (item){
                if(item.spaces >= 1 ){
                  item.spaces = item.spaces - 1;
                  this.cart.push(item);
                }
                return item;
            },
            //This function is used to remove items from cart and increment space by 1//
            removeitem: function (item){
                this.cart.splice((item), 1);
                item.spaces = item.spaces +1;
                return item;
            },
            //This function is used to navigate between cart and lesson page//
            navigateTo(page){
                this.page= page;
            },
            //This function is used to sort items accroding to subject, price, location, availablity//
            sort: function(s){
                if(s === this.sortBy) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                }
                this.sortBy = s;
            },
            //This function is used to serach items from the search//
            filteredsearch(){
              fetch('/items?q=' + this.search)
              .then(res => res.json())
              .then(items => {
                items.forEach(item => {
                  const cartItems = this.cart.filter(i => i.id == item.id)
                  if(cartItems.length)
                    item.spaces -= cartItems.length
                })

                this.items = items;
              })
            },
          //This function is used to validate the form and show alert message of sucessful registration//
          submitClick() {
              if (formValidation()) {
                  const name = document.getElementById('name').value;
                  const phone = document.getElementById('phone').value;
                  fetch('/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                      name,
                      phone,
                      items: this.cart 
                    })
                  })
                  .then(res => {
                    if(res.status >= 400){
                      alert("Registration Failed!");
                      window.location = window.location.origin
                    }
                  })
                  .then(() => {
                    Promise.all(this.cart.map(item => {
                      fetch('/items', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify({
                          id: item.id
                        })
                      })
                    }))
                    .then(() => {
                      alert("Registration Sucessfull!");
                      window.location = window.location.origin
                    })
                  })
                  } else {
                    alert("Registration Failed!");
              }
          }
        },

        computed: {
            //This function is used to sort items accroding to subject, price, location, availablity//
            sorteditems: function(){
                return this.items.sort((p1,p2) => {
                    let modifier = 1;
                    if(this.sortDirection === 'desc') modifier = -1;
                    if(p1[this.sortBy] < p2[this.sortBy]) return -1 * modifier; if(p1[this.sortBy] > p2[this.sortBy]) return 1 * modifier;
                    return 0;
                });
            },
        },

        //This function loads the items before page load//
        beforeMount() {
          fetch('/items')
          .then(res => res.json())
          .then(items => this.items = items)
        },
      })
    

        //This function is used to validate the field of name and phone//
        function formValidation() {
            flag = true;

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;

            // Validate letters only as Name
            if (name== "") {
            alert("Please fill in your Name!");
            flag = false;
            }

            // Validate letters only as Name
            if (!/^[a-zA-Z]*$/g.test(name)) {
            alert("Enter alphabetic characters as Name!");
            flag = false;
            }

            // Validate Phone number
            if (phone== "") {
            alert("Please fill in your Phone Number!");
            flag = false;
            }
            // Validate Numbers only as Phone
            if (!/^[0-9]*$/g.test(phone)) {
            alert("Enter numeric values as Phone Number!");
            flag = false;
            }
            return flag;
        }

