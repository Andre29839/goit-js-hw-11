import SlimSelect from "slim-select";
import { fetchBreeds, fetchCatByBreed } from "./cat-api.js";
import Notiflix from "notiflix"
import '/node_modules/slim-select/dist/slimselect.css';

const refs = {
    select: document.querySelector(".breed-select"),
    loadingInProgress: document.querySelector(".loader"),
    LoadingError: document.querySelector(".error"),
    cardCat: document.querySelector(".cat-info"),
    containerImg: document.querySelector(".curt-wraper")
}

fetchBreeds().then(data => {
    refs.select.insertAdjacentHTML("beforeend", `<option value ="null" selected>Please select the breed</option>`)
    
    data.map(({ id, name }) => ({
            value: id,
            label: name,
        })).forEach(e => {
        refs.select.insertAdjacentHTML("beforeend", `<option value = "${e.value}">${e.label}</option>`)
        refs.select.classList.remove("is-hidden")
    })
    new SlimSelect({
        select: refs.select,
    })
   
}).catch(err => {
    console.log(err);
    refs.LoadingError.classList.remove("is-hidden")
}).finally(() => {
    refs.loadingInProgress.classList.add("is-hidden")
})

refs.select.addEventListener("change", function (e) {
    refs.cardCat.innerHTML = ""
    refs.select.classList.add("is-hidden")
    refs.loadingInProgress.classList.remove("is-hidden")
    fetchCatByBreed(e.target.value).then(data => {
        if (data.length == 0) {
            Notiflix.Notify.failure("Oops! Something went wrong! Try reloading the page!")
            return
        }
        let dataObj = {
            url: data[0].url,
            name: data[0].breeds[0].name,
            description: data[0].breeds[0].description,
            temperament: data[0].breeds[0].temperament,
        }
        makeElem(dataObj)
    }).catch(err => {
         Notiflix.Notify.failure("Oops! Something went wrong! Try reloading the page!")
    }).finally(() => {
        refs.loadingInProgress.classList.add("is-hidden")
    })
})

const makeElem = ({ url, name, description, temperament }) => {
    let card = `<img class="cat-image"  alt = "Cat Image" src="${url}" width="700px"></div>
        <div class="cat-details">
            <h2 class="breed-name">${name}</h2>
            <p class="description">${description}</p>
            <p class="temperament">${temperament}</p>`
    refs.cardCat.innerHTML = card
    refs.cardCat.classList.remove("is-hidden")
}

