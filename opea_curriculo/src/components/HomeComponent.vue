<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand d-flex justify-content-start">
        <img src="@/assets/logo opea.png" alt="" />
      </a>
      <div class="user-box d-flex justify-content-end">
        <span class="text-jost">Lael Amaral</span>
        <img src="@/assets/icon-user.png" />
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="d-flex mt-5 justify-content-end">
      <form
        class="d-flex search-box"
        role="search"
        @submit.prevent="filterByEnterprise"
      >
        <input
          class="form-control"
          placeholder="Buscar empresa..."
          v-model="searchedEnterprise"
        />
        <img
          src="@/assets/search.svg"
          alt="Buscar"
          @click="filterByEnterprise"
        />
      </form>
    </div>

    <div
      class="button-add-enterprise text-center"
      data-bs-toggle="modal"
      data-bs-target="#enterpriseModal"
    >
      <img src="@/assets/group_300.svg" />
      <div class="text-add-enterprise">
        <span class="text-center text-jost">Adicionar Empresa</span>
      </div>
    </div>

    <table class="table table-item">
      <tbody>
        <tr v-for="enterprise in listOfEnterprises" :key="enterprise.email">
          <th class="listed-enterprise" @click="enterpriseToEdit(enterprise)">
            <img src="@/assets/group_undisabled.svg" />
          </th>
          <td class="enterprise-data">
            <p>{{ enterprise.name }}</p>
            <p>
              <span>CNPJ: {{ maskFromCNPJ(enterprise.cnpj) }}</span>
              <span class="sm-block"> - </span>
              <span>Email: {{ enterprise.email }} </span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      class="modal fade"
      id="enterpriseModal"
      tabindex="-1"
      aria-labelledby="enterpriseModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-size">
        <div class="modal-content modal-start">
          <div class="modal-header custom-modal-header">
            <h1
              class="register_company text-jost text-local"
              id="enterpriseModalLabel"
            >
              {{ isUpdateModal ? "Editar Empresa" : "Cadastrar Empresa" }}
            </h1>

            <button
              type="button"
              class="closer-button"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="clearEnterpriseObject"
            >
              <img src="@/assets/close.png" />
            </button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="label-form" for="name">Nome</label>
              <input
                v-model="enterPriseData.name"
                type="text"
                maxlength="40"
                class="form-control name-container"
                id="name"
              />
            </div>

            <div class="form-group mt-2">
              <label class="label-form" for="cnpj">CNPJ</label>
              <input
                v-model="enterPriseData.cnpj"
                type="text"
                maxlength="18"
                class="form-control name-container"
                id="cnpj"
              />
            </div>

            <div class="form-group mt-2">
              <label class="label-form" for="email">E-mail</label>
              <input
                v-model="enterPriseData.email"
                type="email"
                max-length="60"
                class="form-control name-container"
                id="email"
              />
            </div>
          </div>

          <div class="modal-footer modal-footer-custom col">
            <div v-show="isUpdateModal" class="col-4">
              <img
                src="@/assets/trash.svg"
                alt="Excluir"
                class="trash-button"
                @click="deleteEnterprise"
              />
            </div>

            <div
              :class="isUpdateModal ? 'col-8' : 'col-12'"
              class="d-flex justify-content-around"
            >
              <button
                type="button"
                class="btn-cancel"
                @click.prevent="closeModal"
              >
                Cancelar
              </button>

              <button
                v-if="!isUpdateModal"
                type="button"
                class="btn-register"
                @click.prevent="createEnterprise"
              >
                Cadastrar
              </button>
              <button
                v-else
                type="button"
                class="btn-register"
                @click.prevent="updateEnterprise"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EnterpriseService from "@/services/EnterpriseService";

const enterpriseService = new EnterpriseService();
const enterPriseData = ref({
  name: "",
  cnpj: "",
  email: "",
});

const isUpdateModal = ref(false);
const searchedEnterprise = ref("");

const listOfEnterprises = ref([]);
const bkplistOfEnterprises = ref([]);

function loadEnterprises() {
  enterpriseService
    .getEnterprises()
    .then((response) => {
      listOfEnterprises.value = bkplistOfEnterprises.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function clearEnterpriseObject() {
  enterPriseData.value = {
    name: "",
    cnpj: "",
    email: "",
  };
}

function closeModal() {
  const buttonClose = document.querySelector(".closer-button");
  buttonClose.click();
}

function createEnterprise() {
  isUpdateModal.value = false;
  enterpriseService
    .createEnterprise(enterPriseData.value)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Falha ao cadastrar o usuário");
      }

      loadEnterprises();
    })
    .catch((error) => {
      alert(error.message);
    })
    .finally(() => {
      closeModal();
    });
}

function updateEnterprise() {
  const enterpriseId = enterPriseData.value.id;
  delete enterPriseData.value.id;

  enterpriseService
    .updateEnterprise(enterpriseId, enterPriseData.value)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Falha ao atualizar o usuário");
      }

      loadEnterprises();
    })
    .catch((error) => {
      alert(error.message);
    })
    .finally(() => {
      closeModal();
    });
}

function deleteEnterprise() {
  enterpriseService
    .deleteEnterprise(enterPriseData.value.id)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error("Falha ao remover o usuário");
      }
      loadEnterprises();
    })
    .catch((error) => {
      alert(error.message);
    })
    .finally(() => {
      closeModal();
    });
}

function enterpriseToEdit(enterpriseToEdit) {
  const openEditModal = document.querySelector('[data-bs-toggle="modal"]');
  isUpdateModal.value = true;
  enterPriseData.value = enterpriseToEdit;

  openEditModal.click();
}

function filterByEnterprise() {
  if (!searchedEnterprise.value) {
    listOfEnterprises.value = bkplistOfEnterprises.value;
    return;
  }

  listOfEnterprises.value = bkplistOfEnterprises.value.filter((enterprise) => {
    const currentEnterprise = enterprise.name.toLowerCase();
    return (
      currentEnterprise.search(searchedEnterprise.value.toLowerCase()) != -1
    );
  });
}

function maskFromCNPJ(cnpj) {
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

onMounted(() => {
  loadEnterprises();
});
</script>

<style lang="scss" src="./home-style.scss" scoped/>
