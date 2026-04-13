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
              <!-- ID Field (Hidden if empty) -->
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

              <!-- Apellidos Field -->
              <div class="col-12">
                <label for="apellidos" class="form-label">Apellidos:</label>
                <input
                  type="text"
                  id="apellidos"
                  v-model="nuevaTarea.apellidos"
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
                  v-model="nuevaTarea.nombre"
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
                  v-model="nuevaTarea.email"
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
                  v-model="nuevaTarea.movil"
                  class="form-control"
                  placeholder="612345678"
                />
              </div>

              <!-- Puesto Dropdown -->
              <div class="col-12">
                <label for="puesto" class="form-label">Puesto:</label>
                <select
                  id="puesto"
                  v-model="nuevaTarea.puesto"
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
            <h5 class="mb-0">Listado de Tareas</h5>
            <span class="badge bg-light text-dark">{{ getTarea().length }}</span>
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
                  <tr v-for="tarea in getTarea()" :key="tarea.id">
                    <td class="align-middle">{{ tarea.apellidos }}</td>
                    <td class="align-middle">{{ tarea.nombre }}</td>
                    <td class="align-middle">{{ tarea.email }}</td>
                    <td class="align-middle">{{ tarea.movil }}</td>
                    <td class="align-middle">{{ tarea.puesto }}</td>
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

  // =============== Declaración de variables ===============
  
    const arrayTareas = ref([
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

    const nuevaTarea = ref({
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
        apellidos: '',
        nombre: '',
        email: '',
        movil: '',
        puesto: ''
      };
      editando.value = false;
    }

    const ultimoID = () => {
      return arrayTareas.value.length
    }

</script>

<style scoped>
</style>