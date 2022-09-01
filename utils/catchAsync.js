module.exports = (fn) => {
    return (req, res, next) => { //return a middleware to assign, not calling directly
        fn(req, res, next).catch(next); //call async function, if we call fn directly, it doesn't know req, res, next.
    }
}