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


    closeModal(); // ao final de tudo, fechar o modal
});
