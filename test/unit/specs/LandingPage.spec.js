import Vue from 'vue'
import LandingPage from '@/components/pages/Welcome'

describe('LandingPage.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(LandingPage)
    }).$mount()

    expect(vm.$el.querySelector('.title').textContent).to.contain('Welcome to the Electron-vue + Vuetify template.')
  })
})
