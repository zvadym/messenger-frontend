import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";

import { mount, createLocalVue } from "@vue/test-utils";
import { createStore } from "vuex-extensions";

import LoginView from "@/views/LoginView.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

Vue.use(Vuetify);

const createConfig = (data = {}) => {
  const store = createStore(Vuex.Store, {
    strict: true,
    state: {},
    modules: {
      auth: {
        namespaced: true,
        actions: {
          tryAutoLogin() {
            return true;
          }
        },
        getters: {
          isAuthenticated() {
            return false;
          }
        }
      }
    }
  });

  return {
    mocks: {},
    sync: false,
    store,
    localVue,
    vuetify: new Vuetify(),
    ...data
  };
};

describe("LoginView.vue", () => {
  it("validate valid form", async () => {
    const wrapper = mount(LoginView, createConfig());

    wrapper.vm.credentials.password = "test";
    wrapper.vm.credentials.email = "test@local.host";

    await wrapper.vm.$nextTick();

    wrapper.vm.$refs.form.validate();
    expect(wrapper.vm.$refs.form.value).toBe(true);
  });
  it("validate invalid form", async () => {
    const wrapper = mount(LoginView, createConfig());

    wrapper.vm.credentials.password = "test";
    wrapper.vm.credentials.email = "wrong_email";

    await wrapper.vm.$nextTick();

    wrapper.vm.$refs.form.validate();

    expect(wrapper.vm.$refs.form.value).toBe(false);
  });
});
