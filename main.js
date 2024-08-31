let char_count = document.querySelector(".slider_output");
let slider = document.querySelector('input[type="range"]');

slider.addEventListener("change", (e) => {
    char_count.textContent = slider.value;
});

let checkboxes = document.querySelectorAll(".checkbox");

checkboxes.forEach((el) => {
    el.addEventListener("click", (e) => {
        if (el.dataset.checked === "true") {
            el.dataset.checked = "false";
        }
        else {
            el.dataset.checked = "true";
        }
    });
});

let lowercase = "abcdefghijklmnopqrstuvwxyz";
let uppercase = lowercase.toUpperCase();
let number = "0123456789";
let symbol = "!£$%&/()=?^-.,#[]{}";

let objtype = {"lowercase" : lowercase, "uppercase" : uppercase, "number" : number, "symbol": symbol};

let outputPassword = document.querySelector(".output_text");

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function readNumChars() {
    return slider.value;
}

function toInclude(types) {
    let curr_types = {...types};
    for (let el of checkboxes) {
        if (el.dataset.checked === "false") {
            delete curr_types[el.dataset.value];
        }
    }
    return curr_types;
    
}

let category = document.querySelector(".output_strenght > p");
let rectangles = document.querySelectorAll(".output_strenght div");

function calculateStrenght(n_types, len) {
    if (n_types === 4 && len > 14) {
        return "strong";
    }
    if (n_types >= 3 && len > 9) {
        return "medium";
    }
    if (n_types >= 2 && len > 5) {
        return "weak";
    }
    return "weakest";
}

function updateStrenght(strenght) {
    clearRects();
    let rects = Array.from(rectangles);
    if (strenght == "strong") {
        category.textContent = strenght.toUpperCase();
        for (let i = 0; i < 4; i++) {
            rects[i].classList.add("green");
        }
        return;
    }
    if (strenght == "medium") {
        category.textContent = strenght.toUpperCase();
        for (let i = 0; i < 3; i++) {
            rects[i].classList.add("yellow");
        }
        return;
    }
    if (strenght == "weak") {
        category.textContent = strenght.toUpperCase();
        for (let i = 0; i < 2; i++) {
            rects[i].classList.add("orange");
        }
        return;
    }
    category.textContent = "TOO WEAK!"
    rects[0].classList.add("red");
    return;
}

function clearRects() {
    document.querySelectorAll(".output_strenght div").forEach((el) => {
        el.classList.remove("green");
        el.classList.remove("yellow");
        el.classList.remove("orange");
        el.classList.remove("red");
    })
}

function generatePassword() {
    let n_chars = readNumChars();
    let types = toInclude(objtype);
    copy_text.classList.add("hidden");
    if (Number(n_chars) == 0) {
        outputPassword.textContent = "Password must be at least 1 length long";
        outputPassword.classList.add("error");
        clearRects();
        category.textContent = "";
        return;
    }

    if (Number(n_chars) < Object.keys(types).length) {
        outputPassword.textContent = "Password lenght must be greater than types";
        outputPassword.classList.add("error");
        clearRects();
        category.textContent = "";
        return;
    }

    if (Object.keys(types).length == 0) {
        outputPassword.textContent = "At least one type must be selected";
        outputPassword.classList.add("error");
        clearRects();
        category.textContent = "";
        return;
    }

    outputPassword.classList.remove("error");
    let chars = [];
    let keys = Object.keys(types);
    let map = new Map();
    let remaining = Number(n_chars);
    let selected = keys.length - 1;
    for (let j = 0; j < keys.length - 1; j++) {
        let chosen = Math.trunc(getRandomArbitrary(1, remaining - selected));
        map.set(keys[j], chosen);
        remaining -= chosen;
        selected -= 1;
    }

    map.set(keys[keys.length - 1], remaining);


    let i = Number(n_chars);
    
    while(i > 0) {
        let type_chosen = Math.trunc(getRandomArbitrary(0, keys.length));
        let curr_count = map.get(keys[type_chosen]);
        if (curr_count > 0) {
            chars.push(keys[type_chosen]);
            map.set(keys[type_chosen], curr_count - 1);
            i--;
        }
    }

    let ans = "";
    for (let c of chars) {
        ans += types[c][Math.trunc(getRandomArbitrary(0, types[c].length))];
    }

    outputPassword.textContent = ans;
    updateStrenght(calculateStrenght(keys.length, Number(n_chars)));
}

let generate = document.querySelector("button");

generate.addEventListener("click", generatePassword);

let copy_text = document.querySelector(".copy_icon p");
let copy = document.querySelector(".output svg");
copy.addEventListener("click", (e) => {
    navigator.clipboard.write(outputPassword.textContent);
    copy_text.classList.remove("hidden");
});