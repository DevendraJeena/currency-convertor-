const BASE_URL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

window.addEventListener("load", () => {
  updateExchangeRate();
});

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

const updateExchangeRate = async () => {
  try {
    // 1. Read & validate amount
    const amountInput = document.querySelector(".amount input");
    let amtVal = parseFloat(amountInput.value);
    if (isNaN(amtVal) || amtVal < 1) {
      amtVal = 1;
      amountInput.value = "1";
    }

    // 2. Build new API URL (we’ll ignore BASE_URL here)
    const base = fromCurr.value; // e.g. "USD"
    const target = toCurr.value; // e.g. "INR"
    const URL = `https://api.exchangerate-api.com/v4/latest/${base}`;

    // 3. Fetch & parse
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    // 4. Compute & display
    const rate = data.rates[target];
    if (rate === undefined) throw new Error("Rate not found");
    const converted = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${base} = ${converted} ${target}`;
  } catch (err) {
    console.error("Exchange rate error:", err);
    msg.innerText = "⚠ Could not fetch rate. Try again later.";
  }
};
