<template>
  <h4>Gestión de Empleados</h4>
  <div>
    <form @submit.prevent="addEmpleado">
      <label for="id">ID:</label>
      <input
        type="number"
        id="id"
        v-model="nuevoEmpleado.id"
        disabled
      />
      
      <label for="apellidos">Apellidos:</label>
      <input
      type="text"
      id="apellidos"
      v-model="nuevoEmpleado.apellidos"
      @blur="capitalizarTexto('apellidos')"
      />

      <label for="nombre">Nombre:</label>
      <input
        type="text"
        id="nombre"
        v-model="nuevoEmpleado.nombre"
        @blur="capitalizarTexto('nombre')"
        required
      />

      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="nuevoEmpleado.email"
        required
      />

      <label for="movil">Móvil:</label>
      <input
        type="text"
        id="movil"
        v-model="nuevoEmpleado.movil"
      />

      <label for="puesto">Puesto:</label>
      <select
        id="puesto"
        v-model="nuevoEmpleado.puesto"
        class="form-select"
      >
        <option disabled value="">Seleccione puesto</option>
        <option value="RRHH">RRHH</option>
        <option value="Contabilidad">Contabilidad</option>
        <option value="Almacén">Almacén</option>
        <option value="Ventas">Ventas</option>
      </select>
      
      <button type="submit">
        {{ editando ? 'Actualizar' : 'Guardar' }}
      </button>
    </form>

    <!-- Lista de Clientes -->
    <div>
      <h4>Listado Clientes</h4>
      <table>
        <thead>
          <tr >
            <th>ID</th>
            <th>Apellidos</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Móvil</th>
            <th>Puesto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empleado in getEmpleado()" :key="empleado.id" >
            <th>{{ empleado.id }}</th>
            <td>{{ empleado.apellidos }}</td>
            <td>{{ empleado.nombre }}</td>
            <td>{{ empleado.email }}</td>
            <td>{{ empleado.movil }}</td>
            <td>{{ empleado.puesto }}</td>
            <td>
              <button
                @click="selEmpleado(empleado.id)"
                title="Editar empleado"
                aria-label="Editar empleado"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                @click="delEmpleado(empleado.id)"
                title="Eliminar empleado"
                aria-label="Eliminar empleado"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
</style>