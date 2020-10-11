// ############### NOTICE #####################
// Code needs to be Refactored
// This a bit more than a Minimum Viable Product
// ############################################


// ############ Functionality of First Carousel ############

// ### Select Elements
const primarySlider = document.querySelector('#slider-primary');
const primaryProducts = document.querySelectorAll('#slider-primary .box');
const primaryBtnGroup = document.querySelectorAll('.carousel-primary .buttons-group .buttons');

// NodeList to Array
const primaryBtnGroupArray = Array.from(primaryBtnGroup);

// Get the size of an Item in the Slider
// 20 -> the X axis margins
const primaryItemSize = primaryProducts[0].clientWidth + 20;
const primarySliderWidth = primaryItemSize * (primaryProducts.length);

// Set the Default active button
primaryBtnGroupArray[1].classList.add('active');
primarySlider.style.transform = `translateX(-${primaryItemSize}px)`;

// Remember the last button pressed
// Initial value is the Default button declared above 
let lastBtnPressed = primaryBtnGroupArray[1];

// Function triggered on button click events
const handlePrimarySlider = (e) => {
  // Remove 'active' class from previous button
  lastBtnPressed.classList.remove('active');
  // Reference the current button as the last button pressed
  lastBtnPressed = e.target;
  // Add 'active' class to it
  e.target.classList.add('active');
  // Add smooth transition to the slider
  primarySlider.style.transition = 'transform 0.4s ease-in-out';
  // Dataset comes as a String
  let position = parseInt(e.target.dataset.position);
  // Translate the slider by multiplying the item position with the Item width
  primarySlider.style.transform = `translateX(-${primaryItemSize * position}px)`;
}

// ### Add event listeners to each button from the group
primaryBtnGroupArray.map(btn => btn.addEventListener('click', handlePrimarySlider));

// ### Slider Event Listeners
primarySlider.addEventListener('transitionend', () => {
  // Remove the transition
  primarySlider.style.transition = null;
});

primarySlider.addEventListener('mousedown', dragStart);

// Get cursor's initial position
let posInitial;
let sliderCurrentTransformValue;
let toTransform;
let distance;
let threshold = 150;
const dragLimit = primarySliderWidth - primaryItemSize * 3;

// Drag Start
function dragStart(e) {
  // Remove any transition animation
  primarySlider.style.transition = null;

  e.preventDefault();

  posInitial = e.clientX;

  // Get current transform value
  let targetTransformValue = e.currentTarget.style.transform;
  // Extract the value from matrix with Regular Expressions
  targetTransformValue = targetTransformValue.replace(/[^\d.]/g, '');

  // Parse from String
  sliderCurrentTransformValue = +targetTransformValue;

  // Add event listeners to document
  document.onmouseup = dragEnd;
  document.onmousemove = dragAction;
}

// Drag Moving
function dragAction(e) {
  // Distance between initial and current cursor position
  distance = posInitial - e.clientX;
  // Add the distance to slider's current transform value
  toTransform = sliderCurrentTransformValue + distance;
  // Dragging will stop at the limit of 3 items onscreen
  if (dragLimit > toTransform)
    primarySlider.style.transform = `translateX(-${toTransform}px)`;
}

// Drag End
function dragEnd() {
  shiftSlider();
  // Remove event listeners from document
  document.onmouseup = null;
  document.onmousemove = null;
}

function shiftSlider() {
  // Add smooth transition to the slider
  primarySlider.style.transition = 'transform 0.4s ease-in-out';
  distance = Math.abs(distance);

  if (distance > threshold && toTransform <= dragLimit) {
    let newTransform;

    if (toTransform > sliderCurrentTransformValue) {
      newTransform = toTransform + (primaryItemSize - distance);
    }
    else {
      newTransform = toTransform - (primaryItemSize - distance);
    }
    primarySlider.style.transform = `translateX(-${newTransform}px)`;
  } else {
    // Slide back to original position
    primarySlider.style.transform = `translateX(-${sliderCurrentTransformValue}px)`;
  }
}
// ############ Functionality of Second Carousel ############

