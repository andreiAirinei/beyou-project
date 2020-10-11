// ############ Functionality of First Carousel ############

// ### Select Elements
const primarySlider = document.querySelector('#slider-primary');
const primaryProducts = document.querySelectorAll('#slider-primary .box');
const primaryBtnGroup = document.querySelectorAll('.carousel-primary .buttons-group .buttons');

const secondSlider = document.querySelector('#slider-secondary');
const secondProducts = document.querySelectorAll('#slider-secondary .slider-item');
const secondBtnGroup = document.querySelectorAll('.carousel-secondary .buttons-group .buttons');

slide(primarySlider, primaryProducts, primaryBtnGroup);
slide(secondSlider, secondProducts, secondBtnGroup, 360);

// ### SLIDER FUNCTION
function slide(slider, products, btnGroup, offsetX = 0) {
  // NodeList to Array
  const btnGroupArray = Array.from(btnGroup);

  // Get the size of an Item in the Slider
  // 20 -> the X axis margins
  const itemSize = products[0].clientWidth + 20;
  const sliderWidth = itemSize * (products.length);

  // Set the Default active button
  btnGroupArray[1].classList.add('active');
  slider.style.transform = `translateX(-${itemSize - offsetX}px)`;

  // Remember the last button pressed
  // Initial value is the Default button declared above 
  let lastBtnPressed = btnGroupArray[1];

  // Function triggered on button click events
  const handleSlider = (e) => {
    // Remove 'active' class from previous button
    lastBtnPressed.classList.remove('active');
    // Reference the current button as the last button pressed
    lastBtnPressed = e.target;
    // Add 'active' class to it
    e.target.classList.add('active');
    // Add smooth transition to the slider
    slider.style.transition = 'transform 0.4s ease-in-out';
    // Dataset comes as a String
    let position = parseInt(e.target.dataset.position);
    // Translate the slider by multiplying the item position with the Item width
    slider.style.transform = `translateX(-${itemSize * position}px)`;
  }

  // ### Add event listeners to each button from the group
  btnGroupArray.map(btn => btn.addEventListener('click', handleSlider));

  // ### Slider Event Listeners
  slider.addEventListener('transitionend', () => {
    // Remove the transition
    slider.style.transition = null;
  });

  slider.addEventListener('mousedown', dragStart);

  // Get cursor's initial position
  let posInitial;
  let sliderCurrentTransformValue;
  let toTransform;
  let distance;
  let threshold = 150;
  const dragLimit = sliderWidth - itemSize * 3;

  // Drag Start
  function dragStart(e) {
    // Remove any transition animation
    slider.style.transition = null;

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
      slider.style.transform = `translateX(-${toTransform}px)`;
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
    slider.style.transition = 'transform 0.4s ease-in-out';
    distance = Math.abs(distance);

    if (distance > threshold && toTransform <= dragLimit) {
      let newTransform;

      if (toTransform > sliderCurrentTransformValue) {
        newTransform = toTransform + (itemSize - distance);
      }
      else {
        newTransform = toTransform - (itemSize - distance);
      }
      slider.style.transform = `translateX(-${newTransform}px)`;
    } else {
      // Slide back to original position
      slider.style.transform = `translateX(-${sliderCurrentTransformValue}px)`;
    }
  }
}