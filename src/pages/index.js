import "./index.css";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Golden Gate bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c01721fb-6750-4121-a412-dc80ef0cf84d",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    // profileImage.src = userInfo.avatar;
  })
  .catch(console.error);

//Profile elements
const profileEditBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileImage = document.querySelector(".profile__avatar");

//Avatar elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");

//Edit form elements
const editModal = document.querySelector("#edit-modal");
const profileFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = document.querySelector("#profile-name-input");
const editModalDescriptionInput = document.querySelector(
  "#profile-description-input"
);

//Card form elements
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//Preview image popup elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImg = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalClose = previewModal.querySelector(".modal__close-btn");

//Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImgElement = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameElement.textContent = data.name;
  cardImgElement.src = data.link;
  cardImgElement.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });

  cardDeleteBtn.addEventListener("click", (evt) => {
    cardElement.remove();
  });

  cardImgElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaption.textContent = data.name;
    previewModalImg.src = data.link;
    previewModalImg.alt = data.name;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalOnEsc);
  modal.addEventListener("click", closeModalOnOverlay);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalOnEsc);
  modal.removeEventListener("click", closeModalOnOverlay);
}

function closeModalOnEsc(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}
function closeModalOnOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editModal);
    })
    .catch(console.error);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  evt.target.reset();
  disableButton(cardSubmitBtn, settings);

  closeModal(cardModal);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api
    .editUserAvatar({
      avatar: avatarLinkInput.value,
    })
    .then((data) => {
      profileImage.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error);
}

// function handleAvatarSubmit(evt) {
//   // const modalSubmitBtn = evt.submitter;
//   // modalSubmitBtn.textContent = "Saving...";
//   // // .finally(() => {
//   // //   modalSubmitBtn.textContent = "Save";
//   // // });
// }

profileEditBtn.addEventListener("click", (config) => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    profileFormElement,
    [editModalNameInput, editModalDescriptionInput],
    config
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

previewModalClose.addEventListener("click", () => {
  closeModal(previewModal);
});

profileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

// avatarForm.addEventListener("submit", handleAvatarSubmit);

enableValidation(settings);

// const deleteModal = document.querySelector("#delete-modal");
// const cancelModalButton = document.querySelector(".modal__cancel-btn");
// const deleteCloseButton = deleteModal.querySelector(".modal__cls-btn");
// const deleteForm = deleteModal.querySelector(".modal__form");

// let selectedCard;
// let selectedCardId;

// function getCardElement(data) {
//   const cardElement = cardTemplate.content
//     .querySelector(".card")
//     .cloneNode(true);

//   const cardNameElement = cardElement.querySelector(".card__title");
//   const cardImageElement = cardElement.querySelector(".card__img");
//   const cardLikeBtn = cardElement.querySelector(".card__like-btn");
//   const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

//   cardNameElement.textContent = data.name;
//   cardImageElement.src = data.link;
//   cardImageElement.alt = data.name;

//   function handleDeleteCard(cardElement, cardId) {
//     selectedCard = cardElement;
//     selectedCardId = cardId;
//     openModal(deleteModal);
//   }

//   function handleLike(evt, cardId) {
//     const cardLikeBtn = evt.target;
//     const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");
//     api
//       .toggleLike(cardId, isLiked)
//       .then((data) => {
//         cardLikeBtn.classList.toggle("card__like-btn_liked", !isLiked);
//       })
//       .catch(console.error);
//   }

//   cardDeleteBtn.addEventListener("click", (evt) =>
//     handleDeleteCard(cardElement, data._id)
//   );

//   if (data.isLiked) {
//     cardLikeBtn.classList.add("card__like-btn_liked");
//   } else {
//     cardLikeBtn.classList.remove("card__like-btn_liked");
//   }

//   cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

//   cardImageElement.addEventListener("click", () => {
//     openModal(previewModal);
//     previewModalImgEl.src = data.link;
//     previewModalCapEl.textContent = data.name;
//     previewModalImgEl.alt = data.name;
//   });

//   return cardElement;
// }

// function handleEditFormSubmit(evt) {
//   const modalSubmitButton = evt.submitter;
//   modalSubmitButton.textContent = "Saving...";
//   evt.preventDefault();
//   api
//     .editUserInfo({
//       name: profileModalNameInput.value,
//       about: profileModalDescriptionInput.value,
//     })
//     .then((data) => {
//       profileName.textContent = data.name;
//       profileDescription.textContent = data.about;
//       closeModal(profileModal);
//     })
//     .catch(console.error)
//     .finally(() => {
//       modalSubmitButton.textContent = "Save";
//     });
// }

// function handleAddCardSubmit(evt) {
//   const modalSubmitButton = evt.submitter;
//   modalSubmitButton.textContent = "Saving...";
//   evt.preventDefault();
//   api
//     .addNewCard({
//       name: cardNameInput.value,
//       link: cardLinkInput.value,
//     })
//     .then((data) => {
//       const cardEl = getCardElement(data);
//       cardsList.prepend(cardEl);
//       evt.target.reset();
//       disableButton(cardSubmitBtn, settings);
//       closeModal(cardModal);
//     })
//     .catch(console.error)
//     .finally(() => {
//       modalSubmitButton.textContent = "Save";
//     });
// }

// function handleDeleteSubmit(evt) {
//   const deleteButton = evt.submitter;
//   deleteButton.textContent = "Deleting...";
//   evt.preventDefault();
//   api
//     .deleteCard(selectedCardId)
//     .then(() => {
//       selectedCard.remove();
//       closeModal(deleteModal);
//     })
//     .catch(console.error)
//     .finally(() => {
//       deleteButton.textContent = "Delete";
//     });
// }

// deleteForm.addEventListener("submit", handleDeleteSubmit);

// modalCloseTypePreview.addEventListener("click", () => closeModal(previewModal));

// profileFormElement.addEventListener("submit", handleEditFormSubmit);
// cardForm.addEventListener("submit", handleAddCardSubmit);
// avatarFormElement.addEventListener("submit", handleAvatarSubmit);
