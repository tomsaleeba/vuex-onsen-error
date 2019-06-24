A repo with a minimal reproduction of an error when using Vue-Onsen and Vuex. When using a custom component that is imported into the parent component and defined in `components: {}`, and the child has a `props: {}` key in the definition, we get the following errors in the browser console:

```
[Vue warn]: Error in callback for watcher "function () { return this._data.$$state }": "Error: [vuex] do not mutate vuex store state outside mutation handlers."
(found in <Root>)
```

```
vue.runtime.esm.js?2b0e:1888 Error: [vuex] do not mutate vuex store state outside mutation handlers.
    at assert (vuex.esm.js?2f62:90)
    at Vue.store._vm.$watch.deep (vuex.esm.js?2f62:774)
    at Watcher.run (vue.runtime.esm.js?2b0e:4562)
    at Watcher.update (vue.runtime.esm.js?2b0e:4536)
    at Dep.notify (vue.runtime.esm.js?2b0e:730)
    at Object.reactiveSetter [as props] (vue.runtime.esm.js?2b0e:1055)
    at normalizeProps (vue.runtime.esm.js?2b0e:1449)
    at mergeOptions (vue.runtime.esm.js?2b0e:1521)
    at Function.Vue.extend (vue.runtime.esm.js?2b0e:5153)
    at createComponent (vue.runtime.esm.js?2b0e:3184)
```

Quick investigation:
  1. when we're on line
     [vue.runtime.esm.js:3184](https://github.com/vuejs/vue/blob/v2.6.10/dist/vue.runtime.esm.js#L3184)
  1. and we're about to process `Blah.vue` for the first time, that when the
     errors appear


## How to run
You can run each case by:
```bash
cd dir/
yarn install
yarn dev
# open the page (localhost:8080 probably) in your browser
```


## fail

Shows the case where it breaks. We have:

  - the AppNavigator as the containing page, which has the `<v-ons-navigator>`
  - Onboarder gets pushed onto the nav stack (we would use a check to only show this on first load, but this is a simple case)
  - we import our Blah component in the Onboarder component that uses it (not globally)


## works-1

If we comment out the `props: {}` in the Blah component, the error doesn't
happen (but the Blah component isn't very usable).

Diff:
```diff
*** ../fail/src/partials/Blah.vue       2019-06-24 14:20:07.715666272 +0930
--- ./src/partials/Blah.vue     2019-06-24 14:24:04.189009719 +0930
***************
*** 4,9 ****

  <script>
  export default {
!   props: {}, // this is what triggers the error, comment it and no error!
  }
  </script>
--- 4,9 ----

  <script>
  export default {
!   // props: {}, // if we comment this, everything works
  }
  </script>
```

## works-2

If we define and handle the Blah component in `main.js` (globally), the error
doesn't happen.

Diff:
```diff
*** ../fail/src/main.js 2019-06-24 14:15:06.258986665 +0930
--- ./src/main.js       2019-06-24 14:26:32.545682724 +0930
***************
*** 7,12 ****
--- 7,16 ----
  import AppNavigator from '@/AppNavigator'
  import store from '@/store'

+ // importing our component at the top level avoids the error message
+ import Blah from '@/partials/Blah'
+ Vue.component('blah', Blah)
+
  Vue.use(VueOnsen)
  Vue.config.productionTip = false

*** ../fail/src/AppNavigator.vue        2019-06-24 15:50:26.002566786 +0930
--- ./src/AppNavigator.vue      2019-06-24 15:43:02.315880796 +0930
***************
*** 4,13 ****
 
  <script>
  import Onboarder from '@/Onboarder'
! import Blah from '@/partials/Blah'

  export default {
!   components: { Blah },
    beforeCreate() {
      this.$store.commit('navigator/push', Onboarder)
    },
--- 4,13 ----

  <script>
  import Onboarder from '@/Onboarder'
! // import Blah from '@/partials/Blah' // we handle this in main.js

  export default {
!   // components: { Blah },
    beforeCreate() {
      this.$store.commit('navigator/push', Onboarder)
    },
```
