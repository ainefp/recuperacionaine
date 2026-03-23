<template>
  <div class="container-fluid py-4 px-md-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h2 class="text-center bg-primary-subtle mb-1 py-1">Gestión de Empleados</h2>
        <hr class="border-primary border-2">
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="row g-4">
      <!-- Formulario -->
      <div class="col-12 col-lg-5">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">{{ editando ? 'Editar Empleado' : 'Nuevo Empleado' }}</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="addEmpleado" class="row g-3">
              <!-- ID Field (Hidden if empty) -->
              <div class="col-12" v-if="nuevoEmpleado.id">
                <label for="id" class="form-label fw-semibold">ID:</label>
                <input
                  type="number"
                  id="id"
                  v-model="nuevoEmpleado.id"
                  disabled
                  class="form-control-plaintext"
                />
              </div>

              <!-- Apellidos Field -->
              <div class="col-12">
                <label for="apellidos" class="form-label">Apellidos:</label>
                <input
                  type="text"
                  id="apellidos"
                  v-model="nuevoEmpleado.apellidos"
                  @blur="capitalizarTexto('apellidos')"
                  class="form-control"
                  placeholder="Ej: García López"
                  required
                />
              </div>

              <!-- Nombre Field -->
              <div class="col-12">
                <label for="nombre" class="form-label">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  v-model="nuevoEmpleado.nombre"
                  @blur="capitalizarTexto('nombre')"
                  class="form-control"
                  placeholder="Ej: Juan"
                  required
                />
              </div>

              <!-- Email Field -->
              <div class="col-12">
                <label for="email" class="form-label">Email:</label>
                <input
                  type="email"
                  id="email"
                  v-model="nuevoEmpleado.email"
                  class="form-control"
                  placeholder="correo@empresa.com"
                  required
                />
              </div>

              <!-- Móvil Field -->
              <div class="col-12">
                <label for="movil" class="form-label">Móvil:</label>
                <input
                  type="text"
                  id="movil"
                  v-model="nuevoEmpleado.movil"
                  class="form-control"
                  placeholder="612345678"
                />
              </div>

              <!-- Puesto Dropdown -->
              <div class="col-12">
                <label for="puesto" class="form-label">Puesto:</label>
                <select
                  id="puesto"
                  v-model="nuevoEmpleado.puesto"
                  class="form-select"
                  required
                >
                  <option disabled value="">-- Seleccione puesto --</option>
                  <option value="RRHH">RRHH</option>
                  <option value="Contabilidad">Contabilidad</option>
                  <option value="Almacén">Almacén</option>
                  <option value="Ventas">Ventas</option>
                </select>
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
            <h5 class="mb-0">Listado de Empleados</h5>
            <span class="badge bg-light text-dark">{{ getEmpleado().length }}</span>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-sm table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th class="fw-semibold">Apellidos</th>
                    <th class="fw-semibold">Nombre</th>
                    <th class="fw-semibold">Email</th>
                    <th class="fw-semibold">Móvil</th>
                    <th class="fw-semibold">Puesto</th>
                    <th class="text-center fw-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="empleado in getEmpleado()" :key="empleado.id">
                    <td>{{ empleado.apellidos }}</td>
                    <td>{{ empleado.nombre }}</td>
                    <td>{{ empleado.email }}</td>
                    <td>{{ empleado.movil }}</td>
                    <td>{{ empleado.puesto }}</td>
                    <td class="text-center">
                      <div class="d-flex justify-content-center gap-2">
                        <button
                          @click="selEmpleado(empleado.id)"
                          class="btn btn-sm btn-primary"
                          title="Editar empleado"
                          aria-label="Editar empleado"
                        >
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button
                          @click="delEmpleado(empleado.id)"
                          class="btn btn-sm btn-danger"
                          title="Eliminar empleado"
                          aria-label="Eliminar empleado"
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
            <div v-if="getEmpleado().length === 0" class="text-center py-5 text-muted">
              <p class="mb-0">No hay empleados registrados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';

  // =============== Declaración de variables ===============
  
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
      },
      {
        id: 6,
        apellidos: 'Moreno Jiménez',
        nombre: 'Laura',
        email: 'laura.moreno@empresa.com',
        movil: '667890123',
        puesto: 'Contabilidad'
      },
      {
        id: 7,
        apellidos: 'Ruiz Gómez',
        nombre: 'Miguel',
        email: 'miguel.ruiz@empresa.com',
        movil: '678901234',
        puesto: 'Almacén'
      },
      {
        id: 8,
        apellidos: 'Castillo Vargas',
        nombre: 'Isabel',
        email: 'isabel.castillo@empresa.com',
        movil: '689012345',
        puesto: 'Ventas'
      },
      {
        id: 9,
        apellidos: 'Navarro Romero',
        nombre: 'Diego',
        email: 'diego.navarro@empresa.com',
        movil: '690123456',
        puesto: 'RRHH'
      },
      {
        id: 10,
        apellidos: 'Soto Vega',
        nombre: 'Patricia',
        email: 'patricia.soto@empresa.com',
        movil: '601234567',
        puesto: 'Contabilidad'
      }
    ]);

    const nuevoEmpleado = ref({
      id: '',
      apellidos: '',
      nombre: '',
      email: '',
      movil: '',
      puesto: ''
    });

    const editando = ref(false);

    onMounted(async () => {
      recargarForm();
    })

  // =============== Funciones CRUD ===============

    const addEmpleado = async () => {
      if (!nuevoEmpleado.value.id) {
        nuevoEmpleado.value.id = ultimoID() + 1;
      }

      // Buscar si existe para actualizar
      const indice = arrayEmpleados.value.findIndex(e => e.id === nuevoEmpleado.value.id);
      if (indice !== -1) {
        arrayEmpleados.value[indice] = { ...nuevoEmpleado.value };
        recargarForm();
        return;
      }

      // Si no existe, añadir nuevo
      arrayEmpleados.value.push({ ...nuevoEmpleado.value });
      recargarForm();
    }

    const getEmpleado = () => {
      return arrayEmpleados.value;
    }

    const selEmpleado = async (id) => {
      const empleado = arrayEmpleados.value.find((e) => e.id === id);
      if (empleado) {
        nuevoEmpleado.value = { ...empleado };
        editando.value = true;
      }
    }

    const delEmpleado = async (id) => {
      arrayEmpleados.value = arrayEmpleados.value.filter((e) => e.id !== id);
    }

  // =============== Funciones Auxiliares ===============

    // Capitalización del Texto
      const capitalizarTexto = (campo) => {
        const texto = nuevoEmpleado.value[campo] ?? '';
        nuevoEmpleado.value[campo] = texto
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
      nuevoEmpleado.value = {
        id: '',
        apellidos: '',
        nombre: '',
        email: '',
        movil: '',
        puesto: ''
      };
      editando.value = false;
    }

    const ultimoID = () => {
      return arrayEmpleados.value.length
    }

</script>

<style scoped>
/* =============== Contenedor Principal =============== */
.container-fluid {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* =============== Typography =============== */
h1 {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  letter-spacing: -0.5px;
}

.form-label {
  font-size: 0.95rem;
  color: #495057;
  margin-bottom: 0.5rem;
}

/* =============== Cards =============== */
.card {
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 1rem;
  font-weight: 600;
}

.card-body {
  padding: 1.5rem;
}

/* =============== Formulario =============== */
.form-control,
.form-select {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.625rem 0.875rem;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

.form-control-plaintext {
  padding: 0.625rem 0;
  font-weight: 600;
  color: #495057;
  border: none;
  background-color: transparent;
}

/* =============== Botones =============== */
.btn {
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0b5ed7;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}

.btn-sm {
  padding: 0.35rem 0.65rem;
  font-size: 0.85rem;
}

/* =============== Tabla =============== */
.table {
  font-size: 0.95rem;
  margin-bottom: 0;
}

.table thead th {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 0.75rem;
  color: #495057;
  font-size: 0.85rem;
}

.table tbody tr {
  border-bottom: 1px solid #dee2e6;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table tbody td {
  padding: 0.75rem;
  vertical-align: middle;
  color: #212529;
}

.table-responsive {
  max-height: 600px;
  overflow-y: auto;
}

/* =============== Badge =============== */
.badge {
  padding: 0.375rem 0.625rem;
  font-size: 0.85rem;
  font-weight: 500;
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

/* =============== Utilidades =============== */
.hr {
  margin: 0.5rem 0 1rem 0;
}

.border-primary {
  border-color: #0d6efd !important;
}

.border-2 {
  border-width: 2px !important;
}

.text-muted {
  color: #6c757d !important;
}
</style>