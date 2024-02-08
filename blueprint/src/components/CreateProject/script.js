document.getElementById("startButton").addEventListener("click", function () {
  document.getElementById("inputForm").style.display = "flex";
});

function closeForm() {
  document.getElementById("inputForm").style.display = "none";
}

function closeFormImage() {
  document.getElementById("inputFormimage").style.display = "none";
}

function makeDraggable(element, onDragEnd) {
  let dragOffsetX = 0,
    dragOffsetY = 0;

  element.onmousedown = function (e) {
    e.preventDefault();
    dragOffsetX = e.clientX - element.getBoundingClientRect().left;
    dragOffsetY = e.clientY - element.getBoundingClientRect().top;

    function elementDrag(e) {
      e.preventDefault();
      element.style.left = e.clientX - dragOffsetX + "px";
      element.style.top = e.clientY - dragOffsetY + "px";
    }

    function stopElementDrag() {
      document.removeEventListener("mousemove", elementDrag);
      document.removeEventListener("mouseup", stopElementDrag);
      onDragEnd();
    }

    document.addEventListener("mousemove", elementDrag);
    document.addEventListener("mouseup", stopElementDrag);
  };
}

function createControlButtons(element, finalizePlacement) {
  const offsetX = 30,
    offsetY = -30;

  const checkButton = document.createElement("button");
  checkButton.textContent = "✓";
  checkButton.className = "controlButton";
  checkButton.style.position = "fixed";
  document.body.appendChild(checkButton);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "✕";
  deleteButton.className = "controlButton";
  deleteButton.style.position = "fixed";
  document.body.appendChild(deleteButton);

  function updateButtonPositions() {
    const rect = element.getBoundingClientRect();
    checkButton.style.left = `${rect.left}px`;
    checkButton.style.top = `${rect.top + offsetY}px`;
    deleteButton.style.left = `${rect.left + offsetX}px`;
    deleteButton.style.top = `${rect.top + offsetY}px`;
  }

  checkButton.onclick = function () {
    element.onmousedown = null;
    checkButton.remove();
    deleteButton.remove();
    finalizePlacement();
  };

  deleteButton.onclick = function () {
    element.remove();
    checkButton.remove();
    deleteButton.remove();
    finalizePlacement();
  };

  updateButtonPositions();
  return { updateButtonPositions };
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form-container");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const number = form.querySelector('input[name="number"]').value;
    const size = form.querySelector('input[name="size"]').value;
    const type = form.querySelector('input[name="type"]').value;
    const photo = form.querySelector('input[name="photo"]').files[0];

    // Check if a dynamicButton with the same number already exists
    if (!document.querySelector(`.dynamicButton[data-number="${number}"]`)) {
      const newButton = document.createElement("button");
      newButton.textContent = number;
      newButton.className = "dynamicButton";
      newButton.style.position = "fixed";
      newButton.setAttribute("data-number", number); // Add a data attribute to identify by number
      document.body.appendChild(newButton);

      const { updateButtonPositions } = createControlButtons(
        newButton,
        function () {
          newButton.onclick = function () {
            showPopup(size, type, photo);
          };
        }
      );

      makeDraggable(newButton, updateButtonPositions);
    }

    document.getElementById("inputForm").style.display = "none";
  });
});

function showPopup(size, type, photo) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    <span class="closeBtn" onclick="closePopup()">&times;</span>
    <p>Size: ${size}</p>
    <p>Type: ${type}</p>
    ${
      photo
        ? `<img src="${URL.createObjectURL(
            photo
          )}" alt="Uploaded Photo" style="max-width: 100px;">`
        : ""
    }
  `;
  document.body.appendChild(popup);

  popup.querySelector(".closeBtn").addEventListener("click", function () {
    popup.remove();
  });
}

function closePopup() {
  const popup = document.querySelector(".popup");
  if (popup) {
    popup.remove();
  }
}

document.getElementById("newimage").addEventListener("click", function () {
  document.getElementById("inputFormimage").style.display = "flex";
});

document.addEventListener("DOMContentLoaded", function () {
  const imageInputForm = document.querySelector("#inputFormimage");
  const imageDisplay = document.querySelector("#imageDisplay");

  imageInputForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const photoInput = imageInputForm.querySelector('input[name="photo"]')
      .files[0];

    if (photoInput) {
      const imageUrl = URL.createObjectURL(photoInput);

      // Create an image element and set its source to the uploaded image
      const uploadedImage = document.createElement("img");
      uploadedImage.src = imageUrl;
      uploadedImage.style.maxWidth = "100%"; // Adjust styling as needed

      // Clear any previous content in the imageDisplay div
      imageDisplay.innerHTML = "";

      // Append the uploaded image to the imageDisplay div
      imageDisplay.appendChild(uploadedImage);

      // Hide the image input form
      imageInputForm.style.display = "none";
      // Hide the newimage button when the input form is submitted
      document.getElementById("newimage").style.display = "none";

      // Center the uploaded image on the page
      uploadedImage.style.position = "fixed";
      uploadedImage.style.top = "50%";
      uploadedImage.style.left = "50%";
      uploadedImage.style.transform = "translate(-50%, -50%)";
      uploadedImage.style.zIndex = "-1";
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form-container");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Other form submission code
    document.getElementById("inputForm").style.display = "none";
    document.getElementById("newimage").style.display = "none"; // Hide the newimage button
  });

  const imageContainer = document.getElementById("imageContainer"); // Get the container for the uploaded image

  const imageInputForm = document.querySelector("#inputFormimage");
  imageInputForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const photoInput = imageInputForm.querySelector('input[name="photo"]')
      .files[0];

    if (photoInput) {
      const imageUrl = URL.createObjectURL(photoInput);

      const uploadedImage = document.createElement("img");
      uploadedImage.src = imageUrl;
      uploadedImage.style.maxWidth = "100%";

      imageContainer.appendChild(uploadedImage); // Append the uploaded image to the container

      imageInputForm.style.display = "none"; // Hide the image input form
      document.getElementById("newimage").style.display = "none"; // Hide the newimage button

      // Scroll to the image container to make it visible
      imageContainer.scrollIntoView({ behavior: "smooth" });
    }
  });
});
