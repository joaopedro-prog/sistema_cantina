const os = require('os');

// Obtém uma lista de interfaces de rede
const interfaces = os.networkInterfaces();

// Itera sobre as interfaces de rede para encontrar o endereço IPv4 não local
let enderecoIP;
Object.keys(interfaces).forEach((interfaceName) => {
    const interfaceInfo = interfaces[interfaceName];
    interfaceInfo.forEach((info) => {
        if (!info.internal && info.family === 'IPv4') {
            enderecoIP = info.address;
        }
    });
});

const LocalIp = enderecoIP;
console.log(LocalIp);

module.exports = {
    LocalIp
};