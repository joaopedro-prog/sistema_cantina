var LocalIp = "192.168.18.150";

const jsonFileUrl = `http://${LocalIp}:3000/pedidos`;
const localIpUrl = `http://${LocalIp}:3000/localIp`;


async function loadJSON(url) {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}


function createDivsFromJSON(jsonData) {
    var container = document.getElementById('pedidos-divs');
    while(container.firstChild){
        container.removeChild(container.firstChild);
    }
    
    var numeroDeElementos = Object.keys(jsonData).length;    
    // console.log(jsonData);
    jsonData.forEach(element => {
        var elementId = element.Id;
        if (element.Entregue == 0){
            const mainDiv = document.createElement('div');
            mainDiv.classList.add("order-main-div");

            const secondaryDiv = document.createElement('div');
            secondaryDiv.classList.add("order-secondary-div");

            const idtext = document.createElement('h3');

            const TitleDiv = document.createElement('div');
            TitleDiv.classList.add("order-title-div");

            const buttonDiv = document.createElement('div');
            buttonDiv.classList.add("order-button-div");

            const productsDiv = document.createElement('div');
            productsDiv.classList.add("order-products-div");

            const orderName = document.createElement('h3');
            orderName.textContent = `${element.Nome}`;

            const hourText = document.createElement('legend');
            hourText.classList.add("hour-text");
            hourText.textContent = `${element.Data}`;

            const mainList = document.createElement('ul');

            for (var chave in element) {
                try{

                    if (chave !== "Nome" && chave !== "Id" && chave !== "PrecoTotal" && chave !== "Entregue" && element.Id == elementId) {
                        // console.log(chave);
                            if(element[chave]>0){
                                var itemLista = document.createElement("li");
                                itemLista.textContent = + element[chave] +"x - "+ chave;
                                mainList.appendChild(itemLista);
                            }
                    }
                }catch{
                    console.error("Não Tem preço total em uma das coisas aí")
                }
            }

            const orderPrice = document.createElement('h4');
            orderPrice.textContent = `${element.PrecoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                
            const entregueButton = document.createElement('button');
            entregueButton.textContent = "Entregue";
        
            TitleDiv.appendChild(orderName);
            TitleDiv.appendChild(orderPrice);

            productsDiv.appendChild(mainList);

            buttonDiv.appendChild(entregueButton);

            secondaryDiv.appendChild(TitleDiv);
            secondaryDiv.appendChild(productsDiv);
            secondaryDiv.appendChild(hourText);
            mainDiv.appendChild(secondaryDiv);
            mainDiv.appendChild(buttonDiv);
            container.appendChild(mainDiv);

            entregueButton.addEventListener("click",function(){
                fetch(`http://${LocalIp}:3000/atualizarPedido`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Id: element.Id,
                        Entregue: 1
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Não foi possível atualizar o JSON.');
                    }
                    console.log('JSON atualizado com sucesso!');
                })
                .catch(error => {
                    console.error('Erro ao atualizar o JSON:', error);
                });
            
                
            })

        }

        
        
    });
    var semPedidos = jsonData.every(element => element.Entregue === 1);
    if(semPedidos || numeroDeElementos == 0){
        const noOrders = document.getElementById('no-orders');
        noOrders.style.display = "flex";
        
    }
}

function updateEverySecond() {
    loadJSON(jsonFileUrl)
    .then(data => {
        createDivsFromJSON(data);
    })
    .catch(error => {
        console.error('Erro ao carregar o JSON:', error);
    });

    setInterval(() => {
        loadJSON(jsonFileUrl)
    .then(data => {
        createDivsFromJSON(data);
    })
    .catch(error => {
        console.error('Erro ao carregar o JSON:', error);
    });
    }, 1000);
}

updateEverySecond();



function sendData(jsonData){
    data['Nome'] = nameInput.value;

    // Enviar dados para o servidor
    fetch(`http://${LocalIp}:3000/addData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
            }).then(response => {
                console.log('Dados enviados com sucesso');     
            }).catch(error => {
                console.error('Erro ao enviar dados:', error);
                alert('Erro ao enviar dados:', error);
    });
}