module.exports = User.findById(response.locals.currentUser._id).then(user => {
    const count = counta(user.cart)
    Item.find({
        _id: user.cart
    }).then(cart => {
        console.log('name', cart[0])
        console.log(`count`, count[cart[0]._id]);
        response.render('cart', {
            count: count,
            cart
        })
    })
})
