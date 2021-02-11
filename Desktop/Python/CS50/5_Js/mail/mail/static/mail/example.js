function apply_challenge(){
    const my_btn = document.getElementById('btn_apply');
    const challenge = my_btn.getAttribute('data-challenge');
    console.log('Challenge: ', challenge);

}