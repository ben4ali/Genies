document.addEventListener('DOMContentLoaded', () => {
    const color = localStorage.getItem('color');
    if (color) {
        document.body.style.background = color;
        colors.forEach(color => {
            if (color.getAttribute('data-colorValue') === color) {
                selectColor(color);
            }
        });
    }
    else{
        document.body.style.background = 'linear-gradient(40deg, rgb(9, 4, 34), rgb(22, 48, 103))';
    }
    colors.forEach(color => {
        if (color.getAttribute('data-colorValue') === document.body.style.background) {
            selectColor(color);
        }
    });
});
const content = document.getElementById('content');
gsap.to(content.children, { 
    delay:0.25,
    duration: 0.5, 
    opacity: 1, 
    stagger: 0.2, 
    ease: "sine"
})
const colors = document.querySelectorAll('.color');
function selectColor(element){
    colors.forEach(color => {
        color.classList.remove('selectedColor');
    });
    element.classList.add('selectedColor');
}
colors.forEach(color => {
    color.addEventListener('click', () => {
        selectColor(color);
        document.body.style.background = color.getAttribute('data-colorValue');
        localStorage.setItem('color', color.getAttribute('data-colorValue'));
    });
});


const editImg = document.querySelector('.editImg');
const dialog = document.querySelector('dialog');
const file = document.getElementById('file');
const form = document.querySelector('form');
const closeBtn = document.getElementById('closeBtn');
editImg.addEventListener('click', () => {
    dialog.showModal();
});
closeBtn.addEventListener('click', () => {
    imgNew.src = "";
    imgOrigin.src = "media/profilPictures/default.png";
    imgNew.style.opacity = 0;
    imgOrigin.style.opacity = 1;
    connection.style.opacity = 0;
    imgNew.style.left = "50%";
    imgOrigin.style.left = "50%";
    form.reset();
    dialog.close();
});

const imgOrigin = document.getElementById('imgOrigin');
const imgNew = document.getElementById('imgNew');
const connection = document.getElementById('connection');

file.addEventListener('change', () => {
    const fileContent = file.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        imgNew.src = reader.result;
        gsap.to(imgNew, {
            opacity: 1,
            duration: 0.75,
            left: "75%",
            ease:"back"
        })
        gsap.to(connection, {
            opacity: 1,
            duration: 0.25
        })
        gsap.to(imgOrigin, {
            opacity: 1,
            duration: 0.75,
            left: "25%",
            ease:"back"
        })
    }
    reader.readAsDataURL(fileContent);
});
const userIdContainer = document.getElementById('userContent');
const activityHolder = document.querySelector('.activityHolder');
const saveHolder = document.querySelector('.saveHolder');
document.addEventListener('DOMContentLoaded', () => {
    const userId = userIdContainer.textContent;
    $.ajax({
        url: `/api/user/getAllActivities?userId=${userId}`,
        type: 'GET',
        success: function(data) {
            data.forEach(activity => {
                const activityDiv = document.createElement('div');
                activityDiv.classList.add('activity');

                const formattedDate = new Date(activity.date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                activityDiv.innerHTML = `
                    <p>${activity.action}</p>
                    <p>${formattedDate}</p>
                `;
                activityHolder.appendChild(activityDiv);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching activities:', error);
        }
    });

    $.ajax({
        url: `/api/user/getSavedConversation?userId=${userId}`, // Adjust the endpoint as per your backend route
        type: 'GET',
        success: function(data) {
            data.reverse().forEach(conversation => {
                const saveDiv = document.createElement('div');
                saveDiv.setAttribute('data-conversation-id', conversation.conversationId);
                saveDiv.classList.add('save');
                const saveHeader = document.createElement('div');
                saveHeader.classList.add('saveHeader');
                const saveTitle = document.createElement('p');
                saveTitle.textContent = 'Prompt';
                const favoriteIcon = document.createElement('i');
                favoriteIcon.classList.add('favorite', 'bi', 'bi-star-fill');
                saveHeader.appendChild(saveTitle);  
                saveHeader.appendChild(favoriteIcon);
                const saveSubtitle = document.createElement('h4');
                saveSubtitle.textContent = conversation.title;
                const saveText = document.createElement('p');
                saveText.textContent = conversation.conversationId;
                saveDiv.appendChild(saveHeader);
                saveDiv.appendChild(saveSubtitle);
                saveDiv.appendChild(saveText);
                saveHolder.appendChild(saveDiv);
            });
            document.querySelectorAll('.favorite').forEach(btn => {
                const requestData = {
                    userId: userIdContainer.textContent,
                    conversationId: btn.parentElement.parentElement.getAttribute('data-conversation-id')
                };
                btn.addEventListener('click', () => {
                    if (btn.classList.contains('bi-star')) {
                        btn.classList.remove('bi-star');
                        btn.classList.add('bi-star-fill');
                    }
                    else {

                        $.ajax({
                            url: '/api/user/unsaveConversation',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(requestData),
                            success: function(response) {
                                btn.classList.remove('bi-star-fill');
                                btn.classList.add('bi-star');
                                btn.parentElement.parentElement.remove();
                            },
                            error: function(xhr, status, error) {
                                console.error('Error unsaving conversation:', error);
                            }
                        });


                    }
                });
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching saved conversations:', error);
        }
    });

    
});
