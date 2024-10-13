declare module 'vuex' {
    import { Store,useStore } from 'vuex';
    export * from 'vuex'; // Export everything from vuex
  
    // Allow usage of `createStore` with type parameters
    export function createStore<T>(options: StoreOptions<T>): Store<T>;
    export function useStore<T = any>(): Store<T>;
  }
  

//   // src/types/vuex.d.ts
// import { Store, StoreOptions } from 'vuex';

// // Declare the vuex module
// declare module 'vuex' {
//   // Export everything from vuex
//   export * from 'vuex';

//   // Allow usage of `createStore` with type parameters
//   export function createStore<T>(options: StoreOptions<T>): Store<T>;

//   // Export the `useStore` function with a generic type parameter
// //   export function useStore<T = any>(): Store<T>;
// }