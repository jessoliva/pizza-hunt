const $addToppingBtn = document.querySelector('#add-topping');
const $pizzaForm = document.querySelector('#pizza-form');
const $customToppingsList = document.querySelector('#custom-toppings-list');

const handleAddTopping = event => {
   event.preventDefault();

   // allows user to create new topping
   const toppingValue = document.querySelector('#new-topping').value;

   if (!toppingValue) {
      return false;
   }

   const checkbox = document.createElement('input');
   checkbox.type = 'checkbox';
   checkbox.name = 'topping';
   checkbox.value = toppingValue;
   checkbox.id = toppingValue
      .toLowerCase()
      .split(' ')
      .join('-');

   const label = document.createElement('label');
   label.textContent = toppingValue;
   label.htmlFor = toppingValue
      .toLowerCase()
      .split(' ')
      .join('-');

   const divWrapper = document.createElement('div');

   divWrapper.appendChild(checkbox);
   divWrapper.appendChild(label);
   $customToppingsList.appendChild(divWrapper);

   toppingValue.value = '';
};

const handlePizzaSubmit = event => {
   event.preventDefault();

   const pizzaName = $pizzaForm.querySelector('#pizza-name').value;
   const createdBy = $pizzaForm.querySelector('#created-by').value;
   const size = $pizzaForm.querySelector('#pizza-size').value;
   // creates an array of the toppings that are checked
   const toppings = [...$pizzaForm.querySelectorAll('[name=topping]:checked')].map(topping => {
      return topping.value;
   });

   // if any of these is empty, return out
   if (!pizzaName || !createdBy || !toppings.length) {
      return;
   }

   const formData = { pizzaName, createdBy, size, toppings };

   // added through module
   // ability to actually POST that form data to the API
   fetch('/api/pizzas', {
      method: 'POST',
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
      // What we've done here is POST the formData object to the API
   })
   .then(response => response.json())
   .then(postResponse => {
      alert('Pizza created successfully!');
      console.log(postResponse);
   })
   .catch(err => {
      console.log(err);
      saveRecord(formData); // function from idb.js
      // Now when a user tries to submit a new pizza without an internet connection, instead of the app simply failing, the data will be stored in the new_pizza object store in the browser's IndexedDB database called pizza_hunt
   });

};

$pizzaForm.addEventListener('submit', handlePizzaSubmit);
$addToppingBtn.addEventListener('click', handleAddTopping);
