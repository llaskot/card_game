let page_loader_wrapper_element = document.querySelector('.page_loader_wrapper')
if (page_loader_wrapper_element) {
    page_loader_wrapper_element.style.opacity = 0
    setTimeout(
        () => { page_loader_wrapper_element.remove() },
        750
    )
}