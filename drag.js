// Store the initial positions of the draggable elements
const initialPositions = {};

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
  // only accept elements matching this CSS selector
  accept: '#yes-drop, .drag-drop',
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.85,

  // listen for drop related events:
  ondropactivate: function (event) {
    // add active dropzone feedback
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget;
    var dropzoneElement = event.target;

    // feedback the possibility of a drop
    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
    event.relatedTarget.textContent = event.relatedTarget.getAttribute('alt');
  },
  ondragleave: function (event) {
    // remove the drop feedback style
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    event.relatedTarget.textContent = 'Dragged out';
  
  },
  ondrop: function (event) {
    //event.relatedTarget.textContent = 'Dropped';//
    event.relatedTarget.textContent = event.relatedTarget.getAttribute('alt') + ' Dropped';

    
  },
  ondropdeactivate: function (event) {
    // remove active dropzone feedback
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});

interact('.drag-drop').draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
      endOnly: true
    })
  ],
  autoScroll: true,
  // dragMoveListener from the dragging demo above
  listeners: { move: dragMoveListener }
});

function dragMoveListener(event) {
  var target = event.target;

  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  // translate the element
  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

  // update the position attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

// Initialize the initial positions after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
  const draggableElements = document.querySelectorAll('.drag-drop');
  draggableElements.forEach(element => {
    initialPositions[element.id] = {
      x: element.getAttribute('data-x') || 0,
      y: element.getAttribute('data-y') || 0
    };
  });
});

// Update the cauldron status
function updateCauldronStatus() {
    const innerDropzone = document.getElementById('inner-dropzone');
    const yesDropElements = innerDropzone.querySelectorAll('.yes-drop');
    
    const ingredientCounts = {};

    yesDropElements.forEach(element => {
        const altText = element.getAttribute('alt');
        if (ingredientCounts[altText]) {
            ingredientCounts[altText]++;
        } else {
            ingredientCounts[altText] = 1;
        }
    });

    let message = 'Cauldron ingredients: ';
    for (const [ingredient, count] of Object.entries(ingredientCounts)) {
        message += `${count} ${ingredient} `;
    }

    document.getElementById('cauldron-status').innerText = message.trim();
}
// Reset function to move elements back to their original positions
function reset() {
  const draggableElements = document.querySelectorAll('.drag-drop');
  draggableElements.forEach(element => {
    const initialPosition = initialPositions[element.id];
    element.style.transform = 'translate(0px, 0px)'; // Reset the transform
    element.setAttribute('data-x', initialPosition.x);
    element.setAttribute('data-y', initialPosition.y);
    element.textContent = element.getAttribute('alt');
  });
  updateCauldronStatus();
}
