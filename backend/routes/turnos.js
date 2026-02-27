const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/storage');

const TURNOS_FILE = 'turnos.json';
const CLIENTES_FILE = 'clientes.json';

const HORARIOS = [
  '09:00', '09:45', '10:30', '11:15', '12:00', 
  '12:45', '14:00', '14:45', '15:30', '16:15', '17:00', '17:45'
];

router.get('/', (req, res) => {
  const turnos = readJSON(TURNOS_FILE);
  res.json(turnos);
});

router.get('/disponibles', (req, res) => {
  const { fecha } = req.query;
  if (!fecha) {
    return res.status(400).json({ error: 'Fecha requerida' });
  }

  const turnos = readJSON(TURNOS_FILE);
  const ocupados = turnos
    .filter(t => t.fecha === fecha && t.estado !== 'cancelado')
    .map(t => t.hora);

  const disponibles = HORARIOS.filter(h => !ocupados.includes(h));
  res.json(disponibles);
});

router.post('/', (req, res) => {
  const { clienteNombre, clienteEmail, clienteTelefono, servicio, servicioId, fecha, hora, notas, origen } = req.body;

  if (!clienteNombre || !clienteEmail || !clienteTelefono || !servicio || !fecha || !hora) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const clientes = readJSON(CLIENTES_FILE);
  let cliente = clientes.find(c => c.email === clienteEmail);

  if (!cliente) {
    cliente = {
      id: uuidv4(),
      nombre: clienteNombre,
      email: clienteEmail,
      telefono: clienteTelefono,
      notasInternas: '',
      estado: 'cliente',
      origen: origen || 'web',
      valorTotalManual: 0,
      creadoEn: new Date().toISOString()
    };
    clientes.push(cliente);
    writeJSON(CLIENTES_FILE, clientes);
  } else {
    const clienteIndex = clientes.findIndex(c => c.email === clienteEmail);
    clientes[clienteIndex].nombre = clienteNombre;
    clientes[clienteIndex].telefono = clienteTelefono;
    if (clientes[clienteIndex].estado === 'lead') {
      clientes[clienteIndex].estado = 'cliente';
    }
    writeJSON(CLIENTES_FILE, clientes);
    cliente = clientes[clienteIndex];
  }

  const turnos = readJSON(TURNOS_FILE);
  const nuevoTurno = {
    id: uuidv4(),
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    clienteEmail: cliente.email,
    clienteTelefono: cliente.telefono,
    servicio,
    servicioId,
    fecha,
    hora,
    estado: 'pendiente',
    notas: notas || '',
    creadoEn: new Date().toISOString()
  };

  turnos.push(nuevoTurno);
  writeJSON(TURNOS_FILE, turnos);

  res.status(201).json(nuevoTurno);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const turnos = readJSON(TURNOS_FILE);
  const index = turnos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Turno no encontrado' });
  }

  if (estado) {
    turnos[index].estado = estado;
  }

  writeJSON(TURNOS_FILE, turnos);
  res.json(turnos[index]);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const turnos = readJSON(TURNOS_FILE);
  const index = turnos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Turno no encontrado' });
  }

  turnos.splice(index, 1);
  writeJSON(TURNOS_FILE, turnos);

  res.status(204).send();
});

module.exports = router;
