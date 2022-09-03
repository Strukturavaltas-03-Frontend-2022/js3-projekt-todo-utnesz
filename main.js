const date = document.querySelector(".date");

const dateNow = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});


date.innerHTML = dateNow;

console.log(dateNow)


