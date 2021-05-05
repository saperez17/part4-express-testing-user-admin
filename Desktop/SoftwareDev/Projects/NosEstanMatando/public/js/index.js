hamburguerHandler = $("#burguer");
hamburguesMenu = $("#nav-links");
hamburguerHandler.click(()=>{
    hamburguerHandler.toggleClass("is-active");
    hamburguesMenu.toggleClass("is-active");
})