// signal.js
export function createSignal(initial:any) {
    let value = initial
    const subscribers = new Set()

    function get() {
        return value
    }

    function set(next:any) {
        value = next
        subscribers.forEach((fn:any) => fn(value))
    }

    function subscribe(fn:any) {
        subscribers.add(fn)
        fn(value) // initial run
        return () => subscribers.delete(fn)
    }

    return { get, set, subscribe }
}