<template>
  <div class="container-fluid py-4 px-md-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h2 class="text-center bg-primary-subtle mb-1 py-1">Gestión de Tareas</h2>
        <hr class="border-primary border-2">
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="row g-4">
      <!-- Formulario -->
      <div class="col-12 col-lg-5">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">{{ editando ? 'Editar Tarea' : 'Nuevo Tarea' }}</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="addTarea" class="row g-3">
              <!-- ID -->
              <div class="col-12" v-if="nuevaTarea.id">
                <label for="id" class="form-label fw-semibold">ID:</label>
                <input
                  type="number"
                  id="id"
                  v-model="nuevaTarea.id"
                  disabled
                  class="form-control-plaintext"
                />
              </div>

              <!-- Fecha -->
              <div class="col-12">
                <label for="fecha" class="form-label">Fecha:</label>
                <input
                  type="date"
                  id="fecha"
                  v-model="nuevaTarea.fecha"
                  class="form-control"
                  required
                />
              </div>

              <!-- Titulo -->
              <div class="col-12">
                <label for="titulo" class="form-label">Título:</label>
                <input
                  type="text"
                  id="titulo"
                  v-model="nuevaTarea.titulo"
                  class="form-control"
                  placeholder="Título de la tarea"
                  required
                />
              </div>

              <!-- Descripción -->
              <div class="col-12">
                <label for="descripcion" class="form-label">Descripción:</label>
                <textarea
                  id="descripcion"
                  v-model="nuevaTarea.descripcion"
                  @blur="capitalizarTexto('descripcion')"
                  class="form-control"
                  placeholder="Breve descripción"
                />
              </div>

              <!-- Estado -->
              <div class="col-12">
                <label for="estado" class="form-label">Estado:</label>
                <select
                  id="estado"
                  v-model="nuevaTarea.estado"
                  class="form-select"
                  required
                >
                  <option disabled value="">-- Seleccione el estado --</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En proceso</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>

              <!-- Prioridad -->
              <div class="col-12">
                <label class="form-label">Prioridad:</label>
                <div class="d-flex gap-3">
                  <div class="form-check">
                    <input 
                      type="radio" 
                      id="baja" 
                      value="baja" 
                      v-model="nuevaTarea.prioridad" 
                      class="form-check-input"
                    />
                    <label class="form-check-label" for="baja">
                      Baja
                    </label>
                  </div>
                  <div class="form-check">
                    <input 
                      type="radio" 
                      id="media" 
                      value="media" 
                      v-model="nuevaTarea.prioridad" 
                      class="form-check-input"
                    />
                    <label class="form-check-label" for="media">
                      Media
                    </label>
                  </div>
                  <div class="form-check">
                    <input 
                      type="radio" 
                      id="alta" 
                      value="alta" 
                      v-model="nuevaTarea.prioridad" 
                      class="form-check-input"
                    />
                    <label class="form-check-label" for="alta">
                      Alta
                    </label>
                  </div>
                </div>
              </div>

              <!-- Empleado -->
              <div class="col-12">
                <label for="empleadoId" class="form-label">Empleado (ID):</label>
                <div class="input-group">
                  <input 
                    id="empleadoId"
                    type="number" 
                    v-model.number="nuevaTarea.empleadoId" 
                    :class="{
                      'form-control': true,
                      'bg-warning': empleadoValidado === 'encontrado',
                      'bg-danger text-white': empleadoValidado === 'no_encontrado'
                    }"
                    min="1"
                    placeholder="Ingrese ID del empleado"
                  />
                  <button 
                    type="button" 
                    class="btn btn-outline-primary"
                    @click="buscarEmpleado"
                  >
                    <i class="bi bi-search"></i> Buscar
                  </button>
                </div>
              </div>

              <!-- Buttons -->
              <div class="col-12 d-flex gap-2">
                <button type="submit" class="btn btn-primary flex-grow-1">
                  {{ editando ? 'Actualizar' : 'Guardar' }}
                </button>
                <button
                  v-if="editando"
                  type="button"
                  @click="recargarForm"
                  class="btn btn-outline-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="col-12 col-lg-7">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Listado de Tareas</h5>
            <span class="badge bg-light text-dark">{{ getTarea().length }}</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-sm table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="fw-semibold">Fecha</th>
                    <th class="fw-semibold">Título</th>
                    <th class="fw-semibold">Descripción</th>
                    <th class="fw-semibold">Estado</th>
                    <th class="fw-semibold">Prioridad</th>
                    <th class="fw-semibold">Empleado</th>
                    <th class="text-center fw-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="tarea in getTarea()" :key="tarea.id">
                    <td class="align-middle">{{ tarea.fecha }}</td>
                    <td class="align-middle">{{ tarea.titulo }}</td>
                    <td class="align-middle">{{ tarea.descripcion }}</td>
                    <td class="align-middle">
                      <span 
                        class="badge"
                        :class="getClaseEstado(tarea.estado)"
                      >
                        {{ tarea.estado }}
                      </span>
                    </td>
                    <td class="align-middle">{{ tarea.prioridad }}</td>
                    <td class="align-middle">{{ getNombreEmpleado(tarea.empleadoId) }}</td>
                    <td class="text-center align-middle">
                      <div class="d-flex justify-content-center gap-2">
                        <button
                          @click="selTarea(tarea.id)"
                          class="btn btn-sm btn-primary"
                          title="Editar tarea"
                          aria-label="Editar tarea"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          @click="delTarea(tarea.id)"
                          class="btn btn-sm btn-danger"
                          title="Eliminar tarea"
                          aria-label="Eliminar tarea"
                        >
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Empty State -->
            <div v-if="getTarea().length === 0" class="text-center py-5 text-muted">
              <p class="mb-0">No hay tareas registradas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import Swal from 'sweetalert2';

  // =============== Declaración de variables ===============
  
    const arrayTareas = ref([
      {
        id: 1,
        fecha: '2024-06-01',
        titulo: 'Revisión de contratos',
        descripcion: 'Revisar los contratos de los proveedores para el próximo trimestre.',
        estado: 'pendiente',
        prioridad: 'alta',
        empleadoId: 1
      },
      {
        id: 2,
        fecha: '2024-06-05',
        titulo: 'Actualización de software',
        descripcion: 'Actualizar el software de gestión a la última versión.',
        estado: 'en_proceso',
        prioridad: 'media',
        empleadoId: 2
      }
    ]);

    const arrayEmpleados = ref([
      {
        id: 1,
        apellidos: 'García López',
        nombre: 'Juan',
        email: 'juan.garcia@empresa.com',
        movil: '612345678',
        puesto: 'RRHH'
      },
      {
        id: 2,
        apellidos: 'Martínez Rodríguez',
        nombre: 'María',
        email: 'maria.martinez@empresa.com',
        movil: '623456789',
        puesto: 'Contabilidad'
      },
      {
        id: 3,
        apellidos: 'Fernández Díaz',
        nombre: 'Carlos',
        email: 'carlos.fernandez@empresa.com',
        movil: '634567890',
        puesto: 'Almacén'
      },
      {
        id: 4,
        apellidos: 'López Sánchez',
        nombre: 'Ana',
        email: 'ana.lopez@empresa.com',
        movil: '645678901',
        puesto: 'Ventas'
      },
      {
        id: 5,
        apellidos: 'González Torres',
        nombre: 'Pedro',
        email: 'pedro.gonzalez@empresa.com',
        movil: '656789012',
        puesto: 'RRHH'
      }
    ]);

    const nuevaTarea = ref({
      id: 1,
      fecha: '',
      titulo: '',
      descripcion: '',
      estado: '',
      prioridad: '', // baja | media | alta (radiobutton)
      empleadoId: 0  // id del empleado seleccionado en amarillo
    });

    const editando = ref(false);
    const empleadoValidado = ref(''); // '' | 'encontrado' | 'no_encontrado'

    onMounted(async () => {
      recargarForm();
    })

  // =============== Funciones CRUD ===============

    const addTarea = async () => {
      if (!nuevaTarea.value.id) {
        nuevaTarea.value.id = ultimoID() + 1;
      }

      // Buscar si existe para actualizar
      const indice = arrayTareas.value.findIndex(t => t.id === nuevaTarea.value.id);
      if (indice !== -1) {
        arrayTareas.value[indice] = { ...nuevaTarea.value };
        recargarForm();
        return;
      }

      // Si no existe, añadir nuevo
      arrayTareas.value.push({ ...nuevaTarea.value });
      recargarForm();
    }

    const getTarea = () => {
      return arrayTareas.value;
    }

    const selTarea = async (id) => {
      const tarea = arrayTareas.value.find((e) => e.id === id);
      if (tarea) {
        nuevaTarea.value = { ...tarea };
        editando.value = true;
      }
    }

    const delTarea = async (id) => {
      arrayTareas.value = arrayTareas.value.filter((e) => e.id !== id);
    }

    // Obtener nombre del empleado para mostrar en la tabla
    const getNombreEmpleado = (empleadoId) => {
      const empleado = arrayEmpleados.value.find((e) => e.id === empleadoId);
      return empleado ? `${empleado.apellidos} ${empleado.nombre}` : 'N/A';
    }

    const getClaseEstado = (estado) => {
      switch(estado) {
        case 'pendiente':
          return 'bg-danger text-white';
        case 'en_proceso':
          return 'bg-warning text-dark';
        case 'finalizada':
          return 'bg-success text-white';
        default:
          return 'bg-secondary text-white';
      }
    }

  // =============== Funciones Auxiliares ===============

    // Capitalización del Texto
      const capitalizarTexto = (campo) => {
        const texto = nuevaTarea.value[campo] ?? '';
        nuevaTarea.value[campo] = texto
        .toLowerCase()
        .split(' ')
        .map(palabra => {
          if (!palabra) return '';
          return palabra.charAt(0).toLocaleUpperCase() + palabra.slice(1);
        })
        .join(' ');
      };

    // Recargar formulario
    function recargarForm() {
      nuevaTarea.value = {
        id: '',
        fecha: '',
        titulo: '',
        descripcion: '',
        estado: '',
        prioridad: '',
        empleadoId: 0
      };
      editando.value = false;
      empleadoValidado.value = '';
    }

    const ultimoID = () => {
      return arrayTareas.value.length
    }

    // Buscar empleado y validar
    const buscarEmpleado = async () => {
      if (nuevaTarea.value.empleadoId === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Por favor',
          text: 'Seleccione un empleado antes de buscar',
          confirmButtonColor: '#0d6efd'
        });
        empleadoValidado.value = '';
        return;
      }

      const empleado = arrayEmpleados.value.find(e => e.id === nuevaTarea.value.empleadoId);
      
      if (empleado) {
        empleadoValidado.value = 'encontrado';
        Swal.fire({
          icon: 'success',
          title: '¡Empleado encontrado!',
          html: `
            <div style="text-align: left;">
              <p><strong>Nombre:</strong> ${empleado.nombre}</p>
              <p><strong>Apellidos:</strong> ${empleado.apellidos}</p>
              <p><strong>Email:</strong> ${empleado.email}</p>
              <p><strong>Móvil:</strong> ${empleado.movil}</p>
              <p><strong>Puesto:</strong> ${empleado.puesto}</p>
            </div>
          `,
          confirmButtonColor: '#0d6efd'
        });
      } else {
        empleadoValidado.value = 'no_encontrado';
        nuevaTarea.value.empleadoId = 0;
        Swal.fire({
          icon: 'error',
          title: 'Empleado no encontrado',
          text: 'No se encontró el empleado seleccionado en el sistema',
          confirmButtonColor: '#0d6efd'
        });
      }
    }

</script>

<style scoped>
/* =============== Tabla =============== */
.table {
  font-size: 0.95rem;
}

.table thead th {
  padding: 0.75rem;
}

.table tbody td {
  padding: 0.75rem;
}

.table-responsive {
  max-height: 600px;
  overflow-y: auto;
}

/* =============== Responsive Design =============== */
@media (max-width: 1199px) {
  .card-header {
    padding: 0.875rem;
  }

  .card-body {
    padding: 1.25rem;
  }
}

@media (max-width: 991px) {
  h1 {
    font-size: 1.75rem;
  }

  .row.g-4 {
    gap: 2rem !important;
  }

  .table-responsive {
    max-height: 500px;
  }

  .table {
    font-size: 0.9rem;
  }

  .table thead th {
    padding: 0.65rem 0.5rem;
    font-size: 0.8rem;
  }

  .table tbody td {
    padding: 0.65rem 0.5rem;
  }

  .btn-sm {
    padding: 0.3rem 0.55rem;
    font-size: 0.8rem;
  }

  .form-label {
    font-size: 0.9rem;
  }

  .form-control,
  .form-select {
    font-size: 0.9rem;
    padding: 0.55rem 0.75rem;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }

  .px-md-4 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  .card-header {
    padding: 0.75rem;
  }

  .card-body {
    padding: 1rem;
  }

  .table-responsive {
    max-height: 400px;
  }

  .table {
    font-size: 0.85rem;
  }

  .table thead th {
    padding: 0.5rem 0.4rem;
    font-size: 0.75rem;
  }

  .table tbody td {
    padding: 0.5rem 0.4rem;
  }

  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }

  .me-2 {
    margin-right: 0.25rem !important;
  }

  .form-label {
    font-size: 0.85rem;
  }

  .form-control,
  .form-select {
    font-size: 0.85rem;
    padding: 0.5rem 0.65rem;
  }

  .row.g-3 {
    gap: 1rem !important;
  }

  .d-flex.gap-2 {
    gap: 0.5rem !important;
  }
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem !important;
  }

  .py-4 {
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
  }

  .mb-4 {
    margin-bottom: 1.5rem !important;
  }

  .g-4 {
    gap: 1.5rem !important;
  }

  .card {
    border-radius: 0.375rem;
  }

  .card-header {
    padding: 0.65rem;
    font-size: 0.95rem;
  }

  .card-body {
    padding: 0.875rem;
  }

  .table {
    font-size: 0.8rem;
  }

  .table thead th {
    padding: 0.4rem 0.3rem;
    font-size: 0.7rem;
  }

  .table tbody td {
    padding: 0.4rem 0.3rem;
  }

  .btn {
    font-size: 0.75rem;
    padding: 0.3rem 0.5rem;
  }

  .btn-sm {
    padding: 0.2rem 0.4rem;
    font-size: 0.7rem;
  }

  .form-label {
    font-size: 0.8rem;
    margin-bottom: 0.35rem;
  }

  .form-control,
  .form-select {
    font-size: 0.8rem;
    padding: 0.45rem 0.6rem;
  }

  .badge {
    padding: 0.3rem 0.5rem;
    font-size: 0.75rem;
  }

  .row.g-3 {
    gap: 0.75rem !important;
  }

  .d-flex.gap-2 {
    gap: 0.35rem !important;
  }

  .flex-grow-1 {
    flex-grow: 1 !important;
  }

  .text-center {
    padding: 1.5rem 0.5rem;
  }

  .text-center p {
    font-size: 0.85rem;
  }
}
</style>