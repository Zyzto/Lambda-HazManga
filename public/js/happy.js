setTimeout(() => {
    $(".alert").fadeOut(2000, function () {
        $(this).remove();
    });
}, 3000);