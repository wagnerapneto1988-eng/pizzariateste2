
const WHATSAPP = "5511988555913";
const pizzas = [
  {id:1,nome:"Mussarela",cat:"classicas",desc:"Mussarela de qualidade e orégano especial.",preco:39.90,img:"assets/mussarela.jpg"},
  {id:2,nome:"Calabresa",cat:"classicas",desc:"Calabresa fatiada, cebola e orégano.",preco:41.90,img:"assets/calabresa.jpg"},
  {id:3,nome:"Portuguesa",cat:"especiais",desc:"Presunto, ovos, cebola, pimentão e azeitonas.",preco:42.90,img:"assets/portuguesa.jpg"},
  {id:4,nome:"Frango com Catupiry",cat:"especiais",desc:"Frango desfiado com catupiry e orégano.",preco:45.90,img:"assets/frango.jpg"},
  {id:5,nome:"Quatro Queijos",cat:"especiais",desc:"Mussarela, parmesão, gorgonzola e catupiry.",preco:49.90,img:"assets/frango.jpg"},
  {id:6,nome:"Lombo",cat:"especiais",desc:"Lombo canadense, cebola e orégano.",preco:43.90,img:"assets/lombo.jpg"},
  {id:7,nome:"Bacon",cat:"especiais",desc:"Bacon crocante com mussarela e orégano.",preco:44.90,img:"assets/bacon.jpg"},
  {id:8,nome:"Chocolate",cat:"doces",desc:"Chocolate ao leite com granulado.",preco:34.90,img:"assets/chocolate.jpg"},
];
let cart = [];

const money = v => v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function renderPizzas(filter="todas"){
  const grid = document.querySelector("#pizzaGrid");
  const list = filter==="todas" ? pizzas : pizzas.filter(p=>p.cat===filter);
  grid.innerHTML = list.map(p=>`
    <article class="card">
      <img src="${p.img}" alt="Pizza ${p.nome}">
      <div class="card-body">
        <h3>${p.nome}</h3>
        <p>${p.desc}</p>
        <div class="card-bottom"><span class="price">${money(p.preco)}</span><button class="add-btn" onclick="addToCart(${p.id})">+ ADICIONAR</button></div>
      </div>
    </article>`).join("");
}
function addToCart(id){
  const found = cart.find(i=>i.id===id);
  if(found) found.qtd++; else cart.push({...pizzas.find(p=>p.id===id),qtd:1});
  updateCart();
  openCart();
}
function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qtd += delta;
  if(item.qtd<=0) cart = cart.filter(i=>i.id!==id);
  updateCart();
}
function updateCart(){
  document.querySelector("#cartCount").textContent = cart.reduce((s,i)=>s+i.qtd,0);
  const box = document.querySelector("#cartItems");
  if(!cart.length) box.innerHTML = '<div class="empty">Seu carrinho está vazio 🍕</div>';
  else box.innerHTML = cart.map(i=>`
    <div class="cart-item">
      <div><b>${i.nome}</b><br><small>${money(i.preco)} cada</small></div>
      <div class="item-controls"><button onclick="changeQty(${i.id},-1)">−</button><b>${i.qtd}</b><button onclick="changeQty(${i.id},1)">+</button></div>
    </div>`).join("");
  document.querySelector("#cartTotal").textContent = money(cart.reduce((s,i)=>s+i.preco*i.qtd,0));
}
function openCart(){
  document.querySelector("#cartDrawer").classList.add("open");
  document.querySelector("#overlay").classList.add("show");
  document.querySelector("#cartDrawer").setAttribute("aria-hidden","false");
}
function closeCart(){
  document.querySelector("#cartDrawer").classList.remove("open");
  document.querySelector("#overlay").classList.remove("show");
  document.querySelector("#cartDrawer").setAttribute("aria-hidden","true");
}
document.querySelector("#openCart").onclick=openCart;
document.querySelector("#closeCart").onclick=closeCart;
document.querySelector("#overlay").onclick=closeCart;

document.querySelector("#filters").addEventListener("click",e=>{
  if(!e.target.matches("button")) return;
  document.querySelectorAll("#filters button").forEach(b=>b.classList.remove("active"));
  e.target.classList.add("active");
  renderPizzas(e.target.dataset.filter);
});
document.querySelector("#orderType").addEventListener("change",e=>{
  document.querySelector("#address").style.display = e.target.value==="Retirada" ? "none" : "block";
});
document.querySelector("#checkout").addEventListener("click",()=>{
  if(!cart.length){ alert("Adicione pelo menos uma pizza ao carrinho."); return; }
  const nome = document.querySelector("#customerName").value.trim() || "Cliente";
  const tipo = document.querySelector("#orderType").value;
  const endereco = document.querySelector("#address").value.trim();
  const pagamento = document.querySelector("#payment").value;
  const obs = document.querySelector("#notes").value.trim();
  const total = cart.reduce((s,i)=>s+i.preco*i.qtd,0);
  const itens = cart.map(i=>`• ${i.qtd}x ${i.nome} — ${money(i.preco*i.qtd)}`).join("\n");
  let msg = `🍕 *NOVO PEDIDO — BELLA MASSA*\n\n👤 *Cliente:* ${nome}\n\n${itens}\n\n💰 *Total:* ${money(total)}\n🚚 *Tipo:* ${tipo}`;
  if(tipo==="Entrega") msg += `\n📍 *Endereço:* ${endereco || "A confirmar"}`;
  msg += `\n💳 *Pagamento:* ${pagamento}`;
  if(obs) msg += `\n📝 *Observações:* ${obs}`;
  msg += `\n\nPedido enviado pelo cardápio digital.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,"_blank");
});
renderPizzas();
updateCart();
