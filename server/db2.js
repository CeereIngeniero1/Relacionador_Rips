// npm install tedious@latest
const { Connection, Request, TYPES } = require('tedious');
const fs = require('fs');

// Ruta completa al archivo CRInfo.ini
const filePath = 'C:/CeereSio/CRInfo.ini';

// Leer el contenido del archivo de manera síncrona
const fileContent = fs.readFileSync(filePath, 'utf-8');

// Buscar la línea que contiene "DataSource"
const dataSourceLine = fileContent.split('\n').find(line => line.includes('DataSource'));
const dataSourceValue = dataSourceLine.split('=')[1].split('\\')[0].trim();

// Buscar la línea que contiene exactamente Catalog
const CatalogLine = fileContent.split('\n').find(line => line.trim().startsWith('Catalog='));
const CatalogLineValue = CatalogLine.split('=')[1].split('\\')[0].trim();

console.log(CatalogLineValue);

const config = {
    server: dataSourceValue,
    authentication: {
        type: 'default',
        options: {
            userName: 'CeereRIPS',
            password: 'crsoft'
        }
    },
    options: { 
        port: 1433,
        database: CatalogLineValue,
        encrypt: false,
        requestTimeout: 30000000
    }
};

// Crear una conexión
const connection = new Connection(config);

connection.connect(err => {
    if (err) {
        console.error('Error al conectar:', err.message);
    } else {
        console.log('Conectado a la base de datos');
    }
});

// Exportar la conexión
module.exports = connection;
