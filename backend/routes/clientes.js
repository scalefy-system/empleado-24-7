const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/storage');
const { SERVICIOS } = require('./constantes');

const CLIENTES_FILE = 'clientes.json';
const TURNOS_FILE = 'turnos.json';

const getPrecioServicio = (servicioNombre) => {
  const servicio = SERVICIOS.find(s => s.nombre === servicioNombre);
  return servicio ? servicio.precio : 0;
};

const calcularValorTotal = (turnos) => {
  return turnos
    .filter(t => t.estado === 'confirmado')
    .reduce((sum, t) => sum + getPrecioServicio(t.servicio), 0);
};

router.get('/', (req, res) => {
  const clientes = readJSON(CLIENTES_FILE);
  const turnos = readJSON(TURNOS_FILE);

  const clientesConTurnos = clientes.map(cliente => {
    const turnosCliente = turnos.filter(t => t.clienteId === cliente.id);
    const valorTotalCalculado = calcularValorTotal(turnosCliente);
    const valorTotalManual = cliente.valorTotalManual || 0;
    return { 
      ...cliente, 
      turnos: turnosCliente,
      valorTotalCalculado,
      valorTotal: valorTotalManual > 0 ? valorTotalManual : valorTotalCalculado
    };
  });

  res.json(clientesConTurnos);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const clientes = readJSON(CLIENTES_FILE);
  const cliente = clientes.find(c => c.id === id);

  if (!cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  const turnos = readJSON(TURNOS_FILE);
  const turnosCliente = turnos.filter(t => t.clienteId === id);
  const valorTotalCalculado = calcularValorTotal(turnosCliente);
  const valorTotalManual = cliente.valorTotalManual || 0;

  res.json({ 
    ...cliente, 
    turnos: turnosCliente,
    valorTotalCalculado,
    valorTotal: valorTotalManual > 0 ? valorTotalManual : valorTotalCalculado
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { notasInternas, origen, valorTotalManual } = req.body;

  const clientes = readJSON(CLIENTES_FILE);
  const index = clientes.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  if (notasInternas !== undefined) {
    clientes[index].notasInternas = notasInternas;
  }
  if (origen !== undefined) {
    clientes[index].origen = origen;
  }
  if (valorTotalManual !== undefined) {
    clientes[index].valorTotalManual = valorTotalManual;
  }

  writeJSON(CLIENTES_FILE, clientes);
  
  const turnos = readJSON(TURNOS_FILE);
  const turnosCliente = turnos.filter(t => t.clienteId === id);
  const valorTotalCalculado = calcularValorTotal(turnosCliente);
  const valorTotal = (clientes[index].valorTotalManual || 0) > 0 
    ? clientes[index].valorTotalManual 
    : valorTotalCalculado;

  res.json({ 
    ...clientes[index], 
    turnos: turnosCliente,
    valorTotalCalculado,
    valorTotal
  });
});

module.exports = router;
