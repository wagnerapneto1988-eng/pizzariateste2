
const products = [
  {id:1,name:"Calabresa",cat:"tradicional",desc:"Calabresa fatiada, cebola, muçarela e orégano.",base:36},
  {id:2,name:"Marguerita",cat:"tradicional",desc:"Muçarela, tomate, manjericão e parmesão.",base:38},
  {id:3,name:"Frango com Catupiry",cat:"tradicional",desc:"Frango desfiado, catupiry, muçarela e orégano.",base:42},
  {id:4,name:"Portuguesa",cat:"especial",desc:"Presunto, ovos, cebola, ervilha, azeitona e muçarela.",base:45},
  {id:5,name:"Bella Massa",cat:"especial",desc:"Pepperoni, bacon crocante, cebola roxa e muçarela.",base:49},
  {id:6,name:"Quatro Queijos",cat:"especial",desc:"Muçarela, provolone, parmesão e catupiry.",base:48},
  {id:7,name:"Chocolate com Morango",cat:"doce",desc:"Chocolate cremoso, morangos e leite condensado.",base:43},
  {id:8,name:"Banana Canela",cat:"doce",desc:"Banana, açúcar, canela e toque de leite condensado.",base:39},
  {id:9,name:"Coca-Cola 2L",cat:"bebida",desc:"Refrigerante gelado, 2 litros.",base:14},
  {id:10,name:"Guaraná 2L",cat:"bebida",desc:"Refrigerante gelado, 2 litros.",base:13},
  {id:11,name:"Água 500ml",cat:"bebida",desc:"Água mineral sem gás.",base:5}
];
const sizes = {
  "Broto": 0,
  "Grande": 12,
  "Família": 22
};
let cart = [];
let current = null;
let selectedSize = "Grande";
let currentFilter = "all";

const money = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const grid = document.getElementById("menuGrid");

function renderProducts(){
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const list = products.filter(p => (currentFilter==="all" || p.cat===currentFilter) && (!q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)));
  grid.innerHTML = list.map(p => `
    <article class="menu-card">
      <div class="food-art">
        ${p.cat==="bebida" ? `<div class="drink">${p.name.includes("Água")?"💧":"🥤"}</div>` : `<div class="mini-pizza"></div>`}
      </div>
      <div class="menu-content">
        <div class="menu-top"><h3>${p.name}</h3><span class="price">${money(p.base)}</span></div>
        <p>${p.desc}</p>
        <div class="menu-actions">
          <small>${p.cat==="bebida" ? "unidade" : "a partir de"}</small>
          <button class="add-btn" onclick="openProduct(${p.id})">${p.cat==="bebida"?"Adicionar":"Escolher"}</button>
        </div>
      </div>
    </article>`).join("") || `<div class="cart-empty">Nenhum item encontrado.</div>`;
}

function setFilter(filter){
  currentFilter = filter;
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));
  renderProducts();
  const t = document.getElementById("migoTitle");
  const tx = document.getElementById("migoText");
  const msgs = {
    tradicional:["Clássicos que sempre funcionam.","Calabresa, marguerita e frango com catupiry são ótimas escolhas."],
    especial:["Quer algo mais caprichado?","As especiais levam combinações mais marcantes."],
    doce:["Sobrou espaço para sobremesa?","Chocolate com morango ou banana com canela fecham bem o pedido."],
    bebida:["Não esquece a bebida.","Uma bebida gelada completa o pedido."],
    all:["O que combina com sua fome hoje?","Posso te ajudar a escolher entre tradicionais, especiais e doces."]
  };
  [t.textContent,tx.textContent]=msgs[filter]||msgs.all;
}
document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>setFilter(b.dataset.filter)));
document.getElementById("searchInput").addEventListener("input",renderProducts);

function openProduct(id){
  current = products.find(p=>p.id===id);
  document.getElementById("modalCategory").textContent = current.cat;
  document.getElementById("modalName").textContent = current.name;
  document.getElementById("modalDesc").textContent = current.desc;
  document.getElementById("modalPrice").textContent = money(current.base);
  const isDrink = current.cat==="bebida";
  document.getElementById("sizeBlock").style.display=isDrink?"none":"block";
  document.getElementById("halfBlock").style.display=isDrink?"none":"block";
  document.getElementById("extrasBlock").style.display=isDrink?"none":"block";
  selectedSize="Grande";
  document.querySelectorAll(".extra").forEach(e=>e.checked=false);
  document.getElementById("halfToggle").checked=false;
  const sel = document.getElementById("halfFlavorSelect");
  sel.disabled=true;
  sel.innerHTML='<option value="">Escolha o segundo sabor</option>'+products.filter(p=>p.cat!=="bebida"&&p.id!==id).map(p=>`<option value="${p.id}">${p.name}</option>`).join("");
  document.getElementById("sizeOptions").innerHTML = Object.entries(sizes).map(([name,extra])=>`<button class="size-option ${name==="Grande"?"active":""}" data-size="${name}"><strong>${name}</strong><br><small>${extra?`+ ${money(extra)}`:"Preço base"}</small></button>`).join("");
  document.querySelectorAll(".size-option").forEach(b=>b.addEventListener("click",()=>{selectedSize=b.dataset.size;document.querySelectorAll(".size-option").forEach(x=>x.classList.toggle("active",x===b));updateModalPrice();}));
  document.getElementById("productModal").classList.add("show");
}
document.getElementById("halfToggle").addEventListener("change",e=>{document.getElementById("halfFlavorSelect").disabled=!e.target.checked;updateModalPrice();});
document.getElementById("halfFlavorSelect").addEventListener("change",updateModalPrice);
document.querySelectorAll(".extra").forEach(e=>e.addEventListener("change",updateModalPrice));

function productPrice(){
  if(!current) return 0;
  if(current.cat==="bebida") return current.base;
  let price=current.base+sizes[selectedSize];
  const halfId=Number(document.getElementById("halfFlavorSelect").value);
  if(document.getElementById("halfToggle").checked && halfId){
    const other=products.find(p=>p.id===halfId);
    price=Math.max(current.base,other.base)+sizes[selectedSize];
  }
  document.querySelectorAll(".extra:checked").forEach(e=>price+=Number(e.dataset.price));
  return price;
}
function updateModalPrice(){document.getElementById("modalPrice").textContent=money(productPrice())}
function closeModal(){document.getElementById("productModal").classList.remove("show")}
document.getElementById("closeModalBtn").addEventListener("click",closeModal);
document.getElementById("productModal").addEventListener("click",e=>{if(e.target.id==="productModal")closeModal()});

document.getElementById("addToCartBtn").addEventListener("click",()=>{
  if(!current)return;
  const halfId=Number(document.getElementById("halfFlavorSelect").value);
  const halfEnabled=document.getElementById("halfToggle").checked;
  if(halfEnabled && !halfId){alert("Escolha o segundo sabor para montar meio a meio.");return;}
  const other=products.find(p=>p.id===halfId);
  const extras=[...document.querySelectorAll(".extra:checked")].map(e=>e.dataset.name);
  cart.push({
    key:Date.now()+Math.random(),
    name: halfEnabled?`${current.name} / ${other.name}`:current.name,
    size: current.cat==="bebida"?"":selectedSize,
    extras,
    price:productPrice()
  });
  closeModal(); updateCart(); openCart();
});

function updateCart(){
  document.getElementById("cartCount").textContent=cart.length;
  const wrap=document.getElementById("cartItems");
  if(!cart.length) wrap.innerHTML='<div class="cart-empty">Seu carrinho está vazio.</div>';
  else wrap.innerHTML=cart.map(item=>`
    <div class="cart-item">
      <div class="cart-item-top"><div><strong>${item.name}</strong><small>${item.size}${item.extras.length?` • ${item.extras.join(", ")}`:""}</small></div><strong>${money(item.price)}</strong></div>
      <button class="remove-btn" onclick="removeItem('${item.key}')">Remover</button>
    </div>`).join("");
  const subtotal=cart.reduce((s,i)=>s+i.price,0);
  const delivery=document.querySelector('input[name="delivery"]:checked').value;
  const fee=delivery==="Entrega" && cart.length ? 6 : 0;
  document.getElementById("subtotal").textContent=money(subtotal);
  document.getElementById("deliveryFee").textContent=money(fee);
  document.getElementById("total").textContent=money(subtotal+fee);
}
window.removeItem=(key)=>{cart=cart.filter(i=>String(i.key)!==String(key));updateCart();}
document.querySelectorAll('input[name="delivery"]').forEach(r=>r.addEventListener("change",()=>{
  document.getElementById("customerAddress").style.display=r.checked&&r.value==="Retirada"?"none":"block";
  updateCart();
}));

function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("backdrop").classList.add("show")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("backdrop").classList.remove("show")}
document.getElementById("openCartBtn").addEventListener("click",openCart);
document.getElementById("closeCartBtn").addEventListener("click",closeCart);
document.getElementById("backdrop").addEventListener("click",closeCart);

document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){alert("Adicione pelo menos um item ao carrinho.");return;}
  const name=document.getElementById("customerName").value.trim()||"Cliente";
  const phone=document.getElementById("customerPhone").value.trim()||"Não informado";
  const delivery=document.querySelector('input[name="delivery"]:checked').value;
  const address=document.getElementById("customerAddress").value.trim()||"Não informado";
  const note=document.getElementById("customerNote").value.trim()||"Sem observações";
  const subtotal=cart.reduce((s,i)=>s+i.price,0);
  const fee=delivery==="Entrega"?6:0;
  const lines=cart.map((i,n)=>`${n+1}. ${i.name}${i.size?` (${i.size})`:""}${i.extras.length?`\n   Adicionais: ${i.extras.join(", ")}`:""} — ${money(i.price)}`).join("\n");
  const msg=`🍕 *PEDIDO — BELLA MASSA*\n\nCliente: ${name}\nTelefone: ${phone}\nTipo: ${delivery}${delivery==="Entrega"?`\nEndereço: ${address}`:""}\n\n*Itens:*\n${lines}\n\nSubtotal: ${money(subtotal)}\nTaxa: ${money(fee)}\n*Total: ${money(subtotal+fee)}*\n\nObservações: ${note}\n\nPedido enviado pelo cardápio digital demonstrativo da WAP Consultoria Digital.`;
  // Número fictício. Troque pelo WhatsApp real do cliente.
  const whatsappNumber="5511999999999";
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,"_blank");
});

renderProducts(); updateCart();
