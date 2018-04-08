'use strict';

const STORE = {

  products: [
    {name: 'apples', checked: true},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],

  hideCheckedItems: false,
  searchActivated: false,
};


// User can edit the title of an item
//COMPLETED set up event listener on js-shopping-item (USE EVENT DELEGATION)
// COMPLETED if clicked, change the HTML to be a textbox and submit button
// AAAARGH Why can't I type in my text box?
//Completed? Set up a listener for the created textbox
//store the value from the created textbox, at the correct object in the array
// change the value at products.name for the data-item-index
// rerender the page

function changeItemTitle() {
  //when item-name is clicked, get the item's index and change the title-text to the HTML string contained in makeTextBoxButton; start a listener on that new button
  $('.js-shopping-list').on('click', '.js-shopping-item', event => {

    let clickedElement = event.currentTarget;
    const clickedIndex = getItemIndexFromElement(clickedElement);
    const htmlToChange = makeTextBoxButton();
    $(clickedElement).html(htmlToChange);
    newBoxListener();
  });
}


function makeTextBoxButton() {
// the textbox created here won't let me type in it - why?

  return `  
       <form>
      <input type="text" name="renamer" class="js-renamer" placeholder="change name here">
      <button type="button" class="js-renamebutton">Confirm name change</button>
    </form>
     `;  
}


function newBoxListener () {
  //listen to the new button, get index for clicked item and store value from text box, pass to renamer
  $('.js-renamebutton').click(function () { 
    const buttonPressed = event.currentTarget;
    const changedItemIndex = getItemIndexFromElement(buttonPressed);
    const changedTitle = 'ham sandwich';
    // const changedTitle = $('.js-renamer').val();
    TitleRenamer(changedTitle, changedItemIndex);
  });
 }

function TitleRenamer (newTitle, index) {
  //need some javascript to update products.name to = newTitle at [index]

  renderShoppingList();

}


function hideCheckedItems() {

  $('.js-filter-by-checked').on('click', function doSomething() {
    STORE.hideCheckedItems = !STORE.hideCheckedItems;
    renderShoppingList();
   
  });
 

}



function handleSearchButtonClicked() {
  $('#js-shopping-list-form').on('click','.js-searchbutton', event => {
    event.preventDefault();
    STORE.searchActivated = !STORE.searchActivated;
    console.log('search has been pressed');
    renderShoppingList();
  });
 
  
  
}


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  // console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  // console.log('`renderShoppingList` ran');
  const shoppingListItemsString = generateShoppingItemsString(whatToRender());

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);




  //add code to render handle hideCheckedItems;
  //if hideCheckedItems false, pass products to generate items
  // if hideCheckedItems true, pass ONLY products with property false to generateItems
  $('.js-shopping-list-search').val('');
}

function whatToRender() {
  if(STORE.searchActivated === true) {
 
    let searchValue = $('.js-shopping-list-search').val();
    // let searchValue ='apples';
    return STORE['products'].filter(items =>items.name === searchValue);
  }

  if(STORE.hideCheckedItems === false)
  {
    return STORE.products;
  }

  else {
    return STORE['products'].filter(items => items.checked === false);
  }

}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE['products'].push({name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').on('click', '.js-add-button', function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.products[itemIndex].checked = !STORE.products[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  console.log(itemIndexString);
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    // console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

// name says it all. responsible for deleting a list item.
function deleteListItem(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);

  // as with `addItemToShoppingLIst`, this function also has the side effect of
  // mutating the global STORE value.
  //
  // we call `.splice` at the index of the list item we want to remove, with a length
  // of 1. this has the effect of removing the desired item, and shifting all of the
  // elements to the right of `itemIndex` (if any) over one place to the left, so we
  // don't have an empty space in our list.
  STORE['products'].splice(itemIndex, 1);
}


function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in STORE
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    // delete the item
    deleteListItem(itemIndex);
    // render the updated shopping list
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  hideCheckedItems();
  handleSearchButtonClicked();
  changeItemTitle();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);