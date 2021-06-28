
document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', ()=> load_mailbox('compose'));

  // By default, load the inbox
  load_mailbox('inbox');
  
});

function compose_email() {
  console.log("inside compose");
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('form').onsubmit = function(){
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;
  
    send_mail_fn(recipients, subject, body);
    return false;
  };
}

function send_mail_fn(recipients, subject, body){
  fetch('/emails', {
    method:'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body:  body,
    })
  })
  .then(response => {
    return response.json();
  })
  .then(result => {
    //Print result
    console.log(result);
    alert(result.message);
    load_mailbox('sent')
  });
}

function load_mailbox(mailbox) {
  console.log('default behavior');
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  if (!document.querySelector('#title')){
    const mailbox_name = document.createElement('h3');
    mailbox_name.innerHTML =`<h3 id='title'>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
    document.querySelector('#emails-view').appendChild(mailbox_name);
  }else{
    document.querySelector('#title').innerHTML = `${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}`;
  }

  
  
  if (mailbox == 'inbox'){
    
    let container;
    if (!document.querySelector('.inbox-email')){
      container = document.createElement('div');
      setAttributes(container, {"class":"container-fluid inbox-email"});
      document.querySelector('#emails-view-body').appendChild(container);
    }else{
      
      if (document.querySelector('.sent-email')){
        document.querySelector('.sent-email').style.display = 'none';
      }
      if (document.querySelector('.archive-email')){
        document.querySelector('.archive-email').style.display = 'none';
      }
      document.querySelector('.inbox-email').style.display = 'block';
      container = document.querySelector('.inbox-email');
      container.innerHTML="";
    }

    displayMailbox(container, 'inbox');
    
  }

  if (mailbox == 'sent'){
    document.querySelector('.inbox-email').style.display = 'none';
    let container;
    if (!document.querySelector('.sent-email')){
      container = document.createElement('div');
      setAttributes(container, {"class":"container-fluid sent-email"});
      document.querySelector('#emails-view-body').appendChild(container);
    }else{
      document.querySelector('.inbox-email').style.display = 'none';
      document.querySelector('.sent-email').style.display = 'block';
      if(document.querySelector('.archive-email')){
        document.querySelector('.archive-email').style.display = 'none';
      }
      if (document.querySelector('.compose-email')){
        document.querySelector('.compose-email').style.display='none';}
      container = document.querySelector('.sent-email');
    }
    displayMailbox(container, 'sent');
  }

  if (mailbox == 'archive'){
    document.querySelector('.inbox-email').style.display = 'none';
    if (document.querySelector('.sent-email')){
      document.querySelector('.sent-email').style.display = 'none';
    }
    
    let container;
    if (!document.querySelector('.archive-email')){
      container = document.createElement('div');
      setAttributes(container, {"class":"container-fluid archive-email"});
      document.querySelector('#emails-view-body').appendChild(container);
    }else{
      document.querySelector('.archive-email').style.display = 'block';
      container = document.querySelector('.archive-email');
    }
    displayMailbox(container, 'archive');
  }

  if (mailbox == 'compose'){
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('.inbox-email').style.display = 'none';
    if (document.querySelector('.archive-email')){
      document.querySelector('.archive-email').style.display='none';}
    if (document.querySelector('.sent-email')){
        document.querySelector('.sent-email').style.display='none';}
    compose_email();
  }

  if (document.querySelector('#emails-detail')){
    document.querySelector('#emails-detail').style.display = 'none';
  }

}

function displayEmailDetails(email, mailbox_str){
  document.querySelector('#emails-detail').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#from_email').innerHTML =  `${email.sender}`;
  document.querySelector('#to_email').innerHTML =  `${email.recipients[0]}`;
  document.querySelector('#subject_email').innerHTML =  `${email.subject}`;
  document.querySelector('#time_email').innerHTML =  `${email.timestamp}`;
  document.querySelector('#body_email').innerHTML = '';
  document.querySelector('#body_email').appendChild(document.createTextNode(email.body));
  let btn_reply = document.querySelector('#btn_reply');
  let btn_archieve = document.querySelector('#btn_archive');
  if (mailbox_str=='archive'){
    btn_archieve.innerHTML = 'Unarchive'
    btn_archieve.onclick = function(){archive_email(email, false)};
  }
  else if(mailbox_str=='inbox'){
    btn_archieve.innerHTML = 'Archive';
    btn_archieve.onclick = function(){archive_email(email, true)};
  }
  
  btn_reply.addEventListener('click', () => reply_email(email));

  console.log(email.id);
  fetch(`emails/${email.id}`, {
    method:"PUT",
    body: JSON.stringify({
      read:true
    })
  })
  
}

function displayMailbox(container, mailbox_str){
  fetch(`/emails/${mailbox_str}`)
  .then(response => response.json())
  .then(result => {
    console.log(result);
    
    if (container.childElementCount < result.length ){
      console.log('hi');
          // if (result.length < document.getElementsByClassName('container-'))
    result.forEach(email => {
      if (mailbox_str=='archive'){
        if(email.archived){
          // let btn_unarchive = document.querySelector('#btn_archive');
          // btn_unarchive.innerHTML='Unarchive';
          // btn_unarchive.onclick = function(){archive_email(email, false)};
          createHtmlEmail(email, mailbox_str, container);
        }
      }else if (mailbox_str=='inbox'){
        if (!email.archived){
          createHtmlEmail(email, mailbox_str, container);
        }
      }else if(mailbox_str=='sent'){
        if (email.sender==document.querySelector('#user_email').innerHTML){
          console.log("Printing user sent emails");
          console.log(email);
          createHtmlEmail(email, mailbox_str, container);
        }
      }
      
    });
    const view = document.querySelector('#emails-view');
  view.insertAdjacentElement('beforeend', container);
    }else if(mailbox_str=='inbox'){
      let inbox_email = document.querySelector('.inbox-email');
      for (var i=0; i<result.length; i++){
        if (result[i].read){
          let div_row = inbox_email.childNodes[i];
          setAttributes(div_row, {"class":"row", "style":'border: 1px gray solid; cursor:pointer; background-color:gray'})
          
        }

      }
    }
    
  }) 
}
function archive_email(email, decision){
  console.log('archive this email', email.id);
  fetch(`/emails/${email.id}`, {
    method:"PUT",
    body: JSON.stringify({
      archived:decision
    })
  })
  .then(response => response)
  .then(result => {
    console.log(result);
  })
  alert('Email Archived Successfully');
  load_mailbox('inbox');

}

function createHtmlEmail(email, mailbox_str, container){
    
  let div_row = document.createElement('div');
  // setAttributes(div_row, {"class":"row", "style":'border: 1px gray solid; cursor:pointer'})
  if (mailbox_str=='inbox'){
    if(!email.read){
      setAttributes(div_row, {"class":"row", "style":'border: 0.5px white solid; cursor:pointer; background-color:white;'})
    }else{
      setAttributes(div_row, {"class":"row", "style":'border: 0.5px white solid; cursor:pointer; background-color:gray;'})
    }
  }else{
    setAttributes(div_row, {"class":"row", "style":'border: 0.5px white solid; cursor:pointer; background-color:white;'})
    
  }

  div_row.addEventListener('click', ()=> {
    displayEmailDetails(email, mailbox_str);
  }
  );

  //element that will hold sender's email
  let col_email = document.createElement('div');
  setAttributes(col_email, {'class':'col-3', 'style':'padding-right: 0px; font-weight: bold;'})
  let col_email_body = document.createElement('div');
  setAttributes(col_email_body, {'class':'col-4'});
  let col_email_date = document.createElement('div');
  setAttributes(col_email_date, {'class':'col-5'});
  
  let timestamp = document.createElement("div");
  
  
  setAttributes(timestamp, {"class":"text-wrap"});

  let date_container = document.createElement('div');
  setAttributes(date_container, {'class':'d-flex justify-content-end'});
  
  // let sender_email = document.createTextNode(email.sender);
  let sender_email = document.createElement('div');
  sender_email.innerHTML = `${email.sender}`;
  
  // let email_body = document.createTextNode(email.subject);
  let email_subject = document.createElement('div');
  setAttributes(email_subject, {'style':'width:150px'})
  email_subject.innerHTML = `${email.subject}`;
  // setAttributes(email_body,{'style':'width:120px;'});
    timestamp.innerHTML = email.timestamp;
    date_container.appendChild(timestamp);
    col_email.appendChild(sender_email);
    col_email_date.appendChild(date_container);
    

    div_row.appendChild(col_email);
    div_row.appendChild(email_subject);
    div_row.appendChild(col_email_date);

    if (mailbox_str=='inbox'){
      // let col_btn = document.createElement('div');
      // setAttributes(col_btn, {'class':'col', 'style':'text-align:right'});
      // archive_btn = document.createElement("button");
      // archive_btn.innerHTML = 'Archive';
      // setAttributes(archive_btn, {'class':'btn btn-secondary', 'style':'width:80px;'});
      // archive_btn.addEventListener('click', () => archive_email(email));
      // setAttributes(archive_btn, {"class":"btn btn-secondary"});
      // col_btn.appendChild(archive_btn);
      // div_row.appendChild(col_btn);
    }
  
    container.appendChild(div_row);
}
function setAttributes(el, attrs){
  for (var key in attrs){
    el.setAttribute(key, attrs[key]);
  }
}

function reply_email(email){
  
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-detail').style.display = 'none';
      // Show the mailbox name
      if (!document.querySelector('#title')){
        const mailbox_name = document.createElement('h3');
        mailbox_name.innerHTML =`<h3 id='title'>New Email</h3>`;
        document.querySelector('#compose-view').appendChild(mailbox_name);
      }else{
        let compose_view = document.querySelector('#compose-view');
        document.querySelector('#title').innerHTML = 'New Email';
        compose_view.insertBefore(document.querySelector('#title'),compose_view.firstChild);
      }
  document.querySelector('#compose-recipients').value = `${email.sender}`;
  let sub = document.querySelector('#compose-subject').value;
  if(sub.includes("Re:")){
   document.querySelector('#compose-subject').value = `${email.subject}`; 
  }else{
    document.querySelector('#compose-subject').value = `Re: ${email.subject}`;  
  }
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote:\n ${email.body}`;
  
  let btn_submit = document.querySelector('#btn-submit');
  document.querySelector('form').onsubmit = function(){
    const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  console.log(`Mail body ${body}`);
    send_mail_fn(recipients, subject, body);
  }
  
//"On Jan 1 2020, 12:00 AM foo@example.com wrote:"
  // document.querySelector('form').onsubmit = function(){
  //   const recipients = document.querySelector('#compose-recipients').value;
  //   const subject = document.querySelector('#compose-subject').value;
  //   const body = document.querySelector('#compose-body').value;
  //   fetch('/emails', {
  //     method:'POST',
  //     body: JSON.stringify({
  //       recipients: recipients,
  //       subject: subject,
  //       body:  body,
  //     })
  //   })
  //   .then(response => response.json())
  //   .then(result => {
  //     //Print result
  //     // console.log(result);
  //     document.querySelector('#emails-view').style.display = 'block';
  //     document.querySelector('#compose-view').style.display = 'none';
  //     document.querySelector('#emails-detail').style.display = 'none';
  //   })

  //   return false;
  // };

  

  
}

function display_inbox(email){

}



