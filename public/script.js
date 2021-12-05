const now = new Date();
const agenda = document.getElementById('agenda');

let elements = document.getElementsByClassName('item');
for (i=0; i<elements.length; i++) {
    let item = elements[i];
    let date = new Date(item.children[1].innerText);
    if (date.getFullYear() >= now.getFullYear()) {
        if (date.getMonth() >= now.getMonth()) {
            if (date.getDate() >= now.getDate()) {
                agenda.scrollTo(0,0);
                item.scrollIntoView();
                agenda.scrollBy(window.innerWidth-item.offsetWidth-50, 0)
                //agenda.scrollBy(window.innerWidth/2-item.offsetWidth,0)
                break;
            }
        }
    }
}