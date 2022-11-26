const url = "http://192.168.1.7:1337/api/";
const token =
  "Bearer 99ea3a7e81e36a7e02751b9587298111172b73aab39eed1ba3ea4de9abaef761b5be6d63ad6866e2daaa889751fe2f099eb202cbb2614ca1acb62f0eb3b39fd767717a8b1f3c1f5eb90405473cd8a9c6fc01847b3a8390559e5f0c129424d5a57a75813496f245370be37f3d3113ace49c6ec397430fbc8bf0623071556ec701";

async function getInventoryData() {
  let response = await fetch(`${url}inventory-items`, {
    headers: {
      Authorization: token,
    },
  });
  let data = await response.json();
  return data;
}

async function addInventoryItem(body) {
  console.log(JSON.stringify({ data: body }));
  let response = await fetch(`${url}inventory-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ data: body }),
  });
  let data = await response.json();
  return data;
}

export default {
  getInventoryData,
  addInventoryItem,
};
