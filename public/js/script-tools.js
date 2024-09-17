document.addEventListener('DOMContentLoaded', () => {
    const color = localStorage.getItem('color');
    if (color) {
        document.body.style.background = color;
    }
    else{
        document.body.style.background = 'linear-gradient(40deg, rgb(9, 4, 34), rgb(22, 48, 103))';
    }
    const toolForm = document.querySelector('.toolForm');
    const aspectBtns = document.querySelectorAll('.aspectRatio');
    const input = document.getElementById('toolInput')


    //Image generation
    if (aspectBtns.length>0){
        aspectBtns.forEach(btn => {
            btn.addEventListener('click', () => selectAspectRation(btn));
        });
    }
    if (toolForm){
        toolForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            enableLoad();
            const prompt = input.value;
            generateImage(prompt);
            input.disabled = true;
        });
    }
});

let currentAspect = '1:1';

function generateImage(prompt){
    const imageHolder = document.querySelector('.imageResult');
    const toolContainer = document.querySelector('.toolContainer');
    const userIdContent = document.getElementById('userContent').textContent
    //Increment Image generation count
    $.ajax({
        url: '/api/user/incrementImageGenerated',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ userId: userIdContent }),
        success: function(response) {
            console.log('Prompt count incremented successfully:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error incrementing prompt count:', error);
        }
    });
    //Activity
    const activityData = {
        userId: userIdContent,
        action: "Image generated"
    };
    $.ajax({
        url: '/api/user/createActivity',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(activityData),
        success: function(response) {
            console.log('Activity created successfully:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error creating activity:', error);
        }
    });
    //Generate image
    $.ajax({
        url: '/api/image/generateImage',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ prompt: prompt, aspect_ratio: currentAspect}),
        success: function(response) {
            const img = new Image();
            img.src = 'data:image/png;base64,' + response;
            imageHolder.innerHTML = ''
            imageHolder.appendChild(img);
            imageHolder.innerHTML += `
                <div class="imageOptions">
                    <a href="/tools/image">Start again</a>
                    <a id="downloadBtn" href=""><i class="bi bi-download"></i></a>
                </div>
            `;
            const downloadButton = document.getElementById("downloadBtn")
            downloadButton.href = img.src;
            downloadButton.download = window.crypto.randomUUID()+'.png';

            gsap.to(toolContainer, {opacity: 0, duration: 0.75,
                onComplete(){
                    toolContainer.style.display = 'none';
                    imageHolder.style.zIndex = 1;
                    gsap.to(imageHolder, {opacity: 1, duration: 0.75});
                }
            });
        },
        error: function(xhr, status, error) {
            console.error('Error generating image:', error);
        }
        
    });
}

function selectAspectRation(element){
    const aspectBtns = document.querySelectorAll('.aspectRatio');
    aspectBtns.forEach(btn => btn.classList.remove('selectedAspectRatio'));
    element.classList.add('selectedAspectRatio');
    currentAspect = element.getAttribute('data-aspectRatio');
}

function enableLoad(){
    gsap.to("#toolTitle", {y: "-100%", duration: 0.5, ease: "back"});
    gsap.to(".loaderHolder", {opacity: 1, duration: 0.5});
}

function disableLoad(){
    gsap.to(".loaderHolder", {opacity: 0, duration: 0.5});
}
