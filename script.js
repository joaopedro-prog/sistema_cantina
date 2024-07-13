var LocalIp = "192.168.18.150";

const ordersUrl = `http://${LocalIp}:3000/pedidos`;
const jsonFileUrl = `http://${LocalIp}:3000/produtos`;
const localIpUrl = `http://${LocalIp}:3000/localIp`;
const currentTimeUrl = `http://${LocalIp}:3000/data`;

var ProductQuantity = [];
var Prices = [];
var TotalPrice = 0;
var data = {"Nome":""};
var Id = 0;
clientName = "Sem nome"; 
var currentTime = "";

async function loadJSON(url) {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

window.addEventListener('load',function(){
    
    divTroco.style.display = 'none';
})

function loadlocalIp(localIpUrl) {
    return fetch(localIpUrl) // Faz uma solicitação GET para a URL fornecida
        .then(response => {
            if (!response.ok) {
                throw new Error('Não foi possível obter o IP local.');
            }
            return response.text(); // Retorna o conteúdo da resposta como texto
        })
        .then(ipData => {
            const trimmedIp = ipData.trim();
            const ipAddress = trimmedIp.match(/\d+\.\d+\.\d+\.\d+/); // Extrai o endereço IP usando expressão regular
            if (ipAddress) {
                return ipAddress[0]; // Retorna o endereço IP encontrado
            } else {
                throw new Error('Não foi possível encontrar um endereço IP válido.');
            }
        });
}


function createProductJsonVariables(jsonData){
    ProductQuantity = jsonData.map(element => [element.titulo, 0]);
    console.log(ProductQuantity);
}

const totalPriceText = document.getElementById('total');
const paymentMethodText = document.getElementById('payment-method-text');
window.addEventListener("click",function(){
    totalPriceText.textContent = TotalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    paymentMethodText.textContent = paymentMethod;
})

const nameInput = document.getElementById("client-name");
nameInput.addEventListener("change",function(){
    clientName = nameInput.value;

});

function createDivsFromJSON(jsonData) {
    var container = document.getElementById('product-cards');

    
    jsonData.forEach(element => {
        data[element.titulo] = 0;
        var div = document.createElement('div');
        div.classList.add('card')

        var user_input_div = document.createElement('div');
        user_input_div.classList.add('card-input');
        
        var quantity_div = document.createElement('div');
        quantity_div.classList.add('card-quantity');

        var productName = document.createElement('span');
        productName.textContent = element.titulo;

        var plusButton = document.createElement('button');
        var minusButton = document.createElement('button');
        plusButton.textContent = "+";
        minusButton.textContent = "-";

        var quantityText = document.createElement('span');
        quantityText.textContent = "0";

        plusButton.addEventListener("click",function(){
            const searchString = element.titulo;

            let rowIndex = -1;
            let colIndex = -1;

            for (let i = 0; i < ProductQuantity.length; i++) {
                const indexInRow = ProductQuantity[i].indexOf(searchString);
                if (indexInRow !== -1) {
                    rowIndex = i;
                    colIndex = indexInRow;
                    break;
                }
            }

            ProductQuantity[rowIndex][1] = ProductQuantity[rowIndex][1] + 1
            Prices[rowIndex] = ProductQuantity[rowIndex][1] * element.preco;
            TotalPrice = Prices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            data[element.titulo] = ProductQuantity[rowIndex][1];
            quantityText.textContent = ProductQuantity[rowIndex][1];

            })
        minusButton.addEventListener("click",function(){
            const searchString = element.titulo;

            let rowIndex = -1;
            let colIndex = -1;

            for (let i = 0; i < ProductQuantity.length; i++) {
                const indexInRow = ProductQuantity[i].indexOf(searchString);
                if (indexInRow !== -1) {
                    rowIndex = i;
                    colIndex = indexInRow;
                    break;
                }
            }
            if (ProductQuantity[rowIndex][1] > 0){
                ProductQuantity[rowIndex][1] = ProductQuantity[rowIndex][1] - 1
            }
            Prices[rowIndex] = ProductQuantity[rowIndex][1] * element.preco;
            TotalPrice = Prices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

            data[element.titulo] = ProductQuantity[rowIndex][1];
            quantityText.textContent = ProductQuantity[rowIndex][1];

            })


        div.appendChild(productName);
        div.appendChild(quantity_div);
        div.append(user_input_div);

        quantity_div.appendChild(quantityText);

        user_input_div.append(plusButton);
        user_input_div.append(minusButton);
        container.appendChild(div);
    });
}

function sendDataButton(jsonData){
    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener("click",function(){
        if(TotalPrice>0){
            loadJSON(ordersUrl)
            .then(pedidosData => {
                Id = Object.keys(pedidosData).length + 1;
                sendData(jsonData,Object.keys(pedidosData).length + 1);
            })
            .catch(error =>{
                console.error('Erro ao carregar o Id',error)
            });
        }else{
            alert("Adicione algum produto antes!");
        }
        
    });
}

// Função para enviar o IP
function sendIp(ip) {
    console.log('IP encontrado:', ip);
}

loadlocalIp(localIpUrl)
    .then(ipData => {
        LocalIp = ipData;
        sendIp(ipData);
    })
    .catch(error => {
        console.error('Erro:', error);
    });

loadJSON(currentTimeUrl)
    .then(time =>{
        currentTime =time;
    }).catch(error=>{
        console.error("Erro ao acessar a data");
    })

loadJSON(jsonFileUrl)
    .then(data => {
        createDivsFromJSON(data);
        createProductJsonVariables(data);
        sendDataButton(data);
    })
    .catch(error => {
        console.error('Erro ao carregar o JSON:', error);
    });


function sendData(jsonData,id){

    data['Nome'] = nameInput.value;
    data["Entregue"] = 0;
    data["Id"]= id;
    data["Forma de Pagamento"]=paymentMethod;
    data["PrecoTotal"] = TotalPrice;
    data["Data"] = currentTime;

    // Enviar dados para o servidor
    fetch(`http://${LocalIp}:3000/addData`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
            }).then(response => {
                alert("Dados enviados com sucesso!");
                console.log('Dados enviados com sucesso');
            }).catch(error => {
                console.error('Erro ao enviar dados:', error);
                alert('Erro ao enviar dados:', error);
    });
}

var paymentMethod = "Pix";

const pixButton = document.getElementById('pix-button');
const dinheiroButton = document.getElementById('dinheiro-button');
const prazoButton = document.getElementById('prazo-button');
const divTroco = document.getElementById('troco-card');

pixButton.addEventListener("click",function(){
    paymentMethod="Pix"
    divTroco.style.display = 'none';
});

dinheiroButton.addEventListener("click",function(){
    paymentMethod="Dinheiro"
    divTroco.style.display = 'flex';

});
prazoButton.addEventListener("click",function(){
    paymentMethod="Prazo"
    divTroco.style.display = 'none';
});



const dinheiroRecebidoInput = document.getElementById('dinheiro-recebido');
const trocoText = document.getElementById('troco-text');

dinheiroRecebidoInput.addEventListener('input',function(){
    var dinheiroRecebido = dinheiroRecebidoInput.value;
    var troco = dinheiroRecebido-TotalPrice;
    trocoText.textContent = troco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });;
})
