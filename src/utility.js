const isServiceSupplier = () => {
    const authObj = JSON.parse(localStorage.getItem('authInfo'))
    return (authObj.data.userType === 'serviceSupplier')
}
const isShipManger = () => {
    const authObj = JSON.parse(localStorage.getItem('authInfo'))
    return (authObj.data.userType === 'shipManager')
}

module.exports = {
    isServiceSupplier, isShipManger
}