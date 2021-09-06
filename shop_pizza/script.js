let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el)=> document.querySelector(el);
const cs = (el)=> document.querySelectorAll(el);


pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // prencher as informações em pizza-item

    // Setou(adicionou) valores em cada item da pizza.
    pizzaItem.setAttribute('data-key', index);

    // Add imagens pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    // Add valores das pizzas
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$: ${item.price.toFixed(2)}`;

    //Add Nome das pizzas
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

    //Add desc das pizzas
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;


    // Evento de ação ao clicar na pizza desejada
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        // Previnir a ação padrão
        e.preventDefault();

        //Procura o elemento mais proximo do nome(pizza-item) e logo depois adiciona as keys de 'data-key'
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt = 1;
        modalKey = key;

        

        //prenchendo info do modal das pizzas//

        // Imagem maior
        c('.pizzaBig img').src = pizzaJson[key].img;
        // Titulo da pizza (nome)
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        // Descrição da pizza
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        // Preço
        c('.pizzaInfo--actualPrice').innerHTML = `R$: ${pizzaJson[key].price.toFixed(2)}`
        //Descelicionando o item(tamanho da pizza)
        c('.pizzaInfo--size.selected').classList.remove('selected')


        // Prenchendo as infos dos tamanhos(Kg) da pizzas
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });


        c('.pizzaInfo--qt').innerHTML = modalQt;
        

        //prenchendo info do modal das pizzas//
        

        //Abrir o modal (menu da pizza selecionada)
        
        // Mudou o style de 'none' para 'flex'
        c('.pizzaWindowArea').style.display = 'flex';

        // velocidade da opacidade do (menu da piza selecionada)
        c('.pizzaWindowArea').style.opacity = 0;
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });
    // velocidade da opacidade do (menu da piza selecionada)


    // prencher as informações em pizza-item
    c('.pizza-area').append( pizzaItem );

});

// Eventos do modal

// fechar modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
});


// botão adicionar e remover pizzas


    //Adicionar
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

    //Remover
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt >1){
        modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }    
});



//Seleção de 'clicks' em tamanhos
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});


//add itens no carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size =  parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    
    //Identificador de id e size
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);
    
    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        //Adicionando
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id, //id da pizza
            size, //tamanho da pizza
            qt:modalQt // quantidade
        });
    }

    updateCart();// Atualizando o carrinho
    closeModal(); // ao final de tudo, fechar o modal
});


c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart(){
    //mobile
    c('.menu-openner span').innerHTML = cart.length;
    //mobile


    if(cart.length > 0){
        c('aside').classList.add('show'); //Mostrando carrinho
        c('.cart').innerHTML = ''; //zerando e mostrando

        //Somas:

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);

            subtotal += pizzaItem.price * cart[i].qt;



            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;    
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;

            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;

            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //ACÕES

            //remove
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }

                updateCart();
            });
            //add
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            


            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw'; 
        // fechando carrinho
    }
};